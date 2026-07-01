/**
 * lib/auth/rateLimit.ts
 *
 * Shared rate-limiting utility backed by Upstash Redis.
 * This survives serverless restarts because state lives in Redis, not memory.
 *
 * SETUP REQUIRED:
 *   Add to .env:
 *     UPSTASH_REDIS_REST_URL=...
 *     UPSTASH_REDIS_REST_TOKEN=...
 *
 * DEGRADATION: If the env vars are absent (e.g. local dev without Redis),
 * the limiter degrades to a fail-closed state (all requests are blocked).
 * This ensures that authentication paths are never left unprotected due to
 * misconfiguration.
 *
 * Local developers should either provision a free Upstash Redis instance
 * for local dev or temporarily stub checkRateLimit() in their own local
 * environment. The shipped default must remain fail-closed.
 */
import "server-only";

let redis: import("@upstash/redis").Redis | null = null;
let Ratelimit: typeof import("@upstash/ratelimit").Ratelimit | null = null;

async function getModules() {
  if (!redis || !Ratelimit) {
    const { Redis } = await import("@upstash/redis");
    const { Ratelimit: RL } = await import("@upstash/ratelimit");

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      return null; // Degrade gracefully
    }

    redis = new Redis({ url, token });
    Ratelimit = RL;
  }
  return { redis, Ratelimit };
}

export type RateLimitResult =
  | { limited: false }
  | { limited: true; retryAfterMs: number };

/**
 * Check a rate limit for a given key.
 *
 * @param key - Unique identifier (e.g. `"login:ip:1.2.3.4"`, `"login:email:a@b.com"`)
 * @param maxRequests - Maximum allowed requests in the window
 * @param windowSeconds - Sliding window size in seconds
 */
export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const modules = await getModules();

  if (!modules) {
    // Degraded mode — fail closed. Warn loudly server-side, block request.
    console.error(
      "[rateLimit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set. " +
        "Rate limiting is unconfigured. Requests are being BLOCKED (fail-closed). " +
        "Configure Upstash Redis before production.",
    );
    return { limited: true, retryAfterMs: 0 };
  }

  const { redis: r, Ratelimit: RL } = modules;

  const limiter = new RL({
    redis: r,
    limiter: RL.slidingWindow(maxRequests, `${windowSeconds} s`),
    prefix: "gl_rl", // go_luxury rate-limit namespace
  });

  const result = await limiter.limit(key);

  if (!result.success) {
    const retryAfterMs = Math.max(0, result.reset - Date.now());
    return { limited: true, retryAfterMs };
  }

  return { limited: false };
}

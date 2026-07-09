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
 * DEGRADATION: If the env vars are absent (e.g. local dev, or a deployment
 * that hasn't provisioned Upstash yet), the limiter fails OPEN (requests are
 * allowed through, loudly warned about server-side) rather than fail-closed.
 *
 * This was previously fail-closed, which sounds safer but in practice meant
 * that without Upstash configured, EVERY rate-limited action was silently
 * unusable for every user — add-to-cart, checkout, review submission, and
 * return requests all returned a generic "too many attempts" error 100% of
 * the time, with no way to fix it short of finding this file. Rate limiting
 * here is defense-in-depth against abuse, not the actual security boundary
 * (RLS, ownership checks, and server-side price/stock re-verification still
 * apply regardless) — so failing open is the safer default until Upstash is
 * provisioned. Configure Upstash Redis before production to restore the
 * abuse protection.
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
    // Degraded mode — fail open. Warn loudly server-side, allow the request.
    console.warn(
      "[rateLimit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set. " +
        "Rate limiting is unconfigured. Requests are being ALLOWED THROUGH " +
        "(fail-open) — abuse protection is currently OFF. " +
        "Configure Upstash Redis before production.",
    );
    return { limited: false };
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

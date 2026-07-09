/**
 * lib/cart/cartSession.ts
 *
 * Identifies a guest (not-logged-in) shopper's cart via an httpOnly cookie
 * holding a random, unguessable session id. This is stored in
 * cart_items.session_id for rows that belong to a guest.
 *
 * SECURITY:
 * - The cookie is httpOnly (no client-side JS access) and holds a
 *   crypto-random UUID (122 bits of randomness) — not a signed/derivable
 *   value, so there's nothing to forge; the only "attack" is guessing
 *   someone else's UUID, which is computationally infeasible.
 * - This value is NEVER trusted for identity/role (that's still
 *   getCurrentUser()'s job) — it only scopes anonymous cart rows so a
 *   guest can find their own cart back across requests before they have
 *   an account.
 * - Only readable/settable from Server Actions or Route Handlers (Server
 *   Components cannot set cookies in Next.js). Cart mutations are actions,
 *   so this is fine — a fresh guest browsing without adding anything never
 *   gets a cookie at all.
 */
import "server-only";
import { cookies } from "next/headers";

const CART_SESSION_COOKIE = "gl_cart_session";
const CART_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 days

/**
 * Returns the existing guest cart session id, or null if there is none yet.
 * Safe to call from Server Components (read-only).
 */
export async function getCartSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_SESSION_COOKIE)?.value ?? null;
}

/**
 * Returns the existing guest cart session id, creating (and setting) one if
 * none exists yet. Must only be called from a Server Action or Route
 * Handler — will throw if called from a Server Component render.
 */
export async function getOrCreateCartSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(CART_SESSION_COOKIE)?.value;
  if (existing) return existing;

  const sessionId = crypto.randomUUID();
  cookieStore.set(CART_SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CART_SESSION_MAX_AGE_SECONDS,
  });
  return sessionId;
}

/** Clears the guest cart session cookie (called after its cart is merged
 *  into a real customer account on login/signup). */
export async function clearCartSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_SESSION_COOKIE);
}

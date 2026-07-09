/**
 * lib/cart/cartOwner.ts
 *
 * Resolves "whose cart is this" for the current request — either a logged-in
 * customer (customer_id) or a not-logged-in guest (session_id, see
 * cartSession.ts). Every cart read/write goes through this so there is one
 * place that decides ownership, instead of each call site reimplementing it.
 */
import "server-only";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getCartSessionId, getOrCreateCartSessionId } from "./cartSession";

export type CartOwner =
  | { type: "customer"; customerId: string }
  | { type: "guest"; sessionId: string }
  | { type: "none" }; // logged in but somehow has no customers row, or no session at all yet

/**
 * Read-only resolution — safe from Server Components. Does NOT create a
 * guest session cookie if one doesn't exist yet (a guest who never added
 * anything has no cart, so there is nothing to look up).
 */
export async function resolveCartOwnerReadOnly(): Promise<CartOwner> {
  const user = await getCurrentUser();
  if (user?.role === "customer" && user.customer) {
    return { type: "customer", customerId: user.customer.id };
  }

  const sessionId = await getCartSessionId();
  if (sessionId) return { type: "guest", sessionId };

  return { type: "none" };
}

/**
 * Resolution used by mutating Server Actions — creates a guest session
 * cookie on first use if the visitor isn't logged in.
 */
export async function resolveCartOwnerForMutation(): Promise<
  Exclude<CartOwner, { type: "none" }>
> {
  const user = await getCurrentUser();
  if (user?.role === "customer" && user.customer) {
    return { type: "customer", customerId: user.customer.id };
  }

  const sessionId = await getOrCreateCartSessionId();
  return { type: "guest", sessionId };
}

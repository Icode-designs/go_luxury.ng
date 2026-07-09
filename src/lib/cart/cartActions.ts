/**
 * lib/cart/cartActions.ts
 *
 * Server Actions for cart mutations (add/update/remove) and the guest-cart
 * merge that runs right after a guest logs in or signs up.
 *
 * SECURITY MODEL:
 * - Uses the service-role client (bypasses RLS) because guest carts are
 *   scoped by session_id, a concept the cart_items RLS policy — written
 *   for authenticated customers only — has no way to check. Ownership is
 *   therefore enforced here, in code, via resolveCartOwnerForMutation():
 *   every read/write is filtered to the current request's own
 *   customer_id or session_id, never a client-supplied id for someone else.
 * - Product price/stock are always re-read from the DB here — the client
 *   only ever supplies a productId + desired quantity, never a price.
 * - Rate-limited per owner to blunt automated cart-flooding.
 */
"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/auth/rateLimit";
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
  MAX_CART_QUANTITY,
} from "@/lib/validation/cart";
import { resolveCartOwnerForMutation, type CartOwner } from "./cartOwner";
import { getCartSessionId, clearCartSessionCookie } from "./cartSession";
import { getCartItemCount } from "./getCart";

export type CartActionResult =
  | { ok: true; itemCount: number }
  | { ok: false; message: string };

function ownerFilter(owner: Exclude<CartOwner, { type: "none" }>) {
  return owner.type === "customer"
    ? { column: "customer_id" as const, value: owner.customerId }
    : { column: "session_id" as const, value: owner.sessionId };
}

function ownerRateLimitKey(owner: Exclude<CartOwner, { type: "none" }>) {
  return owner.type === "customer"
    ? `cart:customer:${owner.customerId}`
    : `cart:guest:${owner.sessionId}`;
}

// ---------------------------------------------------------------------------
// Add to cart
// ---------------------------------------------------------------------------
export async function addToCartAction(
  productId: string,
  quantity: number,
): Promise<CartActionResult> {
  const parsed = addToCartSchema.safeParse({ productId, quantity });
  if (!parsed.success) {
    return { ok: false, message: "Invalid product or quantity." };
  }

  const owner = await resolveCartOwnerForMutation();
  const rl = await checkRateLimit(ownerRateLimitKey(owner), 30, 3600); // 30/hour
  if (rl.limited) {
    return {
      ok: false,
      message: "You're doing that a bit too much. Please slow down.",
    };
  }

  const supabase = createAdminClient();
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, status, stock_count")
    .eq("id", parsed.data.productId)
    .maybeSingle();

  if (productError || !product) {
    return { ok: false, message: "This product could not be found." };
  }
  if (product.status !== "active") {
    return { ok: false, message: "This product is no longer available." };
  }
  if (product.stock_count <= 0) {
    return { ok: false, message: "This product is out of stock." };
  }

  const filter = ownerFilter(owner);
  const { data: existing, error: existingError } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq(filter.column, filter.value)
    .eq("product_id", parsed.data.productId)
    .maybeSingle();

  if (existingError) {
    console.error("[addToCartAction] lookup error:", existingError.message);
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  const cap = Math.min(product.stock_count, MAX_CART_QUANTITY);

  if (existing) {
    const nextQuantity = Math.min(existing.quantity + parsed.data.quantity, cap);
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: nextQuantity, updated_at: new Date().toISOString() })
      .eq("id", existing.id);

    if (updateError) {
      console.error("[addToCartAction] update error:", updateError.message);
      return { ok: false, message: "Something went wrong. Please try again." };
    }
  } else {
    const insertRow: Record<string, unknown> = {
      product_id: parsed.data.productId,
      quantity: Math.min(parsed.data.quantity, cap),
    };
    insertRow[filter.column] = filter.value;

    const { error: insertError } = await supabase
      .from("cart_items")
      .insert(insertRow);

    if (insertError) {
      console.error("[addToCartAction] insert error:", insertError.message);
      return { ok: false, message: "Something went wrong. Please try again." };
    }
  }

  return { ok: true, itemCount: await getCartItemCount() };
}

// ---------------------------------------------------------------------------
// Update quantity (0 removes the line)
// ---------------------------------------------------------------------------
export async function updateCartItemAction(
  cartItemId: string,
  quantity: number,
): Promise<CartActionResult> {
  const parsed = updateCartItemSchema.safeParse({ cartItemId, quantity });
  if (!parsed.success) {
    return { ok: false, message: "Invalid request." };
  }

  const owner = await resolveCartOwnerForMutation();
  const filter = ownerFilter(owner);
  const supabase = createAdminClient();

  // Ownership check: the row must belong to this owner. Scoping the
  // update/delete .eq() to both the row id AND the owner filter means a
  // request for someone else's cart_items id simply matches zero rows.
  if (parsed.data.quantity === 0) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", parsed.data.cartItemId)
      .eq(filter.column, filter.value);

    if (error) {
      console.error("[updateCartItemAction] delete error:", error.message);
      return { ok: false, message: "Something went wrong. Please try again." };
    }
    return { ok: true, itemCount: await getCartItemCount() };
  }

  const { data: row, error: rowError } = await supabase
    .from("cart_items")
    .select("id, product_id")
    .eq("id", parsed.data.cartItemId)
    .eq(filter.column, filter.value)
    .maybeSingle();

  if (rowError || !row) {
    return { ok: false, message: "That item is no longer in your cart." };
  }

  const { data: product } = await supabase
    .from("products")
    .select("stock_count, status")
    .eq("id", row.product_id)
    .maybeSingle();

  const cap = Math.min(product?.stock_count ?? 0, MAX_CART_QUANTITY);
  if (!product || product.status !== "active" || cap <= 0) {
    return { ok: false, message: "This product is no longer available." };
  }

  const nextQuantity = Math.min(parsed.data.quantity, cap);
  const { error: updateError } = await supabase
    .from("cart_items")
    .update({ quantity: nextQuantity, updated_at: new Date().toISOString() })
    .eq("id", parsed.data.cartItemId);

  if (updateError) {
    console.error("[updateCartItemAction] update error:", updateError.message);
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  return { ok: true, itemCount: await getCartItemCount() };
}

// ---------------------------------------------------------------------------
// Remove a line entirely
// ---------------------------------------------------------------------------
export async function removeCartItemAction(
  cartItemId: string,
): Promise<CartActionResult> {
  const parsed = removeCartItemSchema.safeParse({ cartItemId });
  if (!parsed.success) {
    return { ok: false, message: "Invalid request." };
  }

  const owner = await resolveCartOwnerForMutation();
  const filter = ownerFilter(owner);
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", parsed.data.cartItemId)
    .eq(filter.column, filter.value);

  if (error) {
    console.error("[removeCartItemAction] delete error:", error.message);
    return { ok: false, message: "Something went wrong. Please try again." };
  }

  return { ok: true, itemCount: await getCartItemCount() };
}

// ---------------------------------------------------------------------------
// Guest -> customer cart merge, called right after login/signup establish a
// session (see lib/auth/login.ts and lib/auth/signup.ts).
// ---------------------------------------------------------------------------
export async function mergeGuestCartIntoCustomer(
  customerId: string,
): Promise<void> {
  const sessionId = await getCartSessionId();
  if (!sessionId) return;

  const supabase = createAdminClient();
  const { data: guestItems, error } = await supabase
    .from("cart_items")
    .select("id, product_id, quantity")
    .eq("session_id", sessionId);

  if (error) {
    console.error("[mergeGuestCartIntoCustomer] lookup error:", error.message);
    return;
  }

  for (const guestItem of guestItems ?? []) {
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("customer_id", customerId)
      .eq("product_id", guestItem.product_id)
      .maybeSingle();

    const { data: product } = await supabase
      .from("products")
      .select("stock_count")
      .eq("id", guestItem.product_id)
      .maybeSingle();

    const cap = Math.min(product?.stock_count ?? 0, MAX_CART_QUANTITY);
    if (cap <= 0) {
      // Out of stock by the time they logged in — drop the guest line.
      await supabase.from("cart_items").delete().eq("id", guestItem.id);
      continue;
    }

    if (existing) {
      const nextQuantity = Math.min(existing.quantity + guestItem.quantity, cap);
      await supabase
        .from("cart_items")
        .update({ quantity: nextQuantity, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      await supabase.from("cart_items").delete().eq("id", guestItem.id);
    } else {
      await supabase
        .from("cart_items")
        .update({
          customer_id: customerId,
          session_id: null,
          quantity: Math.min(guestItem.quantity, cap),
          updated_at: new Date().toISOString(),
        })
        .eq("id", guestItem.id);
    }
  }

  await clearCartSessionCookie();
}

/**
 * lib/orders/placeOrder.ts
 *
 * Checkout Server Action. Payment is intentionally stubbed (no provider has
 * been chosen yet — see payments table's provider check constraint), so
 * this creates the order + order_items in 'pending' status and stops there.
 *
 * SECURITY NOTES:
 * - Never trusts client-supplied prices or quantities: the cart is re-read
 *   from the DB, and every product's price/stock/status is re-verified at
 *   the moment of order creation.
 * - Guest checkout mirrors lib/auth/signup.ts's guest-customer-by-email
 *   rule exactly: a CUSTOMERS row with a null auth_user_id can be reused
 *   (this is what lets a guest's order history "attach" to their account
 *   if they sign up later with the same email), but a row that already has
 *   an auth_user_id is never silently reused — that would let someone push
 *   an order onto another person's account just by knowing their email.
 * - Stock is deliberately NOT decremented on order creation. There is no
 *   payment confirmation yet, so treating a 'pending', unpaid order as
 *   consumed inventory would let anyone drain real stock for free by
 *   placing orders they never pay for. Decrementing stock belongs to a
 *   future "payment confirmed" / "admin fulfilled" step.
 * - Rate-limited by IP for the same reason — with no payment gate, order
 *   creation is the cheapest possible abuse surface on the whole site.
 */
"use server";

import { stripToPlainText } from "@/lib/richText/sanitizeRichText";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/auth/rateLimit";
import { resolveCartOwnerForMutation } from "@/lib/cart/cartOwner";
import { guestContactSchema, addressSchema } from "@/lib/validation/checkout";

export type PlaceOrderState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { status: "success"; orderId: string };

const sanitize = stripToPlainText;

export async function placeOrderAction(
  _prevState: PlaceOrderState,
  formData: FormData,
): Promise<PlaceOrderState> {
  // ── 1. Honeypot ──────────────────────────────────────────────────────
  const honeypot = formData.get("website");
  if (honeypot && String(honeypot).length > 0) {
    console.warn("[placeOrder] Honeypot triggered — bot submission rejected.");
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  // ── 2. Rate limit by IP ──────────────────────────────────────────────
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    "unknown";
  const rl = await checkRateLimit(`order:ip:${ip}`, 10, 3600); // 10/hour
  if (rl.limited) {
    return {
      status: "error",
      message: "Too many order attempts. Please try again later.",
    };
  }

  // ── 3. Validate address (always required) ───────────────────────────
  const addressRaw = {
    country: formData.get("country") ?? "",
    stateRegion: formData.get("stateRegion") ?? "",
    city: formData.get("city") ?? "",
    postalCode: formData.get("postalCode") ?? "",
    street: formData.get("street") ?? "",
  };
  const addressParsed = addressSchema.safeParse(addressRaw);
  if (!addressParsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: addressParsed.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  // ── 4. Resolve identity ───────────────────────────────────────────────
  const user = await getCurrentUser();
  const adminClient = createAdminClient();

  let customerId: string;

  if (user?.role === "customer" && user.customer) {
    customerId = user.customer.id;
  } else if (user?.role === "admin") {
    return { status: "error", message: "Admin accounts can't place orders." };
  } else {
    const contactRaw = {
      fullName: formData.get("fullName") ?? "",
      email: formData.get("email") ?? "",
      phone: formData.get("phone") ?? "",
    };
    const contactParsed = guestContactSchema.safeParse(contactRaw);
    if (!contactParsed.success) {
      return {
        status: "error",
        message: "Please fix the errors below.",
        fieldErrors: contactParsed.error.flatten().fieldErrors as Record<
          string,
          string[]
        >,
      };
    }

    const normalizedEmail = contactParsed.data.email;
    const safeFullName = sanitize(contactParsed.data.fullName);

    const { data: existingCustomer, error: lookupError } = await adminClient
      .from("customers")
      .select("id, auth_user_id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (lookupError) {
      console.error(
        "[placeOrder] customer lookup error:",
        lookupError.message,
      );
      return {
        status: "error",
        message: "Something went wrong. Please try again.",
      };
    }

    if (existingCustomer && existingCustomer.auth_user_id !== null) {
      return {
        status: "error",
        message:
          "An account already exists with this email. Please log in to continue checkout.",
      };
    }

    if (existingCustomer) {
      const { error: updateError } = await adminClient
        .from("customers")
        .update({ full_name: safeFullName, phone: contactParsed.data.phone })
        .eq("id", existingCustomer.id);
      if (updateError) {
        console.error(
          "[placeOrder] guest customer update error:",
          updateError.message,
        );
        return {
          status: "error",
          message: "Something went wrong. Please try again.",
        };
      }
      customerId = existingCustomer.id;
    } else {
      const { data: inserted, error: insertError } = await adminClient
        .from("customers")
        .insert({
          auth_user_id: null,
          full_name: safeFullName,
          email: normalizedEmail,
          phone: contactParsed.data.phone,
        })
        .select("id")
        .single();
      if (insertError || !inserted) {
        console.error(
          "[placeOrder] guest customer insert error:",
          insertError?.message,
        );
        return {
          status: "error",
          message: "Something went wrong. Please try again.",
        };
      }
      customerId = inserted.id;
    }
  }

  // ── 5. Insert the shipping address ───────────────────────────────────
  const { count: existingAddressCount } = await adminClient
    .from("addresses")
    .select("id", { count: "exact", head: true })
    .eq("customer_id", customerId);

  const { data: address, error: addressError } = await adminClient
    .from("addresses")
    .insert({
      customer_id: customerId,
      country: sanitize(addressParsed.data.country),
      state_region: addressParsed.data.stateRegion
        ? sanitize(addressParsed.data.stateRegion)
        : null,
      city: addressParsed.data.city ? sanitize(addressParsed.data.city) : null,
      postal_code: addressParsed.data.postalCode
        ? sanitize(addressParsed.data.postalCode)
        : null,
      street: sanitize(addressParsed.data.street),
      is_default: (existingAddressCount ?? 0) === 0,
    })
    .select("id")
    .single();

  if (addressError || !address) {
    console.error("[placeOrder] address insert error:", addressError?.message);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  // ── 6. Re-read the cart from the DB ──────────────────────────────────
  const owner = await resolveCartOwnerForMutation();
  const ownerFilterCol = owner.type === "customer" ? "customer_id" : "session_id";
  const ownerFilterVal =
    owner.type === "customer" ? owner.customerId : owner.sessionId;

  const { data: cartRows, error: cartError } = await adminClient
    .from("cart_items")
    .select("id, product_id, quantity")
    .eq(ownerFilterCol, ownerFilterVal);

  if (cartError) {
    console.error("[placeOrder] cart fetch error:", cartError.message);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }
  if (!cartRows || cartRows.length === 0) {
    return { status: "error", message: "Your cart is empty." };
  }

  // ── 7. Re-verify price/stock/status for every line, server-side ──────
  const productIds = cartRows.map((row) => row.product_id);
  const { data: products, error: productsError } = await adminClient
    .from("products")
    .select("id, name, base_price, discounted_price, stock_count, status")
    .in("id", productIds);

  if (productsError || !products) {
    console.error(
      "[placeOrder] products fetch error:",
      productsError?.message,
    );
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  const productById = new Map(products.map((p) => [p.id, p]));
  const orderItemsToInsert: {
    product_id: string;
    quantity: number;
    unit_price: number;
  }[] = [];
  let total = 0;

  for (const row of cartRows) {
    const product = productById.get(row.product_id);
    if (!product || product.status !== "active") {
      return {
        status: "error",
        message: `"${product?.name ?? "An item"}" in your cart is no longer available. Please remove it and try again.`,
      };
    }
    if (row.quantity > product.stock_count) {
      return {
        status: "error",
        message: `Only ${product.stock_count} of "${product.name}" left in stock — please update the quantity in your cart.`,
      };
    }
    const unitPrice = product.discounted_price ?? product.base_price;
    orderItemsToInsert.push({
      product_id: row.product_id,
      quantity: row.quantity,
      unit_price: unitPrice,
    });
    total += unitPrice * row.quantity;
  }

  // ── 8. Create the order (payment stubbed — status stays 'pending') ───
  const { data: order, error: orderError } = await adminClient
    .from("orders")
    .insert({
      customer_id: customerId,
      address_id: address.id,
      status: "pending",
      currency: "NGN",
      shipping_cost: 0,
      total,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("[placeOrder] order insert error:", orderError?.message);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  const { error: itemsError } = await adminClient.from("order_items").insert(
    orderItemsToInsert.map((item) => ({ ...item, order_id: order.id })),
  );

  if (itemsError) {
    console.error(
      "[placeOrder] order_items insert error:",
      itemsError.message,
    );
    console.error(
      `[placeOrder] CRITICAL: order ${order.id} created with no items. Manual remediation required.`,
    );
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  // ── 9. Clear the ordered cart lines ──────────────────────────────────
  await adminClient
    .from("cart_items")
    .delete()
    .in("id", cartRows.map((row) => row.id));

  redirect(`/order-confirmation/${order.id}`);
}

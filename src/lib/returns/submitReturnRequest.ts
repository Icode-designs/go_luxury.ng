/**
 * lib/returns/submitReturnRequest.ts
 *
 * Customer return-request Server Action. Mirrors the security pattern in
 * lib/reviews/submitReview.ts:
 *  1. Honeypot check — silent success for bots.
 *  2. Require an authenticated *customer* who owns the order (never trust a
 *     client-supplied order/customer pairing).
 *  3. Re-validate server-side with returnRequestSchema.
 *  4. Rate-limit by customer id.
 *  5. Sanitize the free-text "detail" field.
 *  6. Re-verify against the DB, not the client, that:
 *       - the order is 'delivered' (return window policy: delivered only),
 *       - every submitted order_item actually belongs to this order,
 *       - the requested quantity for each item doesn't exceed what's still
 *         returnable (item quantity minus quantities already tied up in a
 *         non-rejected return request for that item).
 *  7. Insert via the service-role client, since (like reviews) the
 *     returns/return_items RLS policies intentionally have no public INSERT
 *     rule — all inserts are expected to go through this validated path.
 *  8. Flag the order as 'refund_requested' so it surfaces for admin triage.
 */
"use server";

import { stripToPlainText } from "@/lib/richText/sanitizeRichText";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/auth/rateLimit";
import { returnRequestSchema } from "@/lib/validation/returns";

export type SubmitReturnRequestState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { status: "success" };

const sanitize = stripToPlainText;

export async function submitReturnRequestAction(
  _prevState: SubmitReturnRequestState,
  formData: FormData,
): Promise<SubmitReturnRequestState> {
  // ── 1. Honeypot check ───────────────────────────────────────────────────
  const honeypot = formData.get("website");
  if (honeypot && String(honeypot).length > 0) {
    console.warn(
      "[submitReturnRequest] Honeypot triggered — bot submission rejected.",
    );
    return { status: "success" };
  }

  // ── 2. Require an authenticated customer ────────────────────────────────
  const user = await getCurrentUser();
  if (!user || user.role !== "customer" || !user.customer) {
    return {
      status: "error",
      message: "Please log in with a customer account to request a return.",
    };
  }

  // ── 3. Server-side re-validation ────────────────────────────────────────
  let itemsRaw: unknown;
  try {
    itemsRaw = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { status: "error", message: "Please select at least one item." };
  }

  const rawData = {
    orderId: formData.get("orderId"),
    reason: formData.get("reason"),
    detail: formData.get("detail") ?? "",
    items: itemsRaw,
    website: honeypot ?? "",
  };

  const parsed = returnRequestSchema.safeParse(rawData);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<
      string,
      string[]
    >;
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors,
    };
  }

  const { orderId, reason, detail, items } = parsed.data;

  // ── 4. Rate limit by customer id ────────────────────────────────────────
  const rlResult = await checkRateLimit(
    `return:customer:${user.customer.id}`,
    5,
    86400,
  ); // 5 return requests per day
  if (rlResult.limited) {
    return {
      status: "error",
      message: "Too many return requests. Please try again later.",
    };
  }

  // ── 5. Sanitize free-text field ─────────────────────────────────────────
  const safeDetail = detail ? sanitize(detail) : null;

  const adminClient = createAdminClient();

  // ── 6a. Verify the order belongs to this customer and is delivered ──────
  const { data: order, error: orderError } = await adminClient
    .from("orders")
    .select("id, customer_id, status")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !order) {
    return { status: "error", message: "Order not found." };
  }
  if (order.customer_id !== user.customer.id) {
    console.warn(
      `[submitReturnRequest] Customer ${user.customer.id} attempted to request a return on order ${orderId}, which they don't own.`,
    );
    return { status: "error", message: "Order not found." };
  }
  if (order.status !== "delivered") {
    return {
      status: "error",
      message: "Only delivered orders can be returned.",
    };
  }

  // ── 6b. Verify every submitted item belongs to this order, and that the
  //        requested quantity doesn't exceed what's still returnable ──────
  const { data: orderItems, error: orderItemsError } = await adminClient
    .from("order_items")
    .select("id, quantity")
    .eq("order_id", orderId);

  if (orderItemsError || !orderItems) {
    console.error(
      "[submitReturnRequest] order_items fetch error:",
      orderItemsError?.message,
    );
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  const orderItemById = new Map(orderItems.map((oi) => [oi.id, oi.quantity]));

  const { data: existingReturnItems, error: existingReturnItemsError } =
    await adminClient
      .from("return_items")
      .select("order_item_id, quantity, returns!inner(order_id, status)")
      .eq("returns.order_id", orderId)
      .neq("returns.status", "rejected");

  if (existingReturnItemsError) {
    console.error(
      "[submitReturnRequest] existing return_items fetch error:",
      existingReturnItemsError.message,
    );
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  const alreadyRequestedByItem = new Map<string, number>();
  for (const row of existingReturnItems ?? []) {
    const prev = alreadyRequestedByItem.get(row.order_item_id) ?? 0;
    alreadyRequestedByItem.set(row.order_item_id, prev + row.quantity);
  }

  // De-duplicate order_item_id within this submission and validate quantities.
  const requestedByItem = new Map<string, number>();
  for (const item of items) {
    const prev = requestedByItem.get(item.orderItemId) ?? 0;
    requestedByItem.set(item.orderItemId, prev + item.quantity);
  }

  for (const [orderItemId, requestedQty] of requestedByItem) {
    const orderedQty = orderItemById.get(orderItemId);
    if (orderedQty === undefined) {
      return { status: "error", message: "One of the selected items is invalid." };
    }
    const alreadyRequested = alreadyRequestedByItem.get(orderItemId) ?? 0;
    const remaining = orderedQty - alreadyRequested;
    if (requestedQty > remaining) {
      return {
        status: "error",
        message:
          remaining <= 0
            ? "One of the selected items has already been fully requested for return."
            : `Only ${remaining} of one of the selected items can still be returned.`,
      };
    }
  }

  // ── 7. Insert the return request + its items ────────────────────────────
  const { data: newReturn, error: returnInsertError } = await adminClient
    .from("returns")
    .insert({
      order_id: orderId,
      customer_id: user.customer.id,
      reason,
      detail: safeDetail,
      status: "requested",
    })
    .select("id")
    .single();

  if (returnInsertError || !newReturn) {
    console.error(
      "[submitReturnRequest] returns insert error:",
      returnInsertError?.message,
    );
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  const { error: itemsInsertError } = await adminClient
    .from("return_items")
    .insert(
      Array.from(requestedByItem, ([orderItemId, quantity]) => ({
        return_id: newReturn.id,
        order_item_id: orderItemId,
        quantity,
      })),
    );

  if (itemsInsertError) {
    console.error(
      "[submitReturnRequest] return_items insert error:",
      itemsInsertError.message,
    );
    console.error(
      `[submitReturnRequest] CRITICAL: return ${newReturn.id} created with no items. Manual remediation required.`,
    );
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  // ── 8. Flag the order for admin triage ──────────────────────────────────
  await adminClient
    .from("orders")
    .update({ status: "refund_requested" })
    .eq("id", orderId);

  revalidatePath(`/customer/orders/${orderId}`);

  return { status: "success" };
}

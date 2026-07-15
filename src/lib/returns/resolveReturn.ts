/**
 * lib/returns/resolveReturn.ts
 *
 * Admin return-resolution Server Action. Mirrors the security pattern in
 * lib/blog/submitBlogPost.ts:
 *  1. Independently re-verifies isAdmin via getCurrentUser() (per proxy.ts's
 *     documented requirement — Server Actions can be invoked directly,
 *     bypassing the /admin proxy).
 *  2. Re-validates server-side with resolveReturnSchema.
 *  3. Writes through the RLS-respecting server client — safe because the
 *     "Admins manage returns" / "...orders" policies already grant a
 *     verified admin session full access.
 *
 * ORDER STATUS BOOKKEEPING: a return request flips its order to
 * 'refund_requested' (see submitReturnRequest.ts) so it surfaces for
 * triage. Once every return tied to an order has reached a terminal state
 * (rejected or refunded) — i.e. none are still 'requested'/'approved' — the
 * order reverts to 'delivered'. 'approved' is treated as an intermediate
 * state (admin has agreed to the return but the refund hasn't been
 * processed yet), so it does NOT clear the order's refund_requested flag by
 * itself.
 */
"use server";

import { stripToPlainText } from "@/lib/richText/sanitizeRichText";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { createClient } from "@/lib/supabase/server";
import { resolveReturnSchema } from "@/lib/validation/returns";

export type ResolveReturnState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { status: "success" };

const sanitize = stripToPlainText;

export async function resolveReturnAction(
  _prevState: ResolveReturnState,
  formData: FormData,
): Promise<ResolveReturnState> {
  // ── 1. Re-verify admin — never trust that the proxy already checked ────
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { status: "error", message: "You must be an admin to do this." };
  }

  // ── 2. Server-side re-validation ────────────────────────────────────────
  const refundAmountRaw = formData.get("refundAmount");
  const rawData = {
    returnId: formData.get("returnId"),
    status: formData.get("status"),
    adminNotes: formData.get("adminNotes") ?? "",
    refundAmount:
      refundAmountRaw && String(refundAmountRaw).trim() !== ""
        ? Number(refundAmountRaw)
        : undefined,
  };

  const parsed = resolveReturnSchema.safeParse(rawData);
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

  const { returnId, status, adminNotes, refundAmount } = parsed.data;
  const safeNotes = adminNotes ? sanitize(adminNotes) : null;

  const supabase = await createClient();

  // ── 3. Look up the return so we know which order to reconcile ──────────
  const { data: existing, error: fetchError } = await supabase
    .from("returns")
    .select("id, order_id")
    .eq("id", returnId)
    .maybeSingle();

  if (fetchError || !existing) {
    return { status: "error", message: "Return request not found." };
  }

  // ── 4. Update the return itself ─────────────────────────────────────────
  const isTerminal = status === "rejected" || status === "refunded";

  const { error: updateError } = await supabase
    .from("returns")
    .update({
      status,
      admin_notes: safeNotes,
      refund_amount: status === "refunded" ? refundAmount : null,
      resolved_at: isTerminal ? new Date().toISOString() : null,
    })
    .eq("id", returnId);

  if (updateError) {
    console.error("[resolveReturn] update error:", updateError.message);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  // ── 5. Revert the order to 'delivered' once nothing is still active ────
  if (isTerminal) {
    const { count, error: activeCountError } = await supabase
      .from("returns")
      .select("id", { count: "exact", head: true })
      .eq("order_id", existing.order_id)
      .in("status", ["requested", "approved"]);

    if (activeCountError) {
      console.error(
        "[resolveReturn] active-return count error:",
        activeCountError.message,
      );
    } else if ((count ?? 0) === 0) {
      const { data: order } = await supabase
        .from("orders")
        .select("status")
        .eq("id", existing.order_id)
        .maybeSingle();

      if (order?.status === "refund_requested") {
        await supabase
          .from("orders")
          .update({ status: "delivered" })
          .eq("id", existing.order_id);
      }
    }
  }

  revalidatePath("/admin/returns");
  revalidatePath(`/admin/returns/${returnId}`);
  revalidatePath(`/admin/orders/${existing.order_id}`);

  return { status: "success" };
}

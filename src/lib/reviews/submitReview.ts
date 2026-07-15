/**
 * lib/reviews/submitReview.ts
 *
 * Submit-a-review Server Action. Mirrors the security pattern in
 * lib/auth/signup.ts:
 *  1. Honeypot check — silent success for bots.
 *  2. Require an authenticated *customer* (never trust a client-supplied
 *     name/identity for who wrote the review).
 *  3. Re-validate server-side with reviewSchema.
 *  4. Rate-limit by customer id.
 *  5. Sanitize free-text fields.
 *  6. Upsert (one review per customer per product — resubmitting edits it)
 *     with status 'pending'. Reviews only become public once an admin
 *     approves them (see reviews.status RLS policy).
 *
 * Uses the service-role client for the write because the reviews table's
 * RLS policy intentionally has no public INSERT rule — all inserts are
 * expected to go through this validated, rate-limited path instead of
 * directly from the browser.
 */
"use server";

import { stripToPlainText } from "@/lib/richText/sanitizeRichText";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/auth/rateLimit";
import { reviewSchema } from "@/lib/validation/review";

export type SubmitReviewState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { status: "success" };

const sanitize = stripToPlainText;

export async function submitReviewAction(
  _prevState: SubmitReviewState,
  formData: FormData,
): Promise<SubmitReviewState> {
  // ── 1. Honeypot check ───────────────────────────────────────────────────
  const honeypot = formData.get("website");
  if (honeypot && String(honeypot).length > 0) {
    console.warn("[submitReview] Honeypot triggered — bot submission rejected.");
    return { status: "success" };
  }

  // ── 2. Require an authenticated customer ────────────────────────────────
  const user = await getCurrentUser();
  if (!user || user.role !== "customer" || !user.customer) {
    return {
      status: "error",
      message: "Please log in with a customer account to leave a review.",
    };
  }

  // ── 3. Server-side re-validation ────────────────────────────────────────
  const rawData = {
    productId: formData.get("productId"),
    rating: Number(formData.get("rating")),
    title: formData.get("title") ?? "",
    comment: formData.get("comment"),
    website: honeypot ?? "",
  };

  const parsed = reviewSchema.safeParse(rawData);
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

  const { productId, rating, title, comment } = parsed.data;

  // ── 4. Rate limit by customer id ────────────────────────────────────────
  const rlResult = await checkRateLimit(
    `review:customer:${user.customer.id}`,
    5,
    3600,
  ); // 5 review submissions per hour
  if (rlResult.limited) {
    return {
      status: "error",
      message: "Too many review submissions. Please try again later.",
    };
  }

  // ── 5. Sanitize free-text fields ────────────────────────────────────────
  const safeTitle = title ? sanitize(title) : null;
  const safeComment = sanitize(comment);

  if (safeComment.length < 10) {
    return {
      status: "error",
      message: "Please write at least 10 characters.",
    };
  }

  // ── 6. Upsert — one review per customer per product ─────────────────────
  const adminClient = createAdminClient();
  const { error: upsertError } = await adminClient.from("reviews").upsert(
    {
      product_id: productId,
      customer_id: user.customer.id,
      rating,
      title: safeTitle,
      comment: safeComment,
      status: "pending",
    },
    { onConflict: "product_id,customer_id" },
  );

  if (upsertError) {
    console.error("[submitReview] upsert error:", upsertError.message);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  return { status: "success" };
}

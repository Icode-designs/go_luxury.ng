/**
 * lib/validation/returns.ts
 *
 * Shared Zod schema for customer return requests. Mirrors the pattern in
 * lib/validation/review.ts — re-validated server-side in
 * submitReturnRequestAction, which never trusts client-side validation
 * alone.
 */
import { z } from "zod";

const HTML_SCRIPT_PATTERN = /<[^>]*>|javascript:/i;

export const RETURN_REASONS = [
  "wrong_item",
  "defective",
  "not_as_described",
  "changed_mind",
  "other",
] as const;

export type ReturnReason = (typeof RETURN_REASONS)[number];

export const returnRequestSchema = z.object({
  orderId: z.string().uuid("Invalid order"),

  reason: z.enum(RETURN_REASONS, {
    error: () => "Please select a reason",
  }),

  detail: z
    .string()
    .trim()
    .max(1000, "Details must be at most 1000 characters")
    .refine((val) => !HTML_SCRIPT_PATTERN.test(val), {
      message: "Details contain invalid characters",
    })
    .optional()
    .or(z.literal("")),

  // One entry per order_item the customer wants to return, with the
  // quantity of that item being returned. Re-validated against the DB
  // (ownership, order status, remaining returnable quantity) server-side —
  // this schema only checks shape.
  items: z
    .array(
      z.object({
        orderItemId: z.string().uuid("Invalid item"),
        quantity: z.number().int().positive("Quantity must be at least 1"),
      }),
    )
    .min(1, "Select at least one item to return"),

  // Honeypot field — must be empty. Validated server-side only.
  website: z.string().optional(),
});

export type ReturnRequestFormData = z.infer<typeof returnRequestSchema>;

// ---------------------------------------------------------------------------
// Admin resolution
// ---------------------------------------------------------------------------

export const RETURN_RESOLUTION_STATUSES = [
  "approved",
  "rejected",
  "refunded",
] as const;

export type ReturnResolutionStatus = (typeof RETURN_RESOLUTION_STATUSES)[number];

export const resolveReturnSchema = z
  .object({
    returnId: z.string().uuid("Invalid return"),

    status: z.enum(RETURN_RESOLUTION_STATUSES, {
      error: () => "Please select a status",
    }),

    adminNotes: z
      .string()
      .trim()
      .max(1000, "Notes must be at most 1000 characters")
      .refine((val) => !HTML_SCRIPT_PATTERN.test(val), {
        message: "Notes contain invalid characters",
      })
      .optional()
      .or(z.literal("")),

    // Only meaningful (and required) when status = 'refunded'.
    refundAmount: z
      .number()
      .nonnegative("Refund amount can't be negative")
      .optional(),
  })
  .refine(
    (data) => data.status !== "refunded" || data.refundAmount !== undefined,
    {
      message: "Enter a refund amount",
      path: ["refundAmount"],
    },
  );

export type ResolveReturnFormData = z.infer<typeof resolveReturnSchema>;

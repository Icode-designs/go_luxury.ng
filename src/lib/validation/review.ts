/**
 * lib/validation/review.ts
 *
 * Shared Zod schema for product review submissions. Mirrors the pattern in
 * lib/validation/auth.ts — used client-side (react-hook-form) and
 * re-validated server-side in the submitReview Server Action, which never
 * trusts client-side validation alone.
 */
import { z } from "zod";

const HTML_SCRIPT_PATTERN = /<[^>]*>|javascript:/i;

export const reviewSchema = z.object({
  productId: z.string().uuid("Invalid product"),

  rating: z
    .number()
    .int()
    .min(1, "Please select a rating")
    .max(5, "Rating must be between 1 and 5"),

  title: z
    .string()
    .trim()
    .max(80, "Title must be at most 80 characters")
    .refine((val) => !HTML_SCRIPT_PATTERN.test(val), {
      message: "Title contains invalid characters",
    })
    .optional()
    .or(z.literal("")),

  comment: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(1000, "Review must be at most 1000 characters")
    .refine((val) => !HTML_SCRIPT_PATTERN.test(val), {
      message: "Review contains invalid characters",
    }),

  // Honeypot field — must be empty. Validated server-side only.
  website: z.string().optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

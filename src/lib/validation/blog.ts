/**
 * lib/validation/blog.ts
 * Shared Zod schema for the admin blog post form. Re-validated server-side
 * in submitBlogPost.ts regardless of client input.
 */
import { z } from "zod";

const HTML_SCRIPT_PATTERN = /<[^>]*>|javascript:/i;

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters")
    .trim()
    .refine((val) => !HTML_SCRIPT_PATTERN.test(val), {
      message: "Title contains invalid characters",
    }),

  excerpt: z
    .string()
    .max(300, "Excerpt must be at most 300 characters")
    .trim()
    .refine((val) => !HTML_SCRIPT_PATTERN.test(val), {
      message: "Excerpt contains invalid characters",
    })
    .optional()
    .or(z.literal("")),

  coverImageUrl: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),

  body: z
    .string()
    .min(20, "Body must be at least 20 characters")
    .max(20000, "Body must be at most 20,000 characters")
    .trim(),

  status: z.enum(["draft", "published"]),
});

export type BlogPostFormData = z.infer<typeof blogPostSchema>;

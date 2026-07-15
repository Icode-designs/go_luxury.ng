/**
 * lib/blog/submitBlogPost.ts
 *
 * Admin blog post create/update Server Action.
 *
 * SECURITY:
 * - Independently re-verifies isAdmin via getCurrentUser() (per proxy.ts's
 *   documented requirement: every admin-mutating Server Action must check
 *   this itself, since Server Actions can be invoked directly, bypassing
 *   the /admin proxy).
 * - author_id is ALWAYS derived from the verified admin's own row — never
 *   trusted from client input, and never overwritten on an edit (a post
 *   keeps its original author even if a different admin edits it later).
 * - Title/excerpt are sanitized down to plain text (strip all HTML) — these
 *   are short single-line fields, not rich text.
 * - Body is sanitized down to the shared rich-text allowlist (see
 *   sanitizeRichText.ts, same one used for Terms & Policies) rather than
 *   stripped to plain text, since the admin editor for it is now a WYSIWYG
 *   surface (see blogPostForm.tsx).
 */
"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { createClient } from "@/lib/supabase/server";
import { blogPostSchema } from "@/lib/validation/blog";
import {
  sanitizeRichText,
  stripToPlainText,
} from "@/lib/richText/sanitizeRichText";

export type SubmitBlogPostState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { status: "success" };

const sanitize = stripToPlainText;

export async function submitBlogPostAction(
  postId: string | undefined,
  _prevState: SubmitBlogPostState,
  formData: FormData,
): Promise<SubmitBlogPostState> {
  // ── 1. Re-verify admin — never trust that the proxy already checked ────
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { status: "error", message: "You must be an admin to do this." };
  }

  // ── 2. Server-side re-validation ────────────────────────────────────────
  const rawData = {
    title: formData.get("title") ?? "",
    excerpt: formData.get("excerpt") ?? "",
    coverImageUrl: formData.get("coverImageUrl") ?? "",
    body: formData.get("body") ?? "",
    status: formData.get("status") ?? "draft",
  };

  const parsed = blogPostSchema.safeParse(rawData);
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

  const safeTitle = sanitize(parsed.data.title);
  const safeExcerpt = parsed.data.excerpt ? sanitize(parsed.data.excerpt) : null;
  const safeBody = sanitizeRichText(parsed.data.body);
  const coverImageUrl = parsed.data.coverImageUrl || null;

  const supabase = await createClient();

  if (postId) {
    // ── 3a. Update — author_id is never touched here ──────────────────
    const { data: existing, error: fetchError } = await supabase
      .from("blog_posts")
      .select("status, published_at")
      .eq("id", postId)
      .maybeSingle();

    if (fetchError || !existing) {
      return { status: "error", message: "Post not found." };
    }

    const publishedAt =
      parsed.data.status === "published" && !existing.published_at
        ? new Date().toISOString()
        : existing.published_at;

    const { error: updateError } = await supabase
      .from("blog_posts")
      .update({
        title: safeTitle,
        excerpt: safeExcerpt,
        cover_image_url: coverImageUrl,
        body: safeBody,
        status: parsed.data.status,
        published_at: publishedAt,
      })
      .eq("id", postId);

    if (updateError) {
      console.error("[submitBlogPost] update error:", updateError.message);
      return {
        status: "error",
        message: "Something went wrong. Please try again.",
      };
    }
  } else {
    // ── 3b. Create — author_id comes from the verified admin session ──
    const { error: insertError } = await supabase.from("blog_posts").insert({
      author_id: user.admin.id,
      title: safeTitle,
      excerpt: safeExcerpt,
      cover_image_url: coverImageUrl,
      body: safeBody,
      status: parsed.data.status,
      published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
    });

    if (insertError) {
      console.error("[submitBlogPost] insert error:", insertError.message);
      return {
        status: "error",
        message: "Something went wrong. Please try again.",
      };
    }
  }

  redirect("/admin/blog");
}

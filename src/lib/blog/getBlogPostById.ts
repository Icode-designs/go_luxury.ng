// src/lib/blog/getBlogPostById.ts
//
// Public single blog post — published only. Same RLS-respecting convention
// as getBlogPosts.ts / getProductReviews.ts: an explicit status filter here
// is defense in depth on top of the RLS policy.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { sanitizeRichText } from "@/lib/richText/sanitizeRichText";

export interface BlogPostDetail {
  id: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  /** Sanitized rich-text HTML (safe tag allowlist only) -- render with
   * dangerouslySetInnerHTML, never as plain text. Sanitized again here on
   * every read (not just on save in submitBlogPost.ts) so the public post
   * page stays safe even if the stored value was ever edited directly
   * outside the admin editor. */
  body: string;
  publishedAt: string;
}

export async function getBlogPostById(
  postId: string,
): Promise<BlogPostDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, excerpt, cover_image_url, body, published_at, created_at")
    .eq("id", postId)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[getBlogPostById] fetch error:", error.message);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt ?? "",
    coverImageUrl: data.cover_image_url,
    body: sanitizeRichText(data.body),
    publishedAt: data.published_at ?? data.created_at,
  };
}

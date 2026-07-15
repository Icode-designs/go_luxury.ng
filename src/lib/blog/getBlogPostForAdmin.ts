// src/lib/blog/getBlogPostForAdmin.ts
//
// Single blog post for the admin edit form. Same RLS-respecting server
// client convention as getBlogPostsForAdmin.ts.
import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface AdminBlogPostDetail {
  id: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  coverImageStorageId: string | null;
  body: string;
  status: "draft" | "published";
}

export async function getBlogPostForAdmin(
  postId: string,
): Promise<AdminBlogPostDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, excerpt, cover_image_url, cover_image_storage_id, body, status",
    )
    .eq("id", postId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[getBlogPostForAdmin] fetch error:", error.message);
    return null;
  }

  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt ?? "",
    coverImageUrl: data.cover_image_url ?? "",
    coverImageStorageId: data.cover_image_storage_id,
    body: data.body,
    status: data.status,
  };
}

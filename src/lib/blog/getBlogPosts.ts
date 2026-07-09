// src/lib/blog/getBlogPosts.ts
//
// Public blog list — published posts only. Relies on the "Public can view
// published blog posts" RLS policy (status = 'published' OR is_admin()),
// but also filters explicitly here as defense in depth, same convention as
// getProductReviews.ts.
import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface BlogPostSummary {
  id: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  publishedAt: string;
}

interface RawBlogPostRow {
  id: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
}

export async function getBlogPosts(): Promise<BlogPostSummary[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, excerpt, cover_image_url, published_at, created_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[getBlogPosts] fetch error:", error.message);
    return [];
  }

  const rows = (data ?? []) as RawBlogPostRow[];

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    excerpt: row.excerpt ?? "",
    coverImageUrl: row.cover_image_url,
    publishedAt: row.published_at ?? row.created_at,
  }));
}

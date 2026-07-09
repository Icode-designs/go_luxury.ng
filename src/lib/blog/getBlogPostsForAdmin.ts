// src/lib/blog/getBlogPostsForAdmin.ts
//
// Admin blog post list (any status). RLS-respecting server client — the
// "Admins manage blog posts" ALL is_admin() policy grants full access.
import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface AdminBlogPostRow {
  id: string;
  title: string;
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
  authorEmail: string | null;
}

interface RawBlogPostRow {
  id: string;
  title: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  admins: { email: string } | { email: string }[] | null;
}

export async function getBlogPostsForAdmin(): Promise<AdminBlogPostRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, status, published_at, created_at, admins ( email )")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getBlogPostsForAdmin] fetch error:", error.message);
    return [];
  }

  const rows = (data ?? []) as unknown as RawBlogPostRow[];

  return rows.map((row) => {
    const author = Array.isArray(row.admins) ? (row.admins[0] ?? null) : row.admins;
    return {
      id: row.id,
      title: row.title,
      status: row.status,
      publishedAt: row.published_at,
      createdAt: row.created_at,
      authorEmail: author?.email ?? null,
    };
  });
}

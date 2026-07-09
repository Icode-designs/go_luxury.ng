// src/lib/reviews/getReviewsForAdmin.ts
//
// Admin moderation list — ALL reviews regardless of status. Uses the
// RLS-respecting server client, same convention as the other admin list
// fetchers; relies on the "Admins manage reviews" ALL is_admin() policy
// (added alongside the admin dashboard work, since the reviews table
// previously only had a public "approved" read policy).
import "server-only";
import { createClient } from "@/lib/supabase/server";

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface AdminReviewRow {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  productId: string;
  productName: string;
  customerName: string | null;
  customerEmail: string | null;
}

interface RawAdminReviewRow {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  status: ReviewStatus;
  created_at: string;
  product_id: string;
  products: { name: string } | { name: string }[] | null;
  customers:
    | { full_name: string | null; email: string }
    | { full_name: string | null; email: string }[]
    | null;
}

export async function getReviewsForAdmin(): Promise<AdminReviewRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, rating, title, comment, status, created_at, product_id, products ( name ), customers ( full_name, email )",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getReviewsForAdmin] fetch error:", error.message);
    return [];
  }

  const rows = (data ?? []) as unknown as RawAdminReviewRow[];

  return rows.map((row) => {
    const product = Array.isArray(row.products) ? row.products[0] : row.products;
    const customer = Array.isArray(row.customers)
      ? row.customers[0]
      : row.customers;

    return {
      id: row.id,
      rating: row.rating,
      title: row.title,
      comment: row.comment,
      status: row.status,
      createdAt: row.created_at,
      productId: row.product_id,
      productName: product?.name ?? "Product",
      customerName: customer?.full_name ?? null,
      customerEmail: customer?.email ?? null,
    };
  });
}

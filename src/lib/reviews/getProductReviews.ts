// src/lib/reviews/getProductReviews.ts
//
// Server-side fetch of a product's *approved* reviews plus a rating
// aggregate. Relies on the `reviews` table's RLS policy (public can read
// rows where status = 'approved') rather than the service-role client, so
// this genuinely reflects what an anonymous visitor is allowed to see.
import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface ProductReview {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  reviewerName: string;
  createdAt: string;
}

export interface ProductReviewSummary {
  reviews: ProductReview[];
  averageRating: number | null;
  reviewCount: number;
}

interface RawReviewRow {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  created_at: string;
  customers: { full_name: string | null } | { full_name: string | null }[] | null;
}

export async function getProductReviews(
  productId: string,
): Promise<ProductReviewSummary> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, rating, title, comment, created_at, customers ( full_name )",
    )
    .eq("product_id", productId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getProductReviews] fetch error:", error.message);
    return { reviews: [], averageRating: null, reviewCount: 0 };
  }

  const rows = (data ?? []) as unknown as RawReviewRow[];

  const reviews: ProductReview[] = rows.map((row) => {
    const customer = Array.isArray(row.customers)
      ? row.customers[0]
      : row.customers;

    return {
      id: row.id,
      rating: row.rating,
      title: row.title,
      comment: row.comment,
      reviewerName: customer?.full_name?.trim() || "Verified Customer",
      createdAt: row.created_at,
    };
  });

  const reviewCount = reviews.length;
  const averageRating = reviewCount
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : null;

  return { reviews, averageRating, reviewCount };
}

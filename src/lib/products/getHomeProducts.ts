// src/lib/products/getHomeProducts.ts
//
// Server-side homepage product feed for New Arrivals / Best Rated / Best
// Sellers. Uses the service-role client because ranking "best sellers"
// requires reading order_items across every customer, and order_items' RLS
// (deliberately) only lets a customer read their own order lines -- there
// is no public policy for it, unlike products (active-only) and reviews
// (approved-only), which the anon/browser client could already read
// directly. Doing the whole computation here keeps that privileged read
// server-side, and lets all three homepage sections share one consistent,
// safe data path instead of splitting between a client hook and a server
// fetch.
//
// Ranking gracefully degrades: with no reviews/orders yet, best_rated and
// best_selling both fall back to newest-first (same order as "newest"), so
// the sections never need to hide for lack of data -- they show the same
// regular product cards New Arrivals would, and reorder automatically as
// real ratings/sales accumulate.
import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface HomeProduct {
  id: string;
  name: string;
  base_price: number;
  discounted_price: number | null;
  created_at: string;
  primaryImageUrl: string | null;
  isNew: boolean;
  averageRating: number | null;
  reviewCount: number;
}

export type HomeProductMode = "newest" | "best_rated" | "best_selling";

const NEW_WINDOW_DAYS = 14;
// Wide enough pool of recent active products to rank within before slicing
// down to `limit` -- ranking only the most recent POOL_SIZE keeps this
// cheap without needing a dedicated SQL view for such a small catalog.
const POOL_SIZE = 50;

interface RawProductRow {
  id: string;
  name: string;
  base_price: number;
  discounted_price: number | null;
  created_at: string;
  product_images: { url: string; is_primary: boolean }[] | null;
}

export async function getHomeProducts(
  mode: HomeProductMode,
  limit = 4,
): Promise<HomeProduct[]> {
  const supabase = createAdminClient();

  const [productsResult, reviewsResult, orderItemsResult] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, name, base_price, discounted_price, created_at, product_images ( url, is_primary )",
      )
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(POOL_SIZE),
    supabase.from("reviews").select("product_id, rating").eq("status", "approved"),
    supabase.from("order_items").select("product_id, quantity"),
  ]);

  if (productsResult.error) {
    console.error(
      "[getHomeProducts] products fetch error:",
      productsResult.error.message,
    );
    return [];
  }

  // Aggregate approved ratings per product.
  const ratingTotals = new Map<string, { sum: number; count: number }>();
  for (const row of (reviewsResult.data ?? []) as {
    product_id: string;
    rating: number;
  }[]) {
    const entry = ratingTotals.get(row.product_id) ?? { sum: 0, count: 0 };
    entry.sum += row.rating;
    entry.count += 1;
    ratingTotals.set(row.product_id, entry);
  }
  if (reviewsResult.error) {
    console.error(
      "[getHomeProducts] reviews fetch error (ranking degrades to newest):",
      reviewsResult.error.message,
    );
  }

  // Aggregate units sold per product across all order_items -- there's no
  // payment gate yet (see placeOrder.ts), so every order line is counted
  // regardless of order status; this is the closest available "popularity"
  // signal until a real payment/fulfillment gate exists.
  const unitsSoldByProduct = new Map<string, number>();
  for (const row of (orderItemsResult.data ?? []) as {
    product_id: string | null;
    quantity: number;
  }[]) {
    if (!row.product_id) continue;
    unitsSoldByProduct.set(
      row.product_id,
      (unitsSoldByProduct.get(row.product_id) ?? 0) + row.quantity,
    );
  }
  if (orderItemsResult.error) {
    console.error(
      "[getHomeProducts] order_items fetch error (ranking degrades to newest):",
      orderItemsResult.error.message,
    );
  }

  const now = Date.now();
  const rows = (productsResult.data ?? []) as unknown as RawProductRow[];

  let mapped: HomeProduct[] = rows.map((p) => {
    const createdMs = new Date(p.created_at).getTime();
    const isNew = (now - createdMs) / (1000 * 60 * 60 * 24) <= NEW_WINDOW_DAYS;
    const primaryImage =
      (p.product_images ?? []).find((img) => img.is_primary) ??
      (p.product_images ?? [])[0];
    const ratingEntry = ratingTotals.get(p.id);

    return {
      id: p.id,
      name: p.name,
      base_price: p.base_price,
      discounted_price: p.discounted_price,
      created_at: p.created_at,
      primaryImageUrl: primaryImage ? primaryImage.url : null,
      isNew,
      averageRating: ratingEntry ? ratingEntry.sum / ratingEntry.count : null,
      reviewCount: ratingEntry?.count ?? 0,
    };
  });

  if (mode === "best_rated") {
    // Higher average rating first; unrated products (null) sort last.
    // Tie-break by review count, then by recency so the order stays
    // sensible and stable while most/all products are still unrated.
    mapped = mapped.sort((a, b) => {
      const ratingDiff = (b.averageRating ?? -1) - (a.averageRating ?? -1);
      if (ratingDiff !== 0) return ratingDiff;
      const countDiff = b.reviewCount - a.reviewCount;
      if (countDiff !== 0) return countDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  } else if (mode === "best_selling") {
    // Higher units sold first; products with 0 sales naturally sort last
    // and fall back to recency, same reasoning as above.
    mapped = mapped.sort((a, b) => {
      const soldDiff =
        (unitsSoldByProduct.get(b.id) ?? 0) - (unitsSoldByProduct.get(a.id) ?? 0);
      if (soldDiff !== 0) return soldDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }
  // mode === "newest": rows are already ordered by created_at desc from the query.

  return mapped.slice(0, limit);
}

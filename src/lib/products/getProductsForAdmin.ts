// src/lib/products/getProductsForAdmin.ts
import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface AdminProductRow {
  id: string;
  name: string;
  base_price: number;
  discounted_price: number | null;
  status: "active" | "draft";
  created_at: string;
  category: { id: string; name: string } | null;
  stockCount: number;
  primaryImageUrl: string | null;
}

interface RawAdminListRow {
  id: string;
  name: string;
  base_price: number;
  discounted_price: number | null;
  status: "active" | "draft";
  created_at: string;
  stock_count: number | null;
  categories: { id: string; name: string } | { id: string; name: string }[] | null;
  product_images: { url: string; is_primary: boolean }[] | null;
}

export async function getProductsForAdmin(): Promise<AdminProductRow[]> {
  const supabase = await createClient();

  const result = await supabase
    .from("products")
    .select(
      "id, name, base_price, discounted_price, status, created_at, stock_count, categories ( id, name ), product_images ( url, is_primary )",
    )
    .order("created_at", { ascending: false });

  const data = result.data as unknown as RawAdminListRow[] | null;
  const error = result.error;

  if (error) {
    console.error("[getProductsForAdmin] fetch error:", error.message);
    return [];
  }

  return (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    base_price: p.base_price,
    discounted_price: p.discounted_price,
    status: p.status,
    created_at: p.created_at,
    category: Array.isArray(p.categories)
      ? (p.categories[0] ?? null)
      : p.categories,
    stockCount: p.stock_count ?? 0,
    primaryImageUrl:
      (p.product_images ?? []).find((img) => img.is_primary)?.url ??
      (p.product_images ?? [])[0]?.url ??
      null,
  }));
}

// src/lib/inventory/getInventoryForAdmin.ts
//
// Stock-focused product list for the Inventory admin page. Same
// RLS-respecting server client convention as getProductsForAdmin.ts
// ("Admins manage products" ALL is_admin() policy).
import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface AdminInventoryRow {
  id: string;
  name: string;
  sku: string | null;
  stockCount: number;
  status: "draft" | "active" | "archived";
  category: string | null;
  primaryImageUrl: string | null;
}

interface RawInventoryRow {
  id: string;
  name: string;
  sku: string | null;
  stock_count: number | null;
  status: "draft" | "active" | "archived";
  categories: { name: string } | { name: string }[] | null;
  product_images: { url: string; is_primary: boolean }[] | null;
}

export async function getInventoryForAdmin(): Promise<AdminInventoryRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, sku, stock_count, status, categories ( name ), product_images ( url, is_primary )",
    )
    .order("stock_count", { ascending: true });

  if (error) {
    console.error("[getInventoryForAdmin] fetch error:", error.message);
    return [];
  }

  const rows = (data ?? []) as unknown as RawInventoryRow[];

  return rows.map((row) => {
    const category = Array.isArray(row.categories)
      ? (row.categories[0] ?? null)
      : row.categories;

    return {
      id: row.id,
      name: row.name,
      sku: row.sku,
      stockCount: row.stock_count ?? 0,
      status: row.status,
      category: category?.name ?? null,
      primaryImageUrl:
        (row.product_images ?? []).find((img) => img.is_primary)?.url ??
        (row.product_images ?? [])[0]?.url ??
        null,
    };
  });
}

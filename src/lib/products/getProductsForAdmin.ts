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
  variantCount: number;
  primaryImageUrl: string | null;
}

export async function getProductsForAdmin(): Promise<AdminProductRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      base_price,
      discounted_price,
      status,
      created_at,
      categories ( id, name ),
      product_variants ( id ),
      product_images ( url, is_primary )
      `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getProductsForAdmin] fetch error:", error.message);
    return [];
  }

  return (data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    base_price: p.base_price,
    discounted_price: p.discounted_price,
    status: p.status,
    created_at: p.created_at,
    category: Array.isArray(p.categories)
      ? (p.categories[0] ?? null)
      : p.categories,
    variantCount: (p.product_variants ?? []).length,
    primaryImageUrl:
      (p.product_images ?? []).find((img: any) => img.is_primary)?.url ??
      (p.product_images ?? [])[0]?.url ??
      null,
  }));
}

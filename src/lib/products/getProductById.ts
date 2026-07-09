// src/lib/products/getProductById.ts
//
// Server-side fetch for a single product's full detail -- used by the
// product detail page (app/(main)/product/[productId]/page.tsx). Runs
// server-side so the page can be crawled/indexed with real content in the
// initial HTML (SEO) rather than a client-side loading spinner.
//
// Each product represents itself directly -- there is no variant system.
// Price, stock, and SKU all live on the product row. Attributes are simple
// descriptive facts about this one product (e.g. Color: Black), inherited
// from the category's attribute template but not used to pick between
// purchasable options.
import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface ProductDetailAttribute {
  id: string;
  label: string;
  value: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  discountedPrice: number | null;
  sku: string | null;
  stockCount: number;
  category: { id: string; name: string } | null;
  images: { url: string; isPrimary: boolean }[];
  attributes: ProductDetailAttribute[];
}

// Raw row shapes returned by the Supabase select below.
interface RawProductAttribute {
  id: string;
  label: string;
  value: string | null;
}

interface RawProductDetailRow {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  discounted_price: number | null;
  sku: string | null;
  stock_count: number | null;
  categories: { id: string; name: string } | { id: string; name: string }[] | null;
  product_images: { url: string; is_primary: boolean }[] | null;
  product_attributes: RawProductAttribute[] | null;
}

export async function getProductById(
  productId: string,
): Promise<ProductDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, description, base_price, discounted_price, status, sku, stock_count, categories ( id, name ), product_images ( url, is_primary ), product_attributes ( id, label, value )",
    )
    .eq("id", productId)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.error("[getProductById] fetch error:", error.message);
    return null;
  }

  if (!data) return null;

  const row = data as unknown as RawProductDetailRow;

  const category = Array.isArray(row.categories)
    ? (row.categories[0] ?? null)
    : row.categories;

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    basePrice: row.base_price,
    discountedPrice: row.discounted_price,
    sku: row.sku ?? null,
    stockCount: row.stock_count ?? 0,
    category,
    images: (row.product_images ?? []).map((img) => ({
      url: img.url,
      isPrimary: img.is_primary,
    })),
    attributes: (row.product_attributes ?? [])
      .filter((attr) => attr.value && attr.value.trim().length > 0)
      .map((attr) => ({
        id: attr.id,
        label: attr.label,
        value: attr.value as string,
      })),
  };
}

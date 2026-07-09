// hooks/useProducts.ts
//
// Fetches active products from Supabase for the customer-facing shop page,
// with optional category/price filtering and sort applied server-side via
// the query builder, so it scales past however many products end up in the
// catalog.
//
// Each product represents itself directly -- there is no variant system.
// Price and stock live on the product row.
//
// NOTE: the setState-in-effect pattern below (fetchProducts() called from
// a useEffect) matches the existing hooks in this codebase (useCategories,
// useHomeProducts, useSaleProducts) for consistency -- not fixed here since
// it's a codebase-wide pattern, not specific to this hook.

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProductImage {
  url: string;
  is_primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string | null;
  categoryId: string | null;
  basePrice: number;
  discountedPrice: number | null;
  status: string;
  primaryImageUrl: string | null;
  stockCount: number;
}

export type ProductSortMode = "newest" | "price_low_high" | "price_high_low";

export interface UseProductsFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSortMode;
  /** Case-insensitive substring match against the product name. */
  search?: string;
}

export interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

// Shape of a single raw row returned by the Supabase select below.
interface RawProductRow {
  id: string;
  name: string;
  base_price: number;
  discounted_price: number | null;
  status: string;
  category_id: string | null;
  stock_count: number | null;
  categories: { name: string } | { name: string }[] | null;
  product_images: ProductImage[] | null;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useProducts(
  filters: UseProductsFilters = {},
): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryId = filters.categoryId;
  const minPrice = filters.minPrice;
  const maxPrice = filters.maxPrice;
  const sort = filters.sort;
  const search = filters.search;

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      let query = supabase
        .from("products")
        .select(
          "id, name, base_price, discounted_price, status, category_id, stock_count, categories ( name ), product_images ( url, is_primary )",
        )
        .eq("status", "active");

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (typeof minPrice === "number") {
        query = query.gte("base_price", minPrice);
      }

      if (typeof maxPrice === "number") {
        query = query.lte("base_price", maxPrice);
      }

      if (search && search.trim()) {
        // Escape % and _ (ILIKE wildcards) and , (PostgREST filter separator)
        // so the raw search text is always treated as a literal substring.
        const escaped = search.trim().replace(/[%_,]/g, (c) => `\\${c}`);
        query = query.ilike("name", `%${escaped}%`);
      }

      if (sort === "price_low_high") {
        query = query.order("base_price", { ascending: true });
      } else if (sort === "price_high_low") {
        query = query.order("base_price", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const result = await query;
      const data = result.data as unknown as RawProductRow[] | null;
      const supabaseError = result.error;

      if (supabaseError) {
        console.error("[useProducts] Supabase error:", supabaseError.message);
        setError("Failed to load products. Please try again.");
        return;
      }

      const mapped: Product[] = (data ?? []).map((p) => {
        const categoriesValue = p.categories;
        const category = Array.isArray(categoriesValue)
          ? (categoriesValue[0]?.name ?? null)
          : (categoriesValue?.name ?? null);

        const primaryImage =
          (p.product_images ?? []).find((img) => img.is_primary) ??
          (p.product_images ?? [])[0];

        return {
          id: p.id,
          name: p.name,
          category,
          categoryId: p.category_id ?? null,
          basePrice: p.base_price,
          discountedPrice: p.discounted_price,
          status: p.status,
          primaryImageUrl: primaryImage ? primaryImage.url : null,
          stockCount: p.stock_count ?? 0,
        };
      });

      setProducts(mapped);
    } catch (err) {
      console.error("[useProducts] Unexpected error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, minPrice, maxPrice, sort, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    retry: fetchProducts,
  };
}

// hooks/useProducts.ts
//
// Fetches all active products from Supabase in a single query.
// Pagination and filtering can be added later as separate concerns.

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProductImage {
  url: string;
  is_primary: boolean;
}

export interface ProductVariant {
  price_override: number | null;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  fullDescription: string;
  base_price: number;
  original_price: number | null;
  discounted_price: number | null;
  status: string;
  categories: { name: string }[] | null; // ← was: { name: string } | null
  product_images: ProductImage[];
  product_variants: ProductVariant[];
}

export interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data, error: supabaseError } = await supabase
        .from("products")
        .select(
          `
          id,
          name,
          base_price,
          original_price,
          discounted_price,
          status,
          categories (
            name
          ),
          product_images (
            url,
            is_primary
          ),
          product_variants (
            price_override
          )
          `,
        )
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (supabaseError) {
        console.error("[useProducts] Supabase error:", supabaseError.message);
        setError("Failed to load products. Please try again.");
        return;
      }

      setProducts(data ?? []);
    } catch (err) {
      console.error("[useProducts] Unexpected error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

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

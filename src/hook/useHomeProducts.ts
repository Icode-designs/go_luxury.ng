// src/hook/useHomeProducts.ts
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface HomeProduct {
  id: string;
  name: string;
  base_price: number;
  discounted_price: number | null;
  created_at: string;
  primaryImageUrl: string | null;
  variantCount: number;
  minVariantPrice: number | null;
  maxVariantPrice: number | null;
  isNew: boolean;
  averageRating: number | null;
  reviewCount: number;
}

type SortMode = "newest" | "best_selling" | "best_rated";

const NEW_WINDOW_DAYS = 14;

export function useHomeProducts(mode: SortMode, limit = 4) {
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const supabase = createClient();

      // NOTE: "best_selling" and "best_rated" ordering below assume
      // units_sold / average_rating are either real columns or views —
      // these don't currently exist in the schema we've built and are
      // flagged as a known gap at the end of this answer.
      let query = supabase
        .from("products")
        .select(
          `
          id, name, base_price, discounted_price, created_at,
          product_images ( url, is_primary ),
          product_variants ( price_override )
          `,
        )
        .eq("status", "active")
        .limit(limit);

      if (mode === "newest") {
        query = query.order("created_at", { ascending: false });
      } else {
        // Fallback ordering until real sales/rating aggregates exist
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error("[useHomeProducts] fetch error:", error.message);
        if (!cancelled) setIsLoading(false);
        return;
      }

      if (!cancelled) {
        const now = Date.now();
        setProducts(
          (data ?? []).map((p: any) => {
            const variantPrices = (p.product_variants ?? [])
              .map((v: any) => v.price_override)
              .filter(
                (price: number | null): price is number => price !== null,
              );

            const createdMs = new Date(p.created_at).getTime();
            const isNew =
              (now - createdMs) / (1000 * 60 * 60 * 24) <= NEW_WINDOW_DAYS;

            return {
              id: p.id,
              name: p.name,
              base_price: p.base_price,
              discounted_price: p.discounted_price,
              created_at: p.created_at,
              primaryImageUrl:
                (p.product_images ?? []).find((img: any) => img.is_primary)
                  ?.url ??
                (p.product_images ?? [])[0]?.url ??
                null,
              variantCount: (p.product_variants ?? []).length,
              minVariantPrice: variantPrices.length
                ? Math.min(...variantPrices)
                : null,
              maxVariantPrice: variantPrices.length
                ? Math.max(...variantPrices)
                : null,
              isNew,
              averageRating: null, // gap — see note below
              reviewCount: 0, // gap — see note below
            };
          }),
        );
        setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [mode, limit]);

  return { products, isLoading };
}

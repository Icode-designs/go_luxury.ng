// src/hook/useSaleProducts.ts
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { HomeProduct } from "./useHomeProducts";

export function useSaleProducts(limit = 4) {
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maxDiscountPercent, setMaxDiscountPercent] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("products")
        .select(
          `
          id, name, base_price, discounted_price, created_at,
          product_images ( url, is_primary ),
          product_variants ( price_override )
          `,
        )
        .eq("status", "active")
        .not("discounted_price", "is", null) // ← the actual "on sale" filter
        .order("discounted_price", { ascending: true })
        .limit(limit);

      if (error) {
        console.error("[useSaleProducts] fetch error:", error.message);
        if (!cancelled) setIsLoading(false);
        return;
      }

      if (!cancelled) {
        const now = Date.now();
        const mapped: HomeProduct[] = (data ?? []).map((p: any) => {
          const variantPrices = (p.product_variants ?? [])
            .map((v: any) => v.price_override)
            .filter((price: number | null): price is number => price !== null);

          const createdMs = new Date(p.created_at).getTime();
          const isNew = (now - createdMs) / (1000 * 60 * 60 * 24) <= 14;

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
            averageRating: null,
            reviewCount: 0,
          };
        });

        setProducts(mapped);

        // Compute the biggest discount % across this batch, for the banner
        const biggestDrop = mapped.reduce((max, p) => {
          if (!p.discounted_price) return max;
          const percent = Math.round(
            ((p.base_price - p.discounted_price) / p.base_price) * 100,
          );
          return Math.max(max, percent);
        }, 0);
        setMaxDiscountPercent(biggestDrop);

        setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { products, isLoading, maxDiscountPercent };
}

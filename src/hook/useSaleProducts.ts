// src/hook/useSaleProducts.ts
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { HomeProduct } from "@/lib/products/getHomeProducts";

interface RawSaleProductRow {
  id: string;
  name: string;
  base_price: number;
  discounted_price: number | null;
  created_at: string;
  product_images: { url: string; is_primary: boolean }[] | null;
}

export function useSaleProducts(limit = 4) {
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maxDiscountPercent, setMaxDiscountPercent] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const supabase = createClient();

      const result = await supabase
        .from("products")
        .select(
          "id, name, base_price, discounted_price, created_at, product_images ( url, is_primary )",
        )
        .eq("status", "active")
        .not("discounted_price", "is", null) // -- the actual "on sale" filter
        .order("discounted_price", { ascending: true })
        .limit(limit);

      const data = result.data as unknown as RawSaleProductRow[] | null;
      const error = result.error;

      if (error) {
        console.error("[useSaleProducts] fetch error:", error.message);
        if (!cancelled) setIsLoading(false);
        return;
      }

      if (!cancelled) {
        const now = Date.now();
        const mapped: HomeProduct[] = (data ?? []).map((p) => {
          const createdMs = new Date(p.created_at).getTime();
          const isNew = (now - createdMs) / (1000 * 60 * 60 * 24) <= 14;

          const primaryImage =
            (p.product_images ?? []).find((img) => img.is_primary) ??
            (p.product_images ?? [])[0];

          return {
            id: p.id,
            name: p.name,
            base_price: p.base_price,
            discounted_price: p.discounted_price,
            created_at: p.created_at,
            primaryImageUrl: primaryImage ? primaryImage.url : null,
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

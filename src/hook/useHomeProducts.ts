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
  isNew: boolean;
  averageRating: number | null;
  reviewCount: number;
}

type SortMode = "newest" | "best_selling" | "best_rated";

const NEW_WINDOW_DAYS = 14;

interface RawHomeProductRow {
  id: string;
  name: string;
  base_price: number;
  discounted_price: number | null;
  created_at: string;
  product_images: { url: string; is_primary: boolean }[] | null;
}

export function useHomeProducts(mode: SortMode, limit = 4) {
  const [products, setProducts] = useState<HomeProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      const supabase = createClient();

      // NOTE: "best_selling" and "best_rated" ordering below assume
      // units_sold / average_rating are either real columns or views --
      // these don't currently exist in the schema we've built and are
      // flagged as a known gap at the end of this answer.
      let query = supabase
        .from("products")
        .select(
          "id, name, base_price, discounted_price, created_at, product_images ( url, is_primary )",
        )
        .eq("status", "active")
        .limit(limit);

      if (mode === "newest") {
        query = query.order("created_at", { ascending: false });
      } else {
        // Fallback ordering until real sales/rating aggregates exist
        query = query.order("created_at", { ascending: false });
      }

      const result = await query;
      const data = result.data as unknown as RawHomeProductRow[] | null;
      const error = result.error;

      if (error) {
        console.error("[useHomeProducts] fetch error:", error.message);
        if (!cancelled) setIsLoading(false);
        return;
      }

      if (!cancelled) {
        const now = Date.now();
        setProducts(
          (data ?? []).map((p) => {
            const createdMs = new Date(p.created_at).getTime();
            const isNew =
              (now - createdMs) / (1000 * 60 * 60 * 24) <= NEW_WINDOW_DAYS;

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
              averageRating: null, // gap -- see note below
              reviewCount: 0, // gap -- see note below
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

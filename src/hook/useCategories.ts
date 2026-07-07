// src/hook/useCategories.ts
"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface CategoryAttributeTemplate {
  id: string;
  label: string;
  required: boolean;
}

export interface Category {
  id: string;
  name: string;
  status: string;
  image_url: string;
  attributes: CategoryAttributeTemplate[];
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("categories")
      .select(
        `
        id,
        name,
        status,
        image_url,
        category_attributes (
          id,
          label,
          required
        )
        `,
      )
      .eq("status", "active")
      .order("name");

    if (fetchError) {
      console.error("[useCategories] fetch error:", fetchError.message);
      setError("Failed to load categories.");
      setIsLoading(false);
      return;
    }

    setCategories(
      (data ?? []).map((c) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        image_url: c.image_url,

        attributes: c.category_attributes ?? [],
      })),
    );
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error, retry: fetchCategories };
}

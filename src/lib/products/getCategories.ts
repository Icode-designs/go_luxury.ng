// src/lib/products/getCategories.ts
// Server-side category list — used to render shop filters without a
// client-side fetch/loading flicker.
import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface ShopCategory {
  id: string;
  name: string;
}

export async function getCategories(): Promise<ShopCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("status", "active")
    .order("name");

  if (error) {
    console.error("[getCategories] fetch error:", error.message);
    return [];
  }

  return data ?? [];
}

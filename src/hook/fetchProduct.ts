// src/hook/fetchProduct.ts
"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AttributeValueRow } from "@/components/user/products/productAttributes";

export interface ExistingProductData {
  id: string;
  name: string;
  categoryId: string;
  fullDescription: string;
  basePrice: number;
  discountedPrice: number | null;
  sku: string;
  stockCount: string;
  status: "draft" | "active" | "archived";
  attributes: AttributeValueRow[];
  existingImages: { storageId: string; url: string; isPrimary: boolean }[];
}

interface RawAdminProductAttribute {
  id: string;
  label: string;
  value: string | null;
}

interface RawAdminProductImage {
  url: string;
  storage_id: string;
  is_primary: boolean;
}

interface RawAdminProductRow {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  discounted_price: number | null;
  status: "draft" | "active" | "archived";
  category_id: string;
  sku: string | null;
  stock_count: number | null;
  product_attributes: RawAdminProductAttribute[] | null;
  product_images: RawAdminProductImage[] | null;
}

export function useProduct(productId: string | undefined) {
  const [product, setProduct] = useState<ExistingProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    const supabase = createClient();

    const result = await supabase
      .from("products")
      .select(
        "id, name, description, base_price, discounted_price, status, category_id, sku, stock_count, product_attributes ( id, label, value ), product_images ( url, storage_id, is_primary )",
      )
      .eq("id", productId)
      .maybeSingle();

    const data = result.data as unknown as RawAdminProductRow | null;
    const fetchError = result.error;

    if (fetchError || !data) {
      console.error("[useProduct] fetch error:", fetchError?.message);
      setError("Failed to load product.");
      setIsLoading(false);
      return;
    }

    const attributes: AttributeValueRow[] = (data.product_attributes ?? []).map(
      (attr) => ({
        id: attr.id,
        label: attr.label,
        value: attr.value ?? "",
      }),
    );

    setProduct({
      id: data.id,
      name: data.name,
      categoryId: data.category_id,
      fullDescription: data.description ?? "",
      basePrice: data.base_price,
      discountedPrice: data.discounted_price,
      sku: data.sku ?? "",
      stockCount: String(data.stock_count ?? 0),
      status: data.status,
      attributes,
      existingImages: (data.product_images ?? []).map((img) => ({
        storageId: img.storage_id,
        url: img.url,
        isPrimary: img.is_primary,
      })),
    });
    setIsLoading(false);
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const archiveProduct = useCallback(async () => {
    if (!productId) return;
    const supabase = createClient();
    const { error: archiveError } = await supabase
      .from("products")
      .update({ status: "archived" })
      .eq("id", productId);

    if (archiveError) throw new Error(archiveError.message);
    await fetchProduct();
  }, [productId, fetchProduct]);

  const reactivateProduct = useCallback(async () => {
    if (!productId) return;
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("products")
      .update({ status: "active" })
      .eq("id", productId);

    if (updateError) throw new Error(updateError.message);
    await fetchProduct();
  }, [productId, fetchProduct]);

  return {
    product,
    isLoading,
    error,
    archiveProduct,
    reactivateProduct,
    retry: fetchProduct,
  };
}

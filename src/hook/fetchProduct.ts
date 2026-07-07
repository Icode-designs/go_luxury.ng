// src/hook/fetchProduct.ts
"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { AttributeRow } from "@/components/user/products/productVariants";

export interface ExistingProductData {
  id: string;
  name: string;
  categoryId: string;
  fullDescription: string;
  basePrice: number;
  discountedPrice: number | null;
  status: "draft" | "active" | "archived";
  attributes: AttributeRow[];
  variantRows: Record<
    string,
    { stock: string; priceOverride: string; sku: string }
  >;
  existingImages: { storageId: string; url: string; isPrimary: boolean }[];
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

    const { data, error: fetchError } = await supabase
      .from("products")
      .select(
        `
        id, name, description, base_price, discounted_price, status, category_id,
        product_attributes (
          id, label,
          attribute_options ( id, value )
        ),
        product_images ( url, storage_id, is_primary ),
        product_variants (
          id, sku, price_override, stock_count,
          variant_attribute_options (
            attribute_options ( value, attribute_id )
          )
        )
        `,
      )
      .eq("id", productId)
      .maybeSingle();

    if (fetchError || !data) {
      console.error("[useProduct] fetch error:", fetchError?.message);
      setError("Failed to load product.");
      setIsLoading(false);
      return;
    }

    // Rebuild AttributeRow[] from product_attributes + their options
    const attributeIdToLabel = new Map<string, string>();
    const attributes: AttributeRow[] = (data.product_attributes ?? []).map(
      (attr: any) => {
        attributeIdToLabel.set(attr.id, attr.label);
        return {
          id: attr.id,
          label: attr.label,
          options: (attr.attribute_options ?? []).map((o: any) => o.value),
        };
      },
    );

    // Rebuild variantRows keyed the same way VariantTable/productVariants
    // generate keys (option values joined by " / "), so existing variants
    // line up with freshly-generated combinations.
    const variantRows: ExistingProductData["variantRows"] = {};
    for (const variant of data.product_variants ?? []) {
      const comboValues = (variant.variant_attribute_options ?? [])
        .map((vao: any) => vao.attribute_options?.value)
        .filter(Boolean);

      const key = comboValues.join(" / ");
      variantRows[key] = {
        stock: String(variant.stock_count ?? ""),
        priceOverride:
          variant.price_override != null ? String(variant.price_override) : "",
        sku: variant.sku ?? "",
      };
    }

    setProduct({
      id: data.id,
      name: data.name,
      categoryId: data.category_id,
      fullDescription: data.description ?? "",
      basePrice: data.base_price,
      discountedPrice: data.discounted_price,
      status: data.status,
      attributes,
      variantRows,
      existingImages: (data.product_images ?? []).map((img: any) => ({
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

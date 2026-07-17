// src/components/user/products/editProductForm.tsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/user/products/products.styles";
import GeneralInformation from "./generalInformation";
import ProductMedia from "./productMedia";
import ProductAttributes, { type AttributeValueRow } from "./productAttributes";
import { useCategories } from "@/hook/useCategories";
import { submitProduct } from "@/lib/products/submitProduct";
import { FlexBox } from "@/styles/components.styled";
import Button from "../../ui/button";
import type { ExistingProductData } from "@/hook/fetchProduct";
import { useRef } from "react";
import type { UseProductMediaResult } from "@/hook/useProductMedia";

// ...in the JSX:
interface EditProductFormProps {
  product: ExistingProductData;
  onArchive: () => Promise<void>;
  onReactivate: () => Promise<void>;
}

const EditProductForm = ({
  product,
  onArchive,
  onReactivate,
}: EditProductFormProps) => {
  const router = useRouter();
  const mediaHookRef = useRef<UseProductMediaResult | null>(null);

  const [productTitle, setProductTitle] = useState(product.name);
  const [categoryId] = useState(product.categoryId); // locked, never changes
  const [fullDescription, setFullDescription] = useState(
    product.fullDescription,
  );
  const [basePrice, setBasePrice] = useState(String(product.basePrice));
  const [isOnSale, setIsOnSale] = useState(product.discountedPrice !== null);
  const [discountedPrice, setDiscountedPrice] = useState(
    product.discountedPrice != null ? String(product.discountedPrice) : "",
  );
  const [sku, setSku] = useState(product.sku);
  const [stockCount, setStockCount] = useState(product.stockCount);
  const [attributes, setAttributes] = useState<AttributeValueRow[]>(
    product.attributes,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { categories } = useCategories();

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const isArchived = product.status === "archived";

  async function handleSubmit(e: React.FormEvent, status: "draft" | "active") {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitProduct({
        productId: product.id,
        name: productTitle,
        categoryId,
        fullDescription,
        basePrice: Number(basePrice) || 0,
        discountedPrice: isOnSale ? Number(discountedPrice) || null : null,
        sku: sku.trim() || null,
        stockCount: Number(stockCount) || 0,
        status,
        attributes,
        mediaFiles: mediaHookRef.current?.getFilesForUpload() ?? [],
        removedImageStorageIds:
          mediaHookRef.current?.getRemovedStorageIds() ?? [],
      });
      router.push("/admin/products");
    } catch (err) {
      console.error("[EditProductForm] submit error:", err);
      setSubmitError(
        "Something went wrong saving this product. Please try again.",
      );
      setIsSubmitting(false);
    }
  }

  async function handleArchiveToggle() {
    setIsArchiving(true);
    setSubmitError(null);
    try {
      if (isArchived) {
        await onReactivate();
      } else {
        await onArchive();
        router.push("/admin/products");
      }
    } catch (err) {
      console.error("[EditProductForm] archive error:", err);
      setSubmitError("Failed to update product status. Please try again.");
    } finally {
      setIsArchiving(false);
    }
  }

  return (
    <ProductForm onSubmit={(e) => handleSubmit(e, "active")}>
      {isArchived && (
        <div
          style={{
            background: "#F3F0EC",
            border: "1px solid #D4BFB0",
            padding: "12px 16px",
            borderRadius: 8,
            fontSize: 13,
            color: "#5A4D45",
          }}
        >
          This product is archived and is not visible on the storefront.
        </div>
      )}

      <GeneralInformation
        productTitle={productTitle}
        onProductTitleChange={setProductTitle}
        categoryId={categoryId}
        onCategoryChange={() => {}} // locked — no-op
        categoryLocked
        fullDescription={fullDescription}
        onFullDescriptionChange={setFullDescription}
        basePrice={basePrice}
        onBasePriceChange={setBasePrice}
        isOnSale={isOnSale}
        onIsOnSaleChange={setIsOnSale}
        discountedPrice={discountedPrice}
        onDiscountedPriceChange={setDiscountedPrice}
        sku={sku}
        onSkuChange={setSku}
        stockCount={stockCount}
        onStockCountChange={setStockCount}
      />

      <ProductMedia
        existingImages={product.existingImages}
        onMediaHookReady={(hook) => {
          mediaHookRef.current = hook;
        }}
      />

      <ProductAttributes
        categoryAttributes={selectedCategory?.attributes ?? []}
        attributes={attributes}
        onAttributesChange={setAttributes}
        isEditing
      />

      {submitError && (
        <p style={{ color: "#8B3A2A", fontSize: 13 }}>{submitError}</p>
      )}

      <FlexBox $gap={20} $width="100%" $justify="space-between">
        <Button
          variant="outlined"
          type="button"
          disabled={isArchiving || isSubmitting}
          onClick={handleArchiveToggle}
          style={{ borderColor: "#8B3A2A", color: "#8B3A2A" }}
        >
          {isArchiving
            ? "Please wait…"
            : isArchived
              ? "Reactivate product"
              : "Archive product"}
        </Button>

        <FlexBox $gap={20}>
          <Button
            variant="outlined"
            type="button"
            disabled={isSubmitting}
            onClick={(e) =>
              handleSubmit(e as unknown as React.FormEvent, "draft")
            }
          >
            Save as draft
          </Button>
          <Button variant="filled-nude" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </FlexBox>
      </FlexBox>
    </ProductForm>
  );
};

export default EditProductForm;

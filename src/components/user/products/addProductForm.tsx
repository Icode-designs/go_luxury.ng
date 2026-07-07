// src/components/user/addProductForm.tsx
"use client";
import React, { useState } from "react";
import { ProductForm } from "@/components/user/products/products.styles";
import GeneralInformation from "./generalInformation";
import ProductMedia from "./productMedia";
import ProductVariants, { type AttributeRow } from "./productVariants";
import { useProductMedia } from "@/hook/useProductMedia";
import { useCategories } from "@/hook/useCategories";
import { submitProduct } from "@/lib/products/submitProduct";
import { FlexBox } from "@/styles/components.styled";
import Button from "../../ui/button";
import { redirect } from "next/navigation";

interface AddProductFormProps {
  existingProductId?: string; // presence = editing, absence = creating
}

const AddProductForm = ({ existingProductId }: AddProductFormProps) => {
  const isEditing = Boolean(existingProductId);

  const [productTitle, setProductTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [isOnSale, setIsOnSale] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [attributes, setAttributes] = useState<AttributeRow[]>([]);
  const [variantRows, setVariantRows] = useState<
    Record<string, { stock: string; priceOverride: string; sku: string }>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { categories } = useCategories();
  const { getFilesForUpload } = useProductMedia();

  const selectedCategory = categories.find((c) => c.id === categoryId);

  async function handleSubmit(e: React.FormEvent, status: "draft" | "active") {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await submitProduct({
        productId: existingProductId,
        name: productTitle,
        categoryId,
        fullDescription,
        basePrice: Number(basePrice) || 0,
        discountedPrice: isOnSale ? Number(discountedPrice) || null : null,
        status,
        attributes,
        variantRows,
        mediaFiles: await getFilesForUpload(),
      });
    } catch (err) {
      console.error("[AddProductForm] submit error:", err);
      setSubmitError(
        "Something went wrong saving this product. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
      redirect("/admin/products");
    }
  }

  return (
    <ProductForm onSubmit={(e) => handleSubmit(e, "active")}>
      <GeneralInformation
        productTitle={productTitle}
        onProductTitleChange={setProductTitle}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        categoryLocked={isEditing}
        fullDescription={fullDescription}
        onFullDescriptionChange={setFullDescription}
        basePrice={basePrice}
        onBasePriceChange={setBasePrice}
        isOnSale={isOnSale}
        onIsOnSaleChange={setIsOnSale}
        discountedPrice={discountedPrice}
        onDiscountedPriceChange={setDiscountedPrice}
      />

      <ProductMedia />

      <ProductVariants
        categoryAttributes={selectedCategory?.attributes ?? []}
        attributes={attributes}
        onAttributesChange={setAttributes}
        variantRows={variantRows}
        onVariantRowsChange={setVariantRows}
        isEditing={isEditing}
      />

      {submitError && (
        <p style={{ color: "#8B3A2A", fontSize: 13 }}>{submitError}</p>
      )}

      <FlexBox $gap={20} $width="100%" $justify="flex-end">
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
          {isSubmitting ? "Publishing…" : "Publish"}
        </Button>
      </FlexBox>
    </ProductForm>
  );
};

export default AddProductForm;

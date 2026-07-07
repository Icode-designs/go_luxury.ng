// src/components/user/generalInformation.tsx
"use client";
import React from "react";
import { InputBox } from "@/styles/auth.styles";
import { FlexBox } from "@/styles/components.styled";
import { StyledSelect, PriceToggleRow } from "./products.styles";
import { useCategories } from "@/hook/useCategories";

interface GeneralInformationProps {
  productTitle: string;
  onProductTitleChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (categoryId: string) => void;
  categoryLocked?: boolean;
  fullDescription: string;
  onFullDescriptionChange: (value: string) => void;
  basePrice: string;
  onBasePriceChange: (value: string) => void;
  isOnSale: boolean;
  onIsOnSaleChange: (value: boolean) => void;
  discountedPrice: string;
  onDiscountedPriceChange: (value: string) => void;
}

const GeneralInformation = ({
  productTitle,
  onProductTitleChange,
  categoryId,
  onCategoryChange,
  categoryLocked = false,
  fullDescription,
  onFullDescriptionChange,
  basePrice,
  onBasePriceChange,
  isOnSale,
  onIsOnSaleChange,
  discountedPrice,
  onDiscountedPriceChange,
}: GeneralInformationProps) => {
  const { categories, isLoading: categoriesLoading } = useCategories();

  const basePriceNumber = Number(basePrice) || 0;
  const discountedPriceNumber = Number(discountedPrice) || 0;
  const hasInvalidSalePrice =
    isOnSale &&
    basePrice !== "" &&
    discountedPrice !== "" &&
    discountedPriceNumber >= basePriceNumber;

  return (
    <fieldset>
      <div>
        <h2>General information</h2>
      </div>

      <FlexBox $justify="space-between" $gap={10} $width="100%">
        <InputBox>
          <label htmlFor="productTitle">Product Title</label>
          <input
            type="text"
            id="productTitle"
            name="productTitle"
            placeholder="enter product title"
            value={productTitle}
            onChange={(e) => onProductTitleChange(e.target.value)}
          />
        </InputBox>

        <InputBox>
          <label htmlFor="category">
            Category
            {categoryLocked && (
              <span style={{ fontSize: 11, color: "#9A8880", marginLeft: 6 }}>
                (can&apos;t be changed after creation)
              </span>
            )}
          </label>
          <StyledSelect
            id="category"
            value={categoryId}
            disabled={categoryLocked || categoriesLoading}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="" disabled>
              {categoriesLoading ? "Loading categories…" : "Select a category"}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </StyledSelect>
        </InputBox>
      </FlexBox>

      <InputBox>
        <label htmlFor="fullDescription">Full description</label>
        <textarea
          id="fullDescription"
          name="fullDescription"
          placeholder="enter full description"
          value={fullDescription}
          onChange={(e) => onFullDescriptionChange(e.target.value)}
        />
      </InputBox>

      {/*
        Base Price is the single source of truth for the product's normal
        price. There is no separate "original price" field — when a sale is
        active, this base price IS the original price being discounted from.
        Mirrors the products table constraint:
          discounted_price is null or discounted_price < base_price
      */}
      <FlexBox $justify="space-between" $gap={10} $width="100%">
        <InputBox>
          <label htmlFor="basePrice">Base Price (₦)</label>
          <input
            type="number"
            id="basePrice"
            name="basePrice"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={basePrice}
            onChange={(e) => onBasePriceChange(e.target.value)}
          />
        </InputBox>
      </FlexBox>

      <PriceToggleRow>
        <label>
          <input
            type="checkbox"
            checked={isOnSale}
            onChange={(e) => onIsOnSaleChange(e.target.checked)}
          />
          This product is on sale
        </label>
      </PriceToggleRow>

      {isOnSale && (
        <FlexBox $justify="space-between" $gap={10} $width="100%">
          <InputBox>
            <label htmlFor="discountedPrice">Discounted Price (₦)</label>
            <input
              type="number"
              id="discountedPrice"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={discountedPrice}
              onChange={(e) => onDiscountedPriceChange(e.target.value)}
            />
            <span style={{ fontSize: 11, color: "#9A8880" }}>
              {basePrice
                ? `Must be less than the base price of ₦${basePriceNumber.toLocaleString()}`
                : "Set a base price first"}
            </span>
            {hasInvalidSalePrice && (
              <span style={{ fontSize: 11, color: "#8B3A2A" }}>
                Sale price must be lower than the base price.
              </span>
            )}
          </InputBox>
        </FlexBox>
      )}
    </fieldset>
  );
};

export default GeneralInformation;

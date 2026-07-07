// src/components/user/productVariants.tsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { StyledFormBtn } from "./products.styles";
import { FiPlusCircle } from "react-icons/fi";
import Variant from "./variant";
import VariantTable from "./variantTable";
import styled from "styled-components";
import type { CategoryAttributeTemplate } from "@/hook/useCategories";

const StyledVariantsContainer = styled.div`
  display: grid;
  gap: 16px;
`;

export interface AttributeRow {
  id: number;
  label: string;
  options: string[];
}

interface ProductVariantsProps {
  categoryAttributes: CategoryAttributeTemplate[];
  attributes: AttributeRow[];
  onAttributesChange: (rows: AttributeRow[]) => void;
  variantRows: Record<
    string,
    { stock: string; priceOverride: string; sku: string }
  >;
  onVariantRowsChange: (
    rows: Record<string, { stock: string; priceOverride: string; sku: string }>,
  ) => void;
  isEditing: boolean; // true when editing an existing (already published) product
}

const ProductVariants = ({
  categoryAttributes,
  attributes,
  onAttributesChange,
  variantRows,
  onVariantRowsChange,
  isEditing,
}: ProductVariantsProps) => {
  // Auto-populate attribute rows from the category's template the first
  // time a category is selected on a NEW product. We only seed rows that
  // aren't already present, so this never clobbers manual edits.
  useEffect(() => {
    if (isEditing || categoryAttributes.length === 0) return;

    const existingLabels = new Set(attributes.map((a) => a.label));
    const missing = categoryAttributes.filter(
      (ca) => !existingLabels.has(ca.label),
    );

    if (missing.length > 0) {
      onAttributesChange([
        ...attributes,
        ...missing.map((ca) => ({
          id: Date.now() + Math.random(),
          label: ca.label,
          options: [] as string[],
        })),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryAttributes]);

  const addAttribute = () => {
    onAttributesChange([
      ...attributes,
      { id: Date.now(), label: "", options: [] },
    ]);
  };

  const removeAttribute = (id: number) => {
    onAttributesChange(attributes.filter((a) => a.id !== id));
  };

  const updateAttribute = (id: number, updates: Partial<AttributeRow>) => {
    onAttributesChange(
      attributes.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    );
  };

  // Cartesian product of all attribute options — this is what generates
  // the actual purchasable variant combinations (e.g. 18" × 180% density).
  const generatedCombinations = useMemo(() => {
    const usableAttrs = attributes
      .filter((a) => a.label.trim())
      .map((a) => ({
        ...a,
        options: a.options.filter((opt) => opt.trim().length > 0), // ← strip blanks
      }))
      .filter((a) => a.options.length > 0); // ← re-check after stripping

    if (usableAttrs.length === 0) return [];

    return usableAttrs.reduce<string[][]>(
      (acc, attr) =>
        acc.flatMap((combo) => attr.options.map((opt) => [...combo, opt])),
      [[]],
    );
  }, [attributes]);

  const combinationLabels = useMemo(
    () =>
      attributes
        .filter(
          (a) =>
            a.label.trim() && a.options.some((opt) => opt.trim().length > 0),
        )
        .map((a) => a.label),
    [attributes],
  );

  return (
    <fieldset>
      <div>
        <h2>Variants, attributes &amp; pricing</h2>
        <p style={{ fontSize: 12, color: "#9A8880", marginTop: 4 }}>
          This variant grid provides the flexibility to support bundles,
          closures, and frontals by simply adding different attribute rows.
        </p>
      </div>

      <StyledVariantsContainer>
        {attributes.map((attr) => (
          <Variant
            key={`variant-${attr.id}`}
            label={attr.label}
            options={attr.options}
            onLabelChange={(label) => updateAttribute(attr.id, { label })}
            onOptionsChange={(options) => updateAttribute(attr.id, { options })}
            onRemove={
              attributes.length > 0 ? () => removeAttribute(attr.id) : undefined
            }
          />
        ))}

        <StyledFormBtn
          $variant="text"
          type="button"
          $color="#745A27"
          onClick={addAttribute}
        >
          <FiPlusCircle />
          Add another attribute
        </StyledFormBtn>
      </StyledVariantsContainer>

      {generatedCombinations.length > 0 && (
        <VariantTable
          attributeLabels={combinationLabels}
          combinations={generatedCombinations}
          variantRows={variantRows}
          onVariantRowsChange={onVariantRowsChange}
          allowDelete={!isEditing}
        />
      )}
    </fieldset>
  );
};

export default ProductVariants;

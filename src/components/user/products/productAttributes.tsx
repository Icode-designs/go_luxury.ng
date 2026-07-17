// src/components/user/products/productAttributes.tsx
//
// Replaces the old variant-grid UI. Each product represents itself
// directly (its own price/stock/SKU, entered in GeneralInformation) --
// attributes here are just descriptive facts about THIS product (e.g.
// Color: Black), seeded from the category's attribute template.
"use client";
import { useEffect } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { AttributeRowBox, StyledFormBtn } from "./products.styles";
import type { CategoryAttributeTemplate } from "@/hook/useCategories";

export interface AttributeValueRow {
  id: string;
  label: string;
  value: string;
}

interface ProductAttributesProps {
  categoryAttributes: CategoryAttributeTemplate[];
  attributes: AttributeValueRow[];
  onAttributesChange: (rows: AttributeValueRow[]) => void;
  isEditing: boolean; // true when editing an existing (already published) product
}

const ProductAttributes = ({
  categoryAttributes,
  attributes,
  onAttributesChange,
  isEditing,
}: ProductAttributesProps) => {
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
          id: `new-${Date.now()}-${Math.random()}`,
          label: ca.label,
          value: "",
        })),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryAttributes]);

  const addAttribute = () => {
    onAttributesChange([
      ...attributes,
      { id: `new-${Date.now()}-${Math.random()}`, label: "", value: "" },
    ]);
  };

  const removeAttribute = (id: string) => {
    onAttributesChange(attributes.filter((a) => a.id !== id));
  };

  const updateAttribute = (id: string, updates: Partial<AttributeValueRow>) => {
    onAttributesChange(
      attributes.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    );
  };

  return (
    <fieldset>
      <div>
        <h2>Attributes</h2>
        <p style={{ fontSize: 12, color: "#9A8880", marginTop: 4 }}>
          Descriptive details for this specific product, e.g. Color: Black,
          Length: 20 inch.
        </p>
      </div>

      {attributes.map((attr) => (
        <AttributeRowBox key={attr.id}>
          <div>
            <h3>Attribute</h3>
            <input
              type="text"
              placeholder="e.g. Color"
              defaultValue={attr.label}
              onChange={(e) =>
                updateAttribute(attr.id, { label: e.target.value })
              }
            />
          </div>

          <div>
            <h3>Value</h3>
            <input
              type="text"
              placeholder="e.g. Black"
              defaultValue={attr.value}
              onChange={(e) =>
                updateAttribute(attr.id, { value: e.target.value })
              }
            />
          </div>

          <StyledFormBtn
            $variant="text"
            $color="red"
            $size="20px"
            type="button"
            onClick={() => removeAttribute(attr.id)}
            aria-label={`Remove ${attr.label || "attribute"}`}
          >
            <MdDeleteOutline />
          </StyledFormBtn>
        </AttributeRowBox>
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
    </fieldset>
  );
};

export default ProductAttributes;

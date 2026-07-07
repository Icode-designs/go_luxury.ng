// src/components/user/variant.tsx
"use client";
import React from "react";
import {
  ProductVariantBox,
  ProductVariantItem,
  StyledFormBtn,
} from "./products.styles";
import { RiCloseLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import { FlexBox } from "@/styles/components.styled";

interface VariantProps {
  label: string;
  options: string[];
  onLabelChange: (label: string) => void;
  onOptionsChange: (options: string[]) => void;
  onRemove?: () => void;
}

const Variant = ({
  label,
  options,
  onLabelChange,
  onOptionsChange,
  onRemove,
}: VariantProps) => {
  const addOption = () => {
    onOptionsChange([...options, ""]);
  };

  const updateOption = (index: number, value: string) => {
    onOptionsChange(options.map((opt, i) => (i === index ? value : opt)));
  };

  const removeOption = (index: number) => {
    if (options.length === 1) return;
    onOptionsChange(options.filter((_, i) => i !== index));
  };

  return (
    <ProductVariantBox>
      <ProductVariantItem>
        <div>
          <h3>Attribute</h3>
          <input
            type="text"
            placeholder="attribute name..."
            value={label}
            onChange={(e) => onLabelChange(e.target.value)}
          />
        </div>

        <div>
          <h3>Options</h3>
          <FlexBox $gap={10}>
            {options.map((opt, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={opt}
                  placeholder={`Option ${index + 1}`}
                  onChange={(e) => updateOption(index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  aria-label={`Remove option ${index + 1}`}
                >
                  <RiCloseLine />
                </button>
              </div>
            ))}
          </FlexBox>
        </div>

        <StyledFormBtn
          $variant="text"
          type="button"
          $color="#797676"
          onClick={addOption}
        >
          + Add option
        </StyledFormBtn>
      </ProductVariantItem>

      {onRemove && (
        <StyledFormBtn
          $variant="text"
          $color="red"
          $size="24px"
          type="button"
          onClick={onRemove}
          aria-label="Remove variant"
        >
          <MdDeleteOutline />
        </StyledFormBtn>
      )}
    </ProductVariantBox>
  );
};

export default Variant;

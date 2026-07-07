// src/components/user/variantTable.tsx
"use client";
import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import { VariantTableWrap } from "./products.styles";

interface VariantTableProps {
  attributeLabels: string[]; // e.g. ["Length", "Density"]
  combinations: string[][]; // e.g. [["14\"", "150%"], ["14\"", "180%"], ...]
  variantRows: Record<
    string,
    { stock: string; priceOverride: string; sku: string }
  >;
  onVariantRowsChange: (
    rows: Record<string, { stock: string; priceOverride: string; sku: string }>,
  ) => void;
  allowDelete: boolean;
}

const VariantTable = ({
  attributeLabels,
  combinations,
  variantRows,
  onVariantRowsChange,
  allowDelete,
}: VariantTableProps) => {
  const keyFor = (combo: string[]) => combo.join(" / ");

  const updateRow = (
    key: string,
    field: "stock" | "priceOverride" | "sku",
    value: string,
  ) => {
    onVariantRowsChange({
      ...variantRows,
      [key]: {
        stock: variantRows[key]?.stock ?? "",
        priceOverride: variantRows[key]?.priceOverride ?? "",
        sku: variantRows[key]?.sku ?? "",
        [field]: value,
      },
    });
  };

  const deleteRow = (key: string) => {
    const next = { ...variantRows };
    delete next[key];
    onVariantRowsChange(next);
  };

  return (
    <VariantTableWrap>
      <table>
        <thead>
          <tr>
            <th>Variant Label</th>
            <th>Stock Qty</th>
            <th>Price Override</th>
            <th>SKU</th>
            {allowDelete && <th></th>}
          </tr>
        </thead>
        <tbody>
          {combinations.map((combo) => {
            const key = keyFor(combo);
            const row = variantRows[key];
            return (
              <tr key={key}>
                <td>{combo.join(" / ")}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={row?.stock ?? ""}
                    onChange={(e) => updateRow(key, "stock", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="defaults to base price"
                    value={row?.priceOverride ?? ""}
                    onChange={(e) =>
                      updateRow(key, "priceOverride", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="SKU"
                    value={row?.sku ?? ""}
                    onChange={(e) => updateRow(key, "sku", e.target.value)}
                  />
                </td>
                {allowDelete && (
                  <td>
                    <button
                      type="button"
                      onClick={() => deleteRow(key)}
                      aria-label={`Remove variant ${combo.join(" / ")}`}
                    >
                      <MdDeleteOutline />
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </VariantTableWrap>
  );
};

export default VariantTable;

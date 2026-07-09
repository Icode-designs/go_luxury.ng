"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { AdminInventoryRow } from "@/lib/inventory/getInventoryForAdmin";
import { LOW_STOCK_THRESHOLD } from "@/lib/inventory/constants";
import {
  RowThumb,
  ProductNameCell,
  StockBadge,
  StockEditRow,
  InlineNote,
} from "./inventory.styles";

// Writes directly from the browser client, same pattern as the order-status
// and review-moderation admin forms — enforced by the "Admins manage
// products" RLS policy (is_admin()), not by this component.
interface InventoryRowProps {
  product: AdminInventoryRow;
}

function stockLevel(stockCount: number): "ok" | "low" | "out" {
  if (stockCount <= 0) return "out";
  if (stockCount <= LOW_STOCK_THRESHOLD) return "low";
  return "ok";
}

const InventoryRow = ({ product }: InventoryRowProps) => {
  const [value, setValue] = useState(String(product.stockCount));
  const [isSaving, setIsSaving] = useState(false);
  const [note, setNote] = useState<{ text: string; variant: "error" | "success" } | null>(
    null,
  );
  const router = useRouter();

  const numericValue = Number(value);
  const isValid = value.trim() !== "" && Number.isInteger(numericValue) && numericValue >= 0;
  const isDirty = isValid && numericValue !== product.stockCount;

  async function handleSave() {
    if (!isDirty) return;
    setIsSaving(true);
    setNote(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ stock_count: numericValue })
      .eq("id", product.id);

    setIsSaving(false);

    if (error) {
      console.error("[InventoryRow] stock update error:", error.message);
      setNote({ text: "Failed to save.", variant: "error" });
      return;
    }

    setNote({ text: "Saved.", variant: "success" });
    router.refresh();
  }

  return (
    <tr>
      <td>
        <ProductNameCell>
          <RowThumb>
            {product.primaryImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.primaryImageUrl} alt={product.name} />
            ) : (
              <div className="placeholder" />
            )}
          </RowThumb>
          <Link href={`/admin/products/edit-product/${product.id}`}>
            {product.name}
          </Link>
        </ProductNameCell>
      </td>
      <td>{product.sku ?? "—"}</td>
      <td>{product.category ?? "—"}</td>
      <td>
        <StockBadge $level={stockLevel(product.stockCount)}>
          {product.stockCount === 0 ? "Out of stock" : product.stockCount}
        </StockBadge>
      </td>
      <td>
        <StockEditRow>
          <input
            type="number"
            min={0}
            step={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isSaving}
            aria-label={`Stock quantity for ${product.name}`}
          />
          <button type="button" disabled={!isDirty || isSaving} onClick={handleSave}>
            {isSaving ? "Saving…" : "Save"}
          </button>
          {note && <InlineNote $variant={note.variant}>{note.text}</InlineNote>}
        </StockEditRow>
      </td>
    </tr>
  );
};

export default InventoryRow;

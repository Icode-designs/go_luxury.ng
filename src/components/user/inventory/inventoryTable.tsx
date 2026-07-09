"use client";
import { useMemo, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import type { AdminInventoryRow } from "@/lib/inventory/getInventoryForAdmin";
import { LOW_STOCK_THRESHOLD } from "@/lib/inventory/constants";
import { AdminHeaderInputBox } from "../user.styles";
import { ToolbarWrap, FilterPill, TableWrap, EmptyStateBox } from "./inventory.styles";
import InventoryRow from "./inventoryRow";

type StockFilter = "all" | "low" | "out";

interface InventoryTableProps {
  initialProducts: AdminInventoryRow[];
}

const InventoryTable = ({ initialProducts }: InventoryTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return initialProducts.filter((p) => {
      const matchesSearch =
        term.length === 0 ||
        p.name.toLowerCase().includes(term) ||
        (p.sku?.toLowerCase().includes(term) ?? false);
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "out" && p.stockCount === 0) ||
        (stockFilter === "low" &&
          p.stockCount > 0 &&
          p.stockCount <= LOW_STOCK_THRESHOLD);
      return matchesSearch && matchesStock;
    });
  }, [initialProducts, searchTerm, stockFilter]);

  return (
    <div>
      <ToolbarWrap>
        <AdminHeaderInputBox>
          <div>
            <input
              type="text"
              placeholder="Search by name or SKU…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoIosSearch />
          </div>
        </AdminHeaderInputBox>

        <div>
          {(
            [
              { value: "all", label: "All" },
              { value: "low", label: "Low stock" },
              { value: "out", label: "Out of stock" },
            ] as const
          ).map((opt) => (
            <FilterPill
              key={opt.value}
              type="button"
              $active={stockFilter === opt.value}
              onClick={() => setStockFilter(opt.value)}
            >
              {opt.label}
            </FilterPill>
          ))}
        </div>
      </ToolbarWrap>

      {filtered.length === 0 ? (
        <TableWrap>
          <EmptyStateBox>
            {initialProducts.length === 0
              ? "No products yet."
              : "No products match your search/filter."}
          </EmptyStateBox>
        </TableWrap>
      ) : (
        <TableWrap>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Adjust</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <InventoryRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
    </div>
  );
};

export default InventoryTable;

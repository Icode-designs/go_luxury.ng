// src/components/admin/products/ProductsTable.tsx
"use client";
import { useMemo, useState } from "react";
import type { AdminProductRow } from "@/lib/products/getProductsForAdmin";
import { TableWrap } from "./products.styles";
import ProductsToolbar from "./productsToolbar";
import ProductsEmptyState from "./productsEmptyState";
import ProductRow from "./productRow";

interface ProductsTableProps {
  initialProducts: AdminProductRow[];
}

const ProductsTable = ({ initialProducts }: ProductsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft">(
    "all",
  );

  const filtered = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialProducts, searchTerm, statusFilter]);

  return (
    <div>
      <ProductsToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {filtered.length === 0 ? (
        <ProductsEmptyState hasProducts={initialProducts.length > 0} />
      ) : (
        <TableWrap>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Product</th>
                <th>Category</th>
                <th>Variants</th>
                <th>Price</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <ProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
    </div>
  );
};

export default ProductsTable;

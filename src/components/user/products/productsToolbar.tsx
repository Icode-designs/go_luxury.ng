// src/components/admin/products/ProductsToolbar.tsx
"use client";

import { IoIosSearch } from "react-icons/io";
import { AdminHeaderInputBox } from "../user.styles";
import { FilterPill, ToolbarWrap } from "./products.styles";

interface ProductsToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: "all" | "active" | "draft";
  onStatusFilterChange: (value: "all" | "active" | "draft") => void;
}

const ProductsToolbar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ProductsToolbarProps) => {
  return (
    <ToolbarWrap>
      <AdminHeaderInputBox>
        <div>
          <input
            type="text"
            placeholder="Search products…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <IoIosSearch />
        </div>
      </AdminHeaderInputBox>

      <div>
        {(["all", "active", "draft"] as const).map((status) => (
          <FilterPill
            key={status}
            type="button"
            $active={statusFilter === status}
            onClick={() => onStatusFilterChange(status)}
          >
            {status === "all"
              ? "All"
              : status === "active"
                ? "Active"
                : "Draft"}
          </FilterPill>
        ))}
      </div>
    </ToolbarWrap>
  );
};

export default ProductsToolbar;

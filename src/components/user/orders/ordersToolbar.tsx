"use client";
import { IoIosSearch } from "react-icons/io";
import { AdminHeaderInputBox } from "../user.styles";
import { FilterPill, ToolbarWrap } from "./orders.styles";
import type { OrderStatus } from "@/lib/orders/getOrdersForAdmin";

const STATUS_OPTIONS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "refund_requested", label: "Refund requested" },
];

interface OrdersToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: OrderStatus | "all";
  onStatusFilterChange: (value: OrderStatus | "all") => void;
}

const OrdersToolbar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: OrdersToolbarProps) => {
  return (
    <ToolbarWrap>
      <AdminHeaderInputBox>
        <div>
          <input
            type="text"
            placeholder="Search by customer, email, or order ID…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <IoIosSearch />
        </div>
      </AdminHeaderInputBox>

      <div>
        {STATUS_OPTIONS.map((opt) => (
          <FilterPill
            key={opt.value}
            type="button"
            $active={statusFilter === opt.value}
            onClick={() => onStatusFilterChange(opt.value)}
          >
            {opt.label}
          </FilterPill>
        ))}
      </div>
    </ToolbarWrap>
  );
};

export default OrdersToolbar;

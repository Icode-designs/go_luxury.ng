"use client";
import { IoIosSearch } from "react-icons/io";
import { AdminHeaderInputBox } from "../user.styles";
import { FilterPill, ToolbarWrap } from "./returns.styles";
import type { ReturnStatus } from "@/lib/returns/getReturnsForAdmin";

const STATUS_OPTIONS: { value: ReturnStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "requested", label: "Requested" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "refunded", label: "Refunded" },
];

interface ReturnsToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: ReturnStatus | "all";
  onStatusFilterChange: (value: ReturnStatus | "all") => void;
}

const ReturnsToolbar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ReturnsToolbarProps) => {
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

export default ReturnsToolbar;

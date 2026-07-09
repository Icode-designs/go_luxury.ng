"use client";
import { useMemo, useState } from "react";
import type { AdminReturnRow, ReturnStatus } from "@/lib/returns/getReturnsForAdmin";
import { TableWrap, EmptyStateBox } from "./returns.styles";
import ReturnsToolbar from "./returnsToolbar";
import ReturnRow from "./returnRow";

interface ReturnsTableProps {
  initialReturns: AdminReturnRow[];
}

const ReturnsTable = ({ initialReturns }: ReturnsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReturnStatus | "all">("all");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return initialReturns.filter((ret) => {
      const matchesSearch =
        term.length === 0 ||
        ret.id.toLowerCase().includes(term) ||
        ret.orderId.toLowerCase().includes(term) ||
        (ret.customerName?.toLowerCase().includes(term) ?? false) ||
        (ret.customerEmail?.toLowerCase().includes(term) ?? false);
      const matchesStatus = statusFilter === "all" || ret.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialReturns, searchTerm, statusFilter]);

  return (
    <div>
      <ReturnsToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {filtered.length === 0 ? (
        <TableWrap>
          <EmptyStateBox>
            {initialReturns.length === 0
              ? "No return requests yet."
              : "No returns match your search/filter."}
          </EmptyStateBox>
        </TableWrap>
      ) : (
        <TableWrap>
          <table>
            <thead>
              <tr>
                <th>Return</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Reason</th>
                <th>Items</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((ret) => (
                <ReturnRow key={ret.id} ret={ret} />
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
    </div>
  );
};

export default ReturnsTable;

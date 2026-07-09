"use client";
import { useMemo, useState } from "react";
import type { AdminOrderRow, OrderStatus } from "@/lib/orders/getOrdersForAdmin";
import { TableWrap, EmptyStateBox } from "./orders.styles";
import OrdersToolbar from "./ordersToolbar";
import OrderRow from "./orderRow";

interface OrdersTableProps {
  initialOrders: AdminOrderRow[];
}

const OrdersTable = ({ initialOrders }: OrdersTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return initialOrders.filter((order) => {
      const matchesSearch =
        term.length === 0 ||
        order.id.toLowerCase().includes(term) ||
        (order.customerName?.toLowerCase().includes(term) ?? false) ||
        (order.customerEmail?.toLowerCase().includes(term) ?? false);
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialOrders, searchTerm, statusFilter]);

  return (
    <div>
      <OrdersToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {filtered.length === 0 ? (
        <TableWrap>
          <EmptyStateBox>
            {initialOrders.length === 0
              ? "No orders yet."
              : "No orders match your search/filter."}
          </EmptyStateBox>
        </TableWrap>
      ) : (
        <TableWrap>
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
    </div>
  );
};

export default OrdersTable;

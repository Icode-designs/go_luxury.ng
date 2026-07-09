"use client";
import Link from "next/link";
import type { AdminOrderRow } from "@/lib/orders/getOrdersForAdmin";
import { OrderStatusPill } from "./orders.styles";

interface OrderRowProps {
  order: AdminOrderRow;
}

function formatStatusLabel(status: AdminOrderRow["status"]): string {
  return status.replace("_", " ");
}

const OrderRow = ({ order }: OrderRowProps) => {
  const createdDate = new Date(order.createdAt).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <tr>
      <td>
        <Link href={`/admin/orders/${order.id}`}>
          {order.id.slice(0, 8).toUpperCase()}
        </Link>
      </td>
      <td>{order.customerName ?? "Guest"}</td>
      <td>{order.customerEmail ?? "—"}</td>
      <td>{createdDate}</td>
      <td>
        {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
      </td>
      <td>
        {order.currency} {order.total.toLocaleString()}
      </td>
      <td>
        <OrderStatusPill $status={order.status}>
          {formatStatusLabel(order.status)}
        </OrderStatusPill>
      </td>
    </tr>
  );
};

export default OrderRow;

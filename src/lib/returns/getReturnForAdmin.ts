// src/lib/returns/getReturnForAdmin.ts
//
// Admin single return-request detail. Same RLS-respecting server client
// convention as getReturnsForAdmin.ts / getOrderForAdmin.ts.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ReturnReason } from "@/lib/validation/returns";
import type { ReturnStatus } from "./getReturnsForAdmin";

export interface AdminReturnDetail {
  id: string;
  orderId: string;
  reason: ReturnReason;
  detail: string | null;
  status: ReturnStatus;
  adminNotes: string | null;
  refundAmount: number | null;
  createdAt: string;
  resolvedAt: string | null;
  order: {
    currency: string;
    total: number;
    status: string;
  } | null;
  customer: {
    id: string;
    fullName: string | null;
    email: string;
    phone: string | null;
  } | null;
  items: {
    orderItemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }[];
}

interface RawReturn {
  id: string;
  order_id: string;
  reason: ReturnReason;
  detail: string | null;
  status: ReturnStatus;
  admin_notes: string | null;
  refund_amount: number | null;
  created_at: string;
  resolved_at: string | null;
  orders: { currency: string; total: number; status: string } | null;
  customers: {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
  } | null;
  return_items: {
    order_item_id: string;
    quantity: number;
    order_items: {
      unit_price: number;
      products: { name: string } | null;
    } | null;
  }[];
}

export async function getReturnForAdmin(
  returnId: string,
): Promise<AdminReturnDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("returns")
    .select(
      "id, order_id, reason, detail, status, admin_notes, refund_amount, created_at, resolved_at, " +
        "orders ( currency, total, status ), " +
        "customers ( id, full_name, email, phone ), " +
        "return_items ( order_item_id, quantity, order_items ( unit_price, products ( name ) ) )",
    )
    .eq("id", returnId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[getReturnForAdmin] fetch error:", error.message);
    return null;
  }

  const raw = data as unknown as RawReturn;

  return {
    id: raw.id,
    orderId: raw.order_id,
    reason: raw.reason,
    detail: raw.detail,
    status: raw.status,
    adminNotes: raw.admin_notes,
    refundAmount: raw.refund_amount,
    createdAt: raw.created_at,
    resolvedAt: raw.resolved_at,
    order: raw.orders
      ? {
          currency: raw.orders.currency,
          total: raw.orders.total,
          status: raw.orders.status,
        }
      : null,
    customer: raw.customers
      ? {
          id: raw.customers.id,
          fullName: raw.customers.full_name,
          email: raw.customers.email,
          phone: raw.customers.phone,
        }
      : null,
    items: raw.return_items.map((ri) => ({
      orderItemId: ri.order_item_id,
      name: ri.order_items?.products?.name ?? "Product",
      quantity: ri.quantity,
      unitPrice: ri.order_items?.unit_price ?? 0,
    })),
  };
}

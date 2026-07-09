// src/lib/orders/getOrdersForAdmin.ts
//
// Admin order list. Uses the RLS-respecting server client (not the
// service-role client) — the same pattern as getProductsForAdmin.ts. This
// is safe here because the "Admins manage all orders" / "...order items"
// RLS policies already grant admins full access via is_admin(), and this
// route is behind the /admin proxy (see proxy.ts) which has already
// verified the session belongs to an admin.
import "server-only";
import { createClient } from "@/lib/supabase/server";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "refund_requested";

export interface AdminOrderRow {
  id: string;
  status: OrderStatus;
  currency: string;
  total: number;
  itemCount: number;
  createdAt: string;
  customerName: string | null;
  customerEmail: string | null;
}

interface RawAdminOrderRow {
  id: string;
  status: OrderStatus;
  currency: string;
  total: number;
  created_at: string;
  customers: { full_name: string | null; email: string } | { full_name: string | null; email: string }[] | null;
  order_items: { quantity: number }[] | null;
}

export async function getOrdersForAdmin(): Promise<AdminOrderRow[]> {
  const supabase = await createClient();

  const result = await supabase
    .from("orders")
    .select(
      "id, status, currency, total, created_at, customers ( full_name, email ), order_items ( quantity )",
    )
    .order("created_at", { ascending: false });

  const data = result.data as unknown as RawAdminOrderRow[] | null;
  const error = result.error;

  if (error) {
    console.error("[getOrdersForAdmin] fetch error:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const customer = Array.isArray(row.customers)
      ? (row.customers[0] ?? null)
      : row.customers;

    return {
      id: row.id,
      status: row.status,
      currency: row.currency,
      total: row.total,
      itemCount: (row.order_items ?? []).reduce(
        (sum, item) => sum + item.quantity,
        0,
      ),
      createdAt: row.created_at,
      customerName: customer?.full_name ?? null,
      customerEmail: customer?.email ?? null,
    };
  });
}

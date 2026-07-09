// src/lib/returns/getCustomerOrders.ts
//
// Customer-facing order list ("My Orders"). RLS-respecting server client —
// the "Customers view their own orders" policy scopes rows to
// auth.uid() automatically, same convention as getProductReviews.ts.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/orders/getOrdersForAdmin";

export interface CustomerOrderRow {
  id: string;
  status: OrderStatus;
  currency: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

interface RawRow {
  id: string;
  status: OrderStatus;
  currency: string;
  total: number;
  created_at: string;
  order_items: { quantity: number }[] | null;
}

export async function getCustomerOrders(): Promise<CustomerOrderRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("id, status, currency, total, created_at, order_items ( quantity )")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getCustomerOrders] fetch error:", error.message);
    return [];
  }

  const rows = (data ?? []) as unknown as RawRow[];

  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    currency: row.currency,
    total: row.total,
    itemCount: (row.order_items ?? []).reduce((sum, i) => sum + i.quantity, 0),
    createdAt: row.created_at,
  }));
}

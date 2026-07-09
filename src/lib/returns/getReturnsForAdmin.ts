// src/lib/returns/getReturnsForAdmin.ts
//
// Admin return-request list. Uses the RLS-respecting server client (not the
// service-role client) — the "Admins manage returns" ALL is_admin() policy
// already grants admins full access, and this route is behind the /admin
// proxy (see proxy.ts), same convention as getOrdersForAdmin.ts.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ReturnReason } from "@/lib/validation/returns";

export type ReturnStatus = "requested" | "approved" | "rejected" | "refunded";

export interface AdminReturnRow {
  id: string;
  orderId: string;
  reason: ReturnReason;
  status: ReturnStatus;
  itemCount: number;
  refundAmount: number | null;
  createdAt: string;
  customerName: string | null;
  customerEmail: string | null;
}

interface RawRow {
  id: string;
  order_id: string;
  reason: ReturnReason;
  status: ReturnStatus;
  refund_amount: number | null;
  created_at: string;
  customers: { full_name: string | null; email: string } | { full_name: string | null; email: string }[] | null;
  return_items: { quantity: number }[] | null;
}

export async function getReturnsForAdmin(): Promise<AdminReturnRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("returns")
    .select(
      "id, order_id, reason, status, refund_amount, created_at, customers ( full_name, email ), return_items ( quantity )",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getReturnsForAdmin] fetch error:", error.message);
    return [];
  }

  const rows = (data ?? []) as unknown as RawRow[];

  return rows.map((row) => {
    const customer = Array.isArray(row.customers)
      ? (row.customers[0] ?? null)
      : row.customers;

    return {
      id: row.id,
      orderId: row.order_id,
      reason: row.reason,
      status: row.status,
      itemCount: (row.return_items ?? []).reduce(
        (sum, item) => sum + item.quantity,
        0,
      ),
      refundAmount: row.refund_amount,
      createdAt: row.created_at,
      customerName: customer?.full_name ?? null,
      customerEmail: customer?.email ?? null,
    };
  });
}

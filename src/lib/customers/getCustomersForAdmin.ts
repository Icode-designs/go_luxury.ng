// src/lib/customers/getCustomersForAdmin.ts
//
// Admin customer list with order aggregates. Uses the RLS-respecting
// server client — "Admins view all customers" ALL is_admin() policy grants
// full access.
import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface AdminCustomerRow {
  id: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  createdAt: string;
  /** True when this customer has no linked auth account yet — e.g. a
   *  guest-checkout row waiting to be claimed by signing up with the same
   *  email (see lib/auth/signup.ts / lib/orders/placeOrder.ts). */
  isGuest: boolean;
  orderCount: number;
  totalOrderValue: number;
}

interface RawCustomerRow {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  auth_user_id: string | null;
  created_at: string;
  orders: { id: string; total: number }[] | null;
}

export async function getCustomersForAdmin(): Promise<AdminCustomerRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select(
      "id, full_name, email, phone, auth_user_id, created_at, orders ( id, total )",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getCustomersForAdmin] fetch error:", error.message);
    return [];
  }

  const rows = (data ?? []) as unknown as RawCustomerRow[];

  return rows.map((row) => {
    const orders = row.orders ?? [];
    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      createdAt: row.created_at,
      isGuest: row.auth_user_id === null,
      orderCount: orders.length,
      totalOrderValue: orders.reduce((sum, o) => sum + o.total, 0),
    };
  });
}

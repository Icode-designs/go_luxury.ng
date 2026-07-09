// src/lib/dashboard/getDashboardStats.ts
//
// Aggregates the admin dashboard's data. Uses the RLS-respecting server
// client (same convention as getProductsForAdmin.ts / getOrdersForAdmin.ts)
// — every table read here has an "Admins manage X" / "Admins view all X"
// RLS policy granting admins full access via is_admin().
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/orders/getOrdersForAdmin";
import { LOW_STOCK_THRESHOLD } from "@/lib/inventory/constants";

export interface DashboardStats {
  // Deliberately called "order value", not "revenue" — no payment provider
  // is wired up yet, so a 'pending' order hasn't actually been paid for.
  totalOrderValue: number;
  orderStatusCounts: Record<OrderStatus, number>;
  totalCustomers: number;
  totalActiveProducts: number;
  pendingReviewsCount: number;
  pendingReturnsCount: number;
  recentOrders: {
    id: string;
    status: OrderStatus;
    currency: string;
    total: number;
    createdAt: string;
    customerName: string | null;
  }[];
  lowStockProducts: {
    id: string;
    name: string;
    stockCount: number;
  }[];
}

const ALL_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "refund_requested",
];

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [
    ordersResult,
    recentOrdersResult,
    customersCountResult,
    productsCountResult,
    pendingReviewsResult,
    pendingReturnsResult,
    lowStockResult,
  ] = await Promise.all([
    supabase.from("orders").select("status, total"),
    supabase
      .from("orders")
      .select("id, status, currency, total, created_at, customers ( full_name )")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("returns")
      .select("id", { count: "exact", head: true })
      .eq("status", "requested"),
    supabase
      .from("products")
      .select("id, name, stock_count")
      .eq("status", "active")
      .lte("stock_count", LOW_STOCK_THRESHOLD)
      .order("stock_count", { ascending: true })
      .limit(8),
  ]);

  if (ordersResult.error) {
    console.error(
      "[getDashboardStats] orders fetch error:",
      ordersResult.error.message,
    );
  }
  if (recentOrdersResult.error) {
    console.error(
      "[getDashboardStats] recent orders fetch error:",
      recentOrdersResult.error.message,
    );
  }
  if (pendingReviewsResult.error) {
    console.error(
      "[getDashboardStats] pending reviews fetch error:",
      pendingReviewsResult.error.message,
    );
  }
  if (pendingReturnsResult.error) {
    console.error(
      "[getDashboardStats] pending returns fetch error:",
      pendingReturnsResult.error.message,
    );
  }
  if (lowStockResult.error) {
    console.error(
      "[getDashboardStats] low stock fetch error:",
      lowStockResult.error.message,
    );
  }

  const orderStatusCounts = ALL_STATUSES.reduce(
    (acc, status) => ({ ...acc, [status]: 0 }),
    {} as Record<OrderStatus, number>,
  );
  let totalOrderValue = 0;

  for (const row of ordersResult.data ?? []) {
    const status = row.status as OrderStatus;
    if (status in orderStatusCounts) orderStatusCounts[status] += 1;
    totalOrderValue += row.total as number;
  }

  const rawRecentOrders = (recentOrdersResult.data ?? []) as unknown as {
    id: string;
    status: OrderStatus;
    currency: string;
    total: number;
    created_at: string;
    customers: { full_name: string | null } | { full_name: string | null }[] | null;
  }[];

  const recentOrders = rawRecentOrders.map((row) => {
    const customer = Array.isArray(row.customers)
      ? (row.customers[0] ?? null)
      : row.customers;
    return {
      id: row.id,
      status: row.status,
      currency: row.currency,
      total: row.total,
      createdAt: row.created_at,
      customerName: customer?.full_name ?? null,
    };
  });

  const lowStockProducts = (lowStockResult.data ?? []).map((p) => ({
    id: p.id as string,
    name: p.name as string,
    stockCount: p.stock_count as number,
  }));

  return {
    totalOrderValue,
    orderStatusCounts,
    totalCustomers: customersCountResult.count ?? 0,
    totalActiveProducts: productsCountResult.count ?? 0,
    pendingReviewsCount: pendingReviewsResult.count ?? 0,
    pendingReturnsCount: pendingReturnsResult.count ?? 0,
    recentOrders,
    lowStockProducts,
  };
}

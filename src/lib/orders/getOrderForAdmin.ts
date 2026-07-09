// src/lib/orders/getOrderForAdmin.ts
//
// Admin single-order detail. Same RLS-respecting server client pattern as
// getOrdersForAdmin.ts / getProductsForAdmin.ts.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "./getOrdersForAdmin";

export interface AdminOrderDetail {
  id: string;
  status: OrderStatus;
  currency: string;
  shippingCost: number;
  total: number;
  trackingNumber: string | null;
  internalNotes: string | null;
  createdAt: string;
  customer: {
    id: string;
    fullName: string | null;
    email: string;
    phone: string | null;
  } | null;
  address: {
    street: string;
    city: string | null;
    stateRegion: string | null;
    country: string;
    postalCode: string | null;
  } | null;
  items: {
    productId: string | null;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  payments: {
    id: string;
    provider: string;
    status: string;
    amountCharged: number;
    createdAt: string;
  }[];
}

interface RawOrder {
  id: string;
  status: OrderStatus;
  currency: string;
  shipping_cost: number;
  total: number;
  tracking_number: string | null;
  internal_notes: string | null;
  created_at: string;
  customers: {
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
  } | null;
  addresses: {
    street: string;
    city: string | null;
    state_region: string | null;
    country: string;
    postal_code: string | null;
  } | null;
  order_items: {
    product_id: string | null;
    quantity: number;
    unit_price: number;
    products: { name: string } | null;
  }[];
  payments: {
    id: string;
    provider: string;
    status: string;
    amount_charged: number;
    created_at: string;
  }[];
}

export async function getOrderForAdmin(
  orderId: string,
): Promise<AdminOrderDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, status, currency, shipping_cost, total, tracking_number, internal_notes, created_at, customers ( id, full_name, email, phone ), addresses ( street, city, state_region, country, postal_code ), order_items ( product_id, quantity, unit_price, products ( name ) ), payments ( id, provider, status, amount_charged, created_at )",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[getOrderForAdmin] fetch error:", error.message);
    return null;
  }

  const raw = data as unknown as RawOrder;

  return {
    id: raw.id,
    status: raw.status,
    currency: raw.currency,
    shippingCost: raw.shipping_cost,
    total: raw.total,
    trackingNumber: raw.tracking_number,
    internalNotes: raw.internal_notes,
    createdAt: raw.created_at,
    customer: raw.customers
      ? {
          id: raw.customers.id,
          fullName: raw.customers.full_name,
          email: raw.customers.email,
          phone: raw.customers.phone,
        }
      : null,
    address: raw.addresses
      ? {
          street: raw.addresses.street,
          city: raw.addresses.city,
          stateRegion: raw.addresses.state_region,
          country: raw.addresses.country,
          postalCode: raw.addresses.postal_code,
        }
      : null,
    items: (raw.order_items ?? []).map((item) => ({
      productId: item.product_id,
      name: item.products?.name ?? "Product",
      quantity: item.quantity,
      unitPrice: item.unit_price,
      lineTotal: item.unit_price * item.quantity,
    })),
    payments: (raw.payments ?? []).map((p) => ({
      id: p.id,
      provider: p.provider,
      status: p.status,
      amountCharged: p.amount_charged,
      createdAt: p.created_at,
    })),
  };
}

// src/lib/returns/getCustomerOrderById.ts
//
// Customer-facing single order detail, including per-item "how much is
// still returnable" and the order's past/pending return requests. Same
// RLS-respecting server client convention as getCustomerOrders.ts — the
// "Customers view their own orders" / "...order items" / "...returns" /
// "...return items" policies scope everything to auth.uid() automatically.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/orders/getOrdersForAdmin";
import type { ReturnReason } from "@/lib/validation/returns";

export interface CustomerOrderItem {
  orderItemId: string;
  productId: string | null;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  returnableQuantity: number;
}

export interface CustomerOrderReturn {
  id: string;
  reason: ReturnReason;
  detail: string | null;
  status: "requested" | "approved" | "rejected" | "refunded";
  refundAmount: number | null;
  createdAt: string;
  items: { orderItemId: string; name: string; quantity: number }[];
}

export interface CustomerOrderDetail {
  id: string;
  status: OrderStatus;
  currency: string;
  shippingCost: number;
  total: number;
  trackingNumber: string | null;
  createdAt: string;
  address: {
    street: string;
    city: string | null;
    stateRegion: string | null;
    country: string;
    postalCode: string | null;
  } | null;
  items: CustomerOrderItem[];
  returns: CustomerOrderReturn[];
}

export async function getCustomerOrderById(
  orderId: string,
): Promise<CustomerOrderDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, status, currency, shipping_cost, total, tracking_number, created_at, " +
        "addresses ( street, city, state_region, country, postal_code ), " +
        "order_items ( id, product_id, quantity, unit_price, products ( name ) )",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[getCustomerOrderById] fetch error:", error.message);
    return null;
  }

  const raw = data as unknown as {
    id: string;
    status: OrderStatus;
    currency: string;
    shipping_cost: number;
    total: number;
    tracking_number: string | null;
    created_at: string;
    addresses: {
      street: string;
      city: string | null;
      state_region: string | null;
      country: string;
      postal_code: string | null;
    } | null;
    order_items: {
      id: string;
      product_id: string | null;
      quantity: number;
      unit_price: number;
      products: { name: string } | null;
    }[];
  };

  const { data: returnsData, error: returnsError } = await supabase
    .from("returns")
    .select(
      "id, reason, detail, status, refund_amount, created_at, " +
        "return_items ( order_item_id, quantity, order_items ( products ( name ) ) )",
    )
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  if (returnsError) {
    console.error(
      "[getCustomerOrderById] returns fetch error:",
      returnsError.message,
    );
  }

  const rawReturns = (returnsData ?? []) as unknown as {
    id: string;
    reason: ReturnReason;
    detail: string | null;
    status: "requested" | "approved" | "rejected" | "refunded";
    refund_amount: number | null;
    created_at: string;
    return_items: {
      order_item_id: string;
      quantity: number;
      order_items: { products: { name: string } | null } | null;
    }[];
  }[];

  // Sum non-rejected return quantities per order_item, so each item's card
  // can show how much of it is still eligible to return.
  const requestedByItem = new Map<string, number>();
  for (const ret of rawReturns) {
    if (ret.status === "rejected") continue;
    for (const ri of ret.return_items) {
      requestedByItem.set(
        ri.order_item_id,
        (requestedByItem.get(ri.order_item_id) ?? 0) + ri.quantity,
      );
    }
  }

  const items: CustomerOrderItem[] = raw.order_items.map((item) => {
    const alreadyRequested = requestedByItem.get(item.id) ?? 0;
    return {
      orderItemId: item.id,
      productId: item.product_id,
      name: item.products?.name ?? "Product",
      quantity: item.quantity,
      unitPrice: item.unit_price,
      lineTotal: item.unit_price * item.quantity,
      returnableQuantity: Math.max(0, item.quantity - alreadyRequested),
    };
  });

  const returns: CustomerOrderReturn[] = rawReturns.map((ret) => ({
    id: ret.id,
    reason: ret.reason,
    detail: ret.detail,
    status: ret.status,
    refundAmount: ret.refund_amount,
    createdAt: ret.created_at,
    items: ret.return_items.map((ri) => ({
      orderItemId: ri.order_item_id,
      name: ri.order_items?.products?.name ?? "Product",
      quantity: ri.quantity,
    })),
  }));

  return {
    id: raw.id,
    status: raw.status,
    currency: raw.currency,
    shippingCost: raw.shipping_cost,
    total: raw.total,
    trackingNumber: raw.tracking_number,
    createdAt: raw.created_at,
    address: raw.addresses
      ? {
          street: raw.addresses.street,
          city: raw.addresses.city,
          stateRegion: raw.addresses.state_region,
          country: raw.addresses.country,
          postalCode: raw.addresses.postal_code,
        }
      : null,
    items,
    returns,
  };
}

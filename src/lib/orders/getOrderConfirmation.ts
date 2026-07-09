/**
 * lib/orders/getOrderConfirmation.ts
 *
 * Fetches an order for the post-checkout confirmation page.
 *
 * SECURITY MODEL — unguessable-id-as-capability-token:
 * Guests have no session, so this can't rely on RLS/auth to gate access.
 * The order id is a crypto-random UUID (gen_random_uuid(), 122 bits) —
 * knowing it is treated as proof of "this is the order you just placed",
 * the same model used by countless real checkout confirmation/tracking
 * pages. This is a deliberate, documented trade-off, not an oversight.
 *
 * The one extra check this function DOES apply: if the viewer is logged in
 * as a customer who is NOT the order's owner (and not an admin), access is
 * denied. This closes the one realistic gap the capability-token model
 * leaves open — an authenticated *other* customer poking at order URLs —
 * without breaking guest access to their own freshly-placed order.
 */
import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export interface OrderConfirmationItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderConfirmation {
  id: string;
  status: string;
  currency: string;
  shippingCost: number;
  total: number;
  createdAt: string;
  address: {
    street: string;
    city: string | null;
    stateRegion: string | null;
    country: string;
    postalCode: string | null;
  };
  items: OrderConfirmationItem[];
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getOrderConfirmation(
  orderId: string,
): Promise<OrderConfirmation | null> {
  if (!UUID_PATTERN.test(orderId)) return null;

  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "id, customer_id, status, currency, shipping_cost, total, created_at, addresses ( street, city, state_region, country, postal_code ), order_items ( product_id, quantity, unit_price, products ( name ) )",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error || !order) {
    if (error) console.error("[getOrderConfirmation] fetch error:", error.message);
    return null;
  }

  // Ownership check for authenticated non-owners (see doc comment above).
  const user = await getCurrentUser();
  if (user?.role === "customer" && user.customer?.id !== order.customer_id) {
    return null;
  }

  const rawOrder = order as unknown as {
    id: string;
    status: string;
    currency: string;
    shipping_cost: number;
    total: number;
    created_at: string;
    addresses: {
      street: string;
      city: string | null;
      state_region: string | null;
      country: string;
      postal_code: string | null;
    } | null;
    order_items: {
      product_id: string;
      quantity: number;
      unit_price: number;
      products: { name: string } | null;
    }[];
  };

  return {
    id: rawOrder.id,
    status: rawOrder.status,
    currency: rawOrder.currency,
    shippingCost: rawOrder.shipping_cost,
    total: rawOrder.total,
    createdAt: rawOrder.created_at,
    address: {
      street: rawOrder.addresses?.street ?? "",
      city: rawOrder.addresses?.city ?? null,
      stateRegion: rawOrder.addresses?.state_region ?? null,
      country: rawOrder.addresses?.country ?? "",
      postalCode: rawOrder.addresses?.postal_code ?? null,
    },
    items: rawOrder.order_items.map((item) => ({
      productId: item.product_id,
      name: item.products?.name ?? "Product",
      quantity: item.quantity,
      unitPrice: item.unit_price,
      lineTotal: item.unit_price * item.quantity,
    })),
  };
}

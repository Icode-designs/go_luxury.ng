/**
 * lib/cart/getCart.ts
 *
 * Server-side cart read. Uses the service-role client so guest carts
 * (scoped by session_id, which the anon-key RLS policy has no concept of)
 * and logged-in carts (scoped by customer_id) share one code path —
 * ownership is enforced here in application code via resolveCartOwnerReadOnly(),
 * not by RLS.
 */
import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveCartOwnerReadOnly, type CartOwner } from "./cartOwner";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  primaryImageUrl: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  stockCount: number;
  isActive: boolean;
  /** True when quantity in cart exceeds current stock, or the product was
   *  deactivated/archived since it was added — surfaced so the cart page
   *  can warn the shopper before checkout instead of failing silently. */
  needsAttention: boolean;
}

export interface CartSummary {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

const EMPTY_CART: CartSummary = { items: [], itemCount: 0, subtotal: 0 };

interface RawCartRow {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    base_price: number;
    discounted_price: number | null;
    stock_count: number;
    status: string;
    product_images: { url: string; is_primary: boolean }[] | null;
  } | null;
}

function ownerFilterColumn(owner: CartOwner): { column: string; value: string } | null {
  if (owner.type === "customer") return { column: "customer_id", value: owner.customerId };
  if (owner.type === "guest") return { column: "session_id", value: owner.sessionId };
  return null;
}

export async function getCart(): Promise<CartSummary> {
  const owner = await resolveCartOwnerReadOnly();
  const filter = ownerFilterColumn(owner);
  if (!filter) return EMPTY_CART;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cart_items")
    .select(
      "id, quantity, products ( id, name, base_price, discounted_price, stock_count, status, product_images ( url, is_primary ) )",
    )
    .eq(filter.column, filter.value)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[getCart] fetch error:", error.message);
    return EMPTY_CART;
  }

  const rows = (data ?? []) as unknown as RawCartRow[];

  const items: CartItem[] = rows
    // A cart row whose product was hard-deleted would come back with
    // products: null — drop it defensively rather than crash the page.
    .filter((row): row is RawCartRow & { products: NonNullable<RawCartRow["products"]> } =>
      row.products !== null,
    )
    .map((row) => {
      const product = row.products;
      const unitPrice = product.discounted_price ?? product.base_price;
      const primary =
        product.product_images?.find((img) => img.is_primary) ??
        product.product_images?.[0] ??
        null;
      const isActive = product.status === "active";
      const needsAttention = !isActive || row.quantity > product.stock_count;

      return {
        id: row.id,
        productId: product.id,
        name: product.name,
        primaryImageUrl: primary?.url ?? null,
        unitPrice,
        quantity: row.quantity,
        lineTotal: unitPrice * row.quantity,
        stockCount: product.stock_count,
        isActive,
        needsAttention,
      };
    });

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return { items, itemCount, subtotal };
}

/** Lightweight count-only read for the header badge — avoids joining
 *  product rows on every single page load across the site. */
export async function getCartItemCount(): Promise<number> {
  const owner = await resolveCartOwnerReadOnly();
  const filter = ownerFilterColumn(owner);
  if (!filter) return 0;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq(filter.column, filter.value);

  if (error) {
    console.error("[getCartItemCount] fetch error:", error.message);
    return 0;
  }

  return (data ?? []).reduce((sum, row) => sum + (row.quantity as number), 0);
}

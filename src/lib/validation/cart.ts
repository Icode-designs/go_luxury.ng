/**
 * lib/validation/cart.ts
 * Shared Zod schemas for cart Server Actions. Re-validated server-side
 * regardless of what the client sends.
 */
import { z } from "zod";

const uuidSchema = z.string().uuid("Invalid id");

// A single cart line is capped at 20 units — generous for a hair/beauty
// storefront, low enough to make automated stock-draining noticeably harder.
export const MAX_CART_QUANTITY = 20;

export const addToCartSchema = z.object({
  productId: uuidSchema,
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(MAX_CART_QUANTITY, `Quantity cannot exceed ${MAX_CART_QUANTITY}`),
});

export const updateCartItemSchema = z.object({
  cartItemId: uuidSchema,
  // 0 is allowed here and treated as "remove this line".
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative")
    .max(MAX_CART_QUANTITY, `Quantity cannot exceed ${MAX_CART_QUANTITY}`),
});

export const removeCartItemSchema = z.object({
  cartItemId: uuidSchema,
});

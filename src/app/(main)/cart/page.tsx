import type { Metadata } from "next";
import { getCart } from "@/lib/cart/getCart";
import CartContent from "@/components/cart/cartContent";
import { CartSection } from "@/components/cart/cart.styles";

export const metadata: Metadata = {
  title: "Your Cart",
  // Cart contents are per-shopper and have no evergreen search value.
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const cart = await getCart();

  return (
    <CartSection>
      <CartContent initialCart={cart} />
    </CartSection>
  );
}

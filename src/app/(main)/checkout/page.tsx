import type { Metadata } from "next";
import Link from "next/link";
import { getCart } from "@/lib/cart/getCart";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getDefaultAddress } from "@/lib/orders/getDefaultAddress";
import CheckoutForm from "@/components/checkout/checkoutForm";
import {
  CheckoutSection,
  CheckoutContainer,
  CheckoutHeaderRow,
} from "@/components/checkout/checkout.styles";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const [cart, user] = await Promise.all([getCart(), getCurrentUser()]);

  if (cart.items.length === 0) {
    return (
      <CheckoutSection>
        <CheckoutContainer>
          <CheckoutHeaderRow>
            <h1>Checkout</h1>
          </CheckoutHeaderRow>
          <p>
            Your cart is empty. <Link href="/shop">Continue shopping</Link>.
          </p>
        </CheckoutContainer>
      </CheckoutSection>
    );
  }

  const isCustomer = user?.role === "customer" && Boolean(user.customer);
  const defaultAddress =
    isCustomer && user?.customer ? await getDefaultAddress(user.customer.id) : null;

  return (
    <CheckoutSection>
      <CheckoutContainer>
        <CheckoutHeaderRow>
          <h1>Checkout</h1>
        </CheckoutHeaderRow>

        <CheckoutForm
          isGuest={!isCustomer}
          defaultAddress={defaultAddress}
          cart={cart}
        />
      </CheckoutContainer>
    </CheckoutSection>
  );
}

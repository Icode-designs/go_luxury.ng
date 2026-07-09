import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderConfirmation } from "@/lib/orders/getOrderConfirmation";
import {
  CheckoutSection,
  CheckoutContainer,
  CheckoutHeaderRow,
  StubPaymentNotice,
  OrderSummaryItemRow,
} from "@/components/checkout/checkout.styles";
import { CartSummaryBox, SummaryRow } from "@/components/cart/cart.styles";
import { StyledButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

interface OrderConfirmationPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { orderId } = await params;
  const order = await getOrderConfirmation(orderId);

  if (!order) {
    notFound();
  }

  return (
    <CheckoutSection>
      <CheckoutContainer>
        <CheckoutHeaderRow>
          <h1>Thank you for your order</h1>
          <p style={{ fontSize: 13, color: "#5F5E5E", marginTop: 8 }}>
            Order reference: {order.id.slice(0, 8).toUpperCase()}
          </p>
        </CheckoutHeaderRow>

        <CartSummaryBox style={{ maxWidth: 480 }}>
          <h2>Order Summary</h2>
          {order.items.map((item) => (
            <OrderSummaryItemRow key={item.productId}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>
                {"₦"}
                {item.lineTotal.toLocaleString()}
              </span>
            </OrderSummaryItemRow>
          ))}
          <SummaryRow>
            <span>Shipping</span>
            <span>To be confirmed</span>
          </SummaryRow>
          <SummaryRow className="total">
            <span>Total</span>
            <span>
              {"₦"}
              {order.total.toLocaleString()}
            </span>
          </SummaryRow>

          <div>
            <h2 style={{ fontSize: 14, marginBottom: 8 }}>Shipping to</h2>
            <p style={{ fontSize: 13, color: "#5F5E5E" }}>
              {order.address.street}
              {order.address.city ? `, ${order.address.city}` : ""}
              {order.address.stateRegion ? `, ${order.address.stateRegion}` : ""}
              {`, ${order.address.country}`}
              {order.address.postalCode ? ` ${order.address.postalCode}` : ""}
            </p>
          </div>

          <StubPaymentNotice>
            Your order has been recorded (status: {order.status}). Online
            payment isn&apos;t set up yet — our team will reach out to
            arrange payment. You have not been charged.
          </StubPaymentNotice>

          <StyledButton
            as={Link}
            href="/shop"
            $variant="filled-dark"
            style={{ width: "100%", maxWidth: "none" }}
          >
            Continue shopping
          </StyledButton>
        </CartSummaryBox>
      </CheckoutContainer>
    </CheckoutSection>
  );
}

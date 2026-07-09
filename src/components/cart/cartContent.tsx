"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoBagHandleOutline } from "react-icons/io5";
import type { CartSummary } from "@/lib/cart/getCart";
import {
  updateCartItemAction,
  removeCartItemAction,
} from "@/lib/cart/cartActions";
import { StyledButton } from "@/components/ui/button";
import {
  CartContainer,
  CartHeaderRow,
  CartLayout,
  CartItemsList,
  CartItemRow,
  CartItemImageBox,
  CartItemInfo,
  CartItemAttentionNote,
  CartItemControlsRow,
  QuantityStepper,
  LineTotalText,
  RemoveLineButton,
  CartSummaryBox,
  SummaryRow,
  EmptyCartBox,
  CartErrorNote,
} from "./cart.styles";

interface CartContentProps {
  initialCart: CartSummary;
}

const CartContent = ({ initialCart }: CartContentProps) => {
  const [cart, setCart] = useState(initialCart);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleQuantityChange(cartItemId: string, nextQuantity: number) {
    setError(null);
    setPendingId(cartItemId);

    // Optimistic update — reconciled with the server result once it returns.
    setCart((prev) => {
      if (nextQuantity <= 0) {
        const items = prev.items.filter((i) => i.id !== cartItemId);
        return {
          items,
          itemCount: items.reduce((s, i) => s + i.quantity, 0),
          subtotal: items.reduce((s, i) => s + i.lineTotal, 0),
        };
      }
      const items = prev.items.map((i) =>
        i.id === cartItemId
          ? { ...i, quantity: nextQuantity, lineTotal: i.unitPrice * nextQuantity }
          : i,
      );
      return {
        items,
        itemCount: items.reduce((s, i) => s + i.quantity, 0),
        subtotal: items.reduce((s, i) => s + i.lineTotal, 0),
      };
    });

    startTransition(async () => {
      const result = await updateCartItemAction(cartItemId, nextQuantity);
      if (!result.ok) {
        setError(result.message);
      }
      router.refresh();
      setPendingId(null);
    });
  }

  function handleRemove(cartItemId: string) {
    setError(null);
    setPendingId(cartItemId);
    setCart((prev) => {
      const items = prev.items.filter((i) => i.id !== cartItemId);
      return {
        items,
        itemCount: items.reduce((s, i) => s + i.quantity, 0),
        subtotal: items.reduce((s, i) => s + i.lineTotal, 0),
      };
    });

    startTransition(async () => {
      const result = await removeCartItemAction(cartItemId);
      if (!result.ok) {
        setError(result.message);
      }
      router.refresh();
      setPendingId(null);
    });
  }

  const hasBlockingIssue = cart.items.some((item) => item.needsAttention);

  if (cart.items.length === 0) {
    return (
      <CartContainer>
        <EmptyCartBox>
          <IoBagHandleOutline aria-hidden="true" />
          <h2>Your cart is empty</h2>
          <p>Browse the shop to find something you&apos;ll love.</p>
          <StyledButton as={Link} href="/shop" $variant="filled-dark">
            Continue shopping
          </StyledButton>
        </EmptyCartBox>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartHeaderRow>
        <h1>Your Cart</h1>
        <p>
          {cart.itemCount} item{cart.itemCount === 1 ? "" : "s"}
        </p>
      </CartHeaderRow>

      <CartLayout>
        <CartItemsList>
          {cart.items.map((item) => {
            const rowBusy = isPending && pendingId === item.id;
            const maxQty = Math.min(item.stockCount, 20);

            return (
              <CartItemRow key={item.id}>
                <CartItemImageBox>
                  {item.primaryImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.primaryImageUrl} alt={item.name} />
                  ) : null}
                </CartItemImageBox>

                <CartItemInfo>
                  <h3>
                    <Link href={`/product/${item.productId}`}>{item.name}</Link>
                  </h3>
                  <span className="unit-price">
                    {"₦"}
                    {item.unitPrice.toLocaleString()}
                  </span>
                  {item.needsAttention && (
                    <CartItemAttentionNote role="status">
                      {!item.isActive
                        ? "No longer available — please remove this item."
                        : `Only ${item.stockCount} left in stock.`}
                    </CartItemAttentionNote>
                  )}
                </CartItemInfo>

                <CartItemControlsRow>
                  <QuantityStepper>
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={rowBusy}
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={rowBusy || item.quantity >= maxQty}
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </QuantityStepper>
                  <LineTotalText>
                    {"₦"}
                    {item.lineTotal.toLocaleString()}
                  </LineTotalText>
                  <RemoveLineButton
                    type="button"
                    disabled={rowBusy}
                    onClick={() => handleRemove(item.id)}
                  >
                    Remove
                  </RemoveLineButton>
                </CartItemControlsRow>
              </CartItemRow>
            );
          })}
        </CartItemsList>

        <CartSummaryBox>
          <h2>Order Summary</h2>
          <SummaryRow>
            <span>Subtotal</span>
            <span>
              {"₦"}
              {cart.subtotal.toLocaleString()}
            </span>
          </SummaryRow>
          <SummaryRow>
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </SummaryRow>
          <SummaryRow className="total">
            <span>Total</span>
            <span>
              {"₦"}
              {cart.subtotal.toLocaleString()}
            </span>
          </SummaryRow>

          {error && <CartErrorNote role="alert">{error}</CartErrorNote>}
          {hasBlockingIssue && (
            <CartErrorNote role="alert">
              Please resolve the items flagged above before checking out.
            </CartErrorNote>
          )}

          {hasBlockingIssue ? (
            <StyledButton
              type="button"
              disabled
              $variant="filled-dark"
              style={{ width: "100%", maxWidth: "none" }}
            >
              Proceed to Checkout
            </StyledButton>
          ) : (
            <StyledButton
              as={Link}
              href="/checkout"
              $variant="filled-dark"
              style={{ width: "100%", maxWidth: "none" }}
            >
              Proceed to Checkout
            </StyledButton>
          )}
        </CartSummaryBox>
      </CartLayout>
    </CartContainer>
  );
};

export default CartContent;

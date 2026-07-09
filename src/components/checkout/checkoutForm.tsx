"use client";
import { useActionState } from "react";
import { InputBox } from "@/styles/auth.styles";
import { FormError, HoneypotInput, FieldError } from "@/styles/auth-error.styles";
import { StyledButton } from "@/components/ui/button";
import type { CartSummary } from "@/lib/cart/getCart";
import type { SavedAddress } from "@/lib/orders/getDefaultAddress";
import { placeOrderAction, type PlaceOrderState } from "@/lib/orders/placeOrder";
import {
  CheckoutForm as CheckoutFormBox,
  FormFieldsColumn,
  FieldRow,
  StubPaymentNotice,
  OrderSummaryItemRow,
} from "./checkout.styles";
import { CartSummaryBox, SummaryRow } from "@/components/cart/cart.styles";

interface CheckoutFormProps {
  isGuest: boolean;
  defaultAddress: SavedAddress | null;
  cart: CartSummary;
}

const initialState: PlaceOrderState = { status: "idle" };

const CheckoutForm = ({ isGuest, defaultAddress, cart }: CheckoutFormProps) => {
  const [state, formAction, isPending] = useActionState(
    placeOrderAction,
    initialState,
  );

  const fieldErrors = state.status === "error" ? state.fieldErrors : undefined;

  return (
    <CheckoutFormBox action={formAction}>
      <FormFieldsColumn>
        <HoneypotInput
          type="text"
          name="website"
          aria-hidden="true"
          tabIndex={-1}
          autoComplete="off"
        />

        {state.status === "error" && (
          <FormError role="alert">{state.message}</FormError>
        )}

        {isGuest && (
          <fieldset disabled={isPending}>
            <legend>Contact information</legend>
            <InputBox>
              <label htmlFor="fullName">Full name</label>
              <input id="fullName" name="fullName" type="text" required autoComplete="name" />
              {fieldErrors?.fullName && <FieldError>{fieldErrors.fullName[0]}</FieldError>}
            </InputBox>
            <FieldRow>
              <InputBox>
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required autoComplete="email" />
                {fieldErrors?.email && <FieldError>{fieldErrors.email[0]}</FieldError>}
              </InputBox>
              <InputBox>
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" type="tel" required autoComplete="tel" />
                {fieldErrors?.phone && <FieldError>{fieldErrors.phone[0]}</FieldError>}
              </InputBox>
            </FieldRow>
            <p style={{ fontSize: 12, color: "#5F5E5E" }}>
              Already have an account?{" "}
              <a href="/login?returnTo=/checkout">Log in</a> to check out
              faster and track this order.
            </p>
          </fieldset>
        )}

        <fieldset disabled={isPending}>
          <legend>Shipping address</legend>
          <FieldRow>
            <InputBox>
              <label htmlFor="country">Country</label>
              <input
                id="country"
                name="country"
                type="text"
                required
                defaultValue={defaultAddress?.country ?? "Nigeria"}
                autoComplete="country-name"
              />
              {fieldErrors?.country && <FieldError>{fieldErrors.country[0]}</FieldError>}
            </InputBox>
            <InputBox>
              <label htmlFor="stateRegion">State / region</label>
              <input
                id="stateRegion"
                name="stateRegion"
                type="text"
                defaultValue={defaultAddress?.stateRegion ?? ""}
                autoComplete="address-level1"
              />
              {fieldErrors?.stateRegion && (
                <FieldError>{fieldErrors.stateRegion[0]}</FieldError>
              )}
            </InputBox>
          </FieldRow>
          <FieldRow>
            <InputBox>
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                defaultValue={defaultAddress?.city ?? ""}
                autoComplete="address-level2"
              />
              {fieldErrors?.city && <FieldError>{fieldErrors.city[0]}</FieldError>}
            </InputBox>
            <InputBox>
              <label htmlFor="postalCode">Postal code</label>
              <input
                id="postalCode"
                name="postalCode"
                type="text"
                defaultValue={defaultAddress?.postalCode ?? ""}
                autoComplete="postal-code"
              />
              {fieldErrors?.postalCode && (
                <FieldError>{fieldErrors.postalCode[0]}</FieldError>
              )}
            </InputBox>
          </FieldRow>
          <InputBox>
            <label htmlFor="street">Street address</label>
            <input
              id="street"
              name="street"
              type="text"
              required
              defaultValue={defaultAddress?.street ?? ""}
              autoComplete="street-address"
            />
            {fieldErrors?.street && <FieldError>{fieldErrors.street[0]}</FieldError>}
          </InputBox>
        </fieldset>
      </FormFieldsColumn>

      <CartSummaryBox>
        <h2>Order Summary</h2>
        {cart.items.map((item) => (
          <OrderSummaryItemRow key={item.id}>
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
          <span>Subtotal</span>
          <span>
            {"₦"}
            {cart.subtotal.toLocaleString()}
          </span>
        </SummaryRow>
        <SummaryRow>
          <span>Shipping</span>
          <span>To be confirmed</span>
        </SummaryRow>
        <SummaryRow className="total">
          <span>Total</span>
          <span>
            {"₦"}
            {cart.subtotal.toLocaleString()}
          </span>
        </SummaryRow>

        <StubPaymentNotice>
          Online payment isn&apos;t set up yet — placing this order records it
          for our team, and we&apos;ll reach out to arrange payment. You
          won&apos;t be charged automatically.
        </StubPaymentNotice>

        <StyledButton
          type="submit"
          $variant="filled-dark"
          disabled={isPending}
          style={{ width: "100%", maxWidth: "none" }}
        >
          {isPending ? "Placing order…" : "Place Order"}
        </StyledButton>
      </CartSummaryBox>
    </CheckoutFormBox>
  );
};

export default CheckoutForm;

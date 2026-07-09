"use client";
import { useActionState, useState, useTransition } from "react";
import Button from "@/components/ui/button";
import {
  submitReturnRequestAction,
  type SubmitReturnRequestState,
} from "@/lib/returns/submitReturnRequest";
import { RETURN_REASONS, type ReturnReason } from "@/lib/validation/returns";
import type { CustomerOrderItem } from "@/lib/returns/getCustomerOrderById";
import { ReturnForm, ReturnItemPicker, ReturnField } from "./orders.styles";
import { FormError, FieldError } from "@/styles/auth-error.styles";

const REASON_LABELS: Record<ReturnReason, string> = {
  wrong_item: "Wrong item received",
  defective: "Item is defective / damaged",
  not_as_described: "Not as described",
  changed_mind: "Changed my mind",
  other: "Other",
};

interface ReturnRequestFormProps {
  orderId: string;
  items: CustomerOrderItem[];
}

const initialState: SubmitReturnRequestState = { status: "idle" };

const ReturnRequestForm = ({ orderId, items }: ReturnRequestFormProps) => {
  const eligibleItems = items.filter((item) => item.returnableQuantity > 0);

  const [selected, setSelected] = useState<
    Record<string, { checked: boolean; quantity: number }>
  >(() =>
    Object.fromEntries(
      eligibleItems.map((item) => [
        item.orderItemId,
        { checked: false, quantity: 1 },
      ]),
    ),
  );
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(
    submitReturnRequestAction,
    initialState,
  );

  const fieldError = (field: string): string | undefined =>
    state.status === "error" ? state.fieldErrors?.[field]?.[0] : undefined;

  function toggleItem(orderItemId: string) {
    setSelected((prev) => ({
      ...prev,
      [orderItemId]: { ...prev[orderItemId], checked: !prev[orderItemId].checked },
    }));
  }

  function setQuantity(orderItemId: string, quantity: number, max: number) {
    const clamped = Math.max(1, Math.min(quantity, max));
    setSelected((prev) => ({
      ...prev,
      [orderItemId]: { ...prev[orderItemId], quantity: clamped },
    }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const chosenItems = Object.entries(selected)
      .filter(([, v]) => v.checked)
      .map(([orderItemId, v]) => ({ orderItemId, quantity: v.quantity }));

    formData.set("orderId", orderId);
    formData.set("items", JSON.stringify(chosenItems));

    startTransition(() => {
      formAction(formData);
    });
  }

  if (eligibleItems.length === 0) {
    return null;
  }

  if (state.status === "success") {
    return (
      <FormError role="status" style={{ borderColor: "#0F6E56", color: "#0F6E56" }}>
        Your return request has been submitted. We&apos;ll review it and
        follow up by email.
      </FormError>
    );
  }

  return (
    <ReturnForm onSubmit={handleSubmit} noValidate>
      {state.status === "error" && (
        <FormError role="alert">{state.message}</FormError>
      )}

      {/* Honeypot — hidden from real users, catches simple bots */}
      <input
        type="text"
        name="website"
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px" }}
      />

      <div>
        {eligibleItems.map((item) => (
          <ReturnItemPicker key={item.orderItemId}>
            <input
              type="checkbox"
              checked={selected[item.orderItemId]?.checked ?? false}
              onChange={() => toggleItem(item.orderItemId)}
            />
            <div className="item-info">
              {item.name}
              <span>{item.returnableQuantity} eligible for return</span>
            </div>
            {selected[item.orderItemId]?.checked && (
              <input
                type="number"
                min={1}
                max={item.returnableQuantity}
                value={selected[item.orderItemId]?.quantity ?? 1}
                onChange={(e) =>
                  setQuantity(
                    item.orderItemId,
                    Number(e.target.value),
                    item.returnableQuantity,
                  )
                }
              />
            )}
          </ReturnItemPicker>
        ))}
      </div>
      {fieldError("items") && <FieldError>{fieldError("items")}</FieldError>}

      <ReturnField>
        <label htmlFor="return-reason">Reason</label>
        <select id="return-reason" name="reason" required defaultValue="">
          <option value="" disabled>
            Select a reason
          </option>
          {RETURN_REASONS.map((reason) => (
            <option key={reason} value={reason}>
              {REASON_LABELS[reason]}
            </option>
          ))}
        </select>
        {fieldError("reason") && <FieldError>{fieldError("reason")}</FieldError>}
      </ReturnField>

      <ReturnField>
        <label htmlFor="return-detail">Additional details (optional)</label>
        <textarea id="return-detail" name="detail" rows={3} maxLength={1000} />
        {fieldError("detail") && <FieldError>{fieldError("detail")}</FieldError>}
      </ReturnField>

      <Button variant="filled-dark" type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Request return"}
      </Button>
    </ReturnForm>
  );
};

export default ReturnRequestForm;

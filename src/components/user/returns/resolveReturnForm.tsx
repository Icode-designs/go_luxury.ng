"use client";
import { useActionState, useState } from "react";
import {
  resolveReturnAction,
  type ResolveReturnState,
} from "@/lib/returns/resolveReturn";
import { RETURN_RESOLUTION_STATUSES } from "@/lib/validation/returns";
import type { ReturnStatus } from "@/lib/returns/getReturnsForAdmin";
import { ResolveFormRow, InlineNote } from "./returns.styles";

interface ResolveReturnFormProps {
  returnId: string;
  initialStatus: ReturnStatus;
  initialAdminNotes: string | null;
  initialRefundAmount: number | null;
}

const initialState: ResolveReturnState = { status: "idle" };

const ResolveReturnForm = ({
  returnId,
  initialStatus,
  initialAdminNotes,
  initialRefundAmount,
}: ResolveReturnFormProps) => {
  const [status, setStatus] = useState<ReturnStatus>(
    initialStatus === "requested" ? "approved" : initialStatus,
  );
  const [state, formAction, isPending] = useActionState(
    resolveReturnAction,
    initialState,
  );

  const fieldError = (field: string): string | undefined =>
    state.status === "error" ? state.fieldErrors?.[field]?.[0] : undefined;

  return (
    <form action={formAction}>
      <input type="hidden" name="returnId" value={returnId} />
      <ResolveFormRow>
        <div>
          <label htmlFor="returnStatus">Status</label>
          <select
            id="returnStatus"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ReturnStatus)}
            disabled={isPending}
          >
            {RETURN_RESOLUTION_STATUSES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {fieldError("status") && (
            <InlineNote $variant="error">{fieldError("status")}</InlineNote>
          )}
        </div>

        {status === "refunded" && (
          <div>
            <label htmlFor="refundAmount">Refund amount</label>
            <input
              id="refundAmount"
              name="refundAmount"
              type="number"
              min={0}
              step="0.01"
              defaultValue={initialRefundAmount ?? undefined}
              disabled={isPending}
            />
            {fieldError("refundAmount") && (
              <InlineNote $variant="error">{fieldError("refundAmount")}</InlineNote>
            )}
          </div>
        )}

        <div>
          <label htmlFor="adminNotes">Admin notes</label>
          <textarea
            id="adminNotes"
            name="adminNotes"
            rows={3}
            defaultValue={initialAdminNotes ?? ""}
            placeholder="Not visible to the customer"
            disabled={isPending}
          />
          {fieldError("adminNotes") && (
            <InlineNote $variant="error">{fieldError("adminNotes")}</InlineNote>
          )}
        </div>

        {state.status === "error" && (
          <InlineNote $variant="error">{state.message}</InlineNote>
        )}
        {state.status === "success" && (
          <InlineNote $variant="success">Saved.</InlineNote>
        )}

        <button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </ResolveFormRow>
    </form>
  );
};

export default ResolveReturnForm;

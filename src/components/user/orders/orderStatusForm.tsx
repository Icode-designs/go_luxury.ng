"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus } from "@/lib/orders/getOrdersForAdmin";
import { StatusFormRow, InlineNote } from "./orders.styles";

// This writes directly from the browser client rather than through a
// Server Action, mirroring the existing archive/reactivate pattern for
// products (see hook/fetchProduct.ts). It's safe because the actual
// enforcement is the "Admins manage all orders" RLS policy (is_admin()) —
// the anon-key client can only make this write succeed for a session that
// Postgres itself has verified is an admin's. This page is also already
// behind the /admin proxy (see proxy.ts), which is a second, earlier gate.
const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "refund_requested",
];

interface OrderStatusFormProps {
  orderId: string;
  initialStatus: OrderStatus;
  initialTrackingNumber: string | null;
  initialInternalNotes: string | null;
}

const OrderStatusForm = ({
  orderId,
  initialStatus,
  initialTrackingNumber,
  initialInternalNotes,
}: OrderStatusFormProps) => {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [trackingNumber, setTrackingNumber] = useState(
    initialTrackingNumber ?? "",
  );
  const [internalNotes, setInternalNotes] = useState(
    initialInternalNotes ?? "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [note, setNote] = useState<{ text: string; variant: "success" | "error" } | null>(
    null,
  );
  const router = useRouter();

  async function handleSave() {
    setIsSaving(true);
    setNote(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({
        status,
        tracking_number: trackingNumber.trim() || null,
        internal_notes: internalNotes.trim() || null,
      })
      .eq("id", orderId);

    setIsSaving(false);

    if (error) {
      console.error("[OrderStatusForm] update error:", error.message);
      setNote({ text: "Failed to save changes. Please try again.", variant: "error" });
      return;
    }

    setNote({ text: "Saved.", variant: "success" });
    router.refresh();
  }

  return (
    <StatusFormRow>
      <div>
        <label htmlFor="orderStatus">Status</label>
        <select
          id="orderStatus"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          disabled={isSaving}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="trackingNumber">Tracking number</label>
        <input
          id="trackingNumber"
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          disabled={isSaving}
          placeholder="Optional"
        />
      </div>

      <div>
        <label htmlFor="internalNotes">Internal notes</label>
        <textarea
          id="internalNotes"
          rows={3}
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          disabled={isSaving}
          placeholder="Not visible to the customer"
        />
      </div>

      {note && <InlineNote $variant={note.variant}>{note.text}</InlineNote>}

      <button type="button" onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving…" : "Save changes"}
      </button>
    </StatusFormRow>
  );
};

export default OrderStatusForm;

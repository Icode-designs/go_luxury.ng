"use client";
import Link from "next/link";
import type { AdminReturnRow } from "@/lib/returns/getReturnsForAdmin";
import { ReturnStatusPill } from "./returns.styles";

const REASON_LABELS: Record<string, string> = {
  wrong_item: "Wrong item",
  defective: "Defective",
  not_as_described: "Not as described",
  changed_mind: "Changed mind",
  other: "Other",
};

interface ReturnRowProps {
  ret: AdminReturnRow;
}

function formatStatusLabel(status: AdminReturnRow["status"]): string {
  return status;
}

const ReturnRow = ({ ret }: ReturnRowProps) => {
  const createdDate = new Date(ret.createdAt).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <tr>
      <td>
        <Link href={`/admin/returns/${ret.id}`}>
          {ret.id.slice(0, 8).toUpperCase()}
        </Link>
      </td>
      <td>
        <Link href={`/admin/orders/${ret.orderId}`}>
          {ret.orderId.slice(0, 8).toUpperCase()}
        </Link>
      </td>
      <td>{ret.customerName ?? "Guest"}</td>
      <td>{ret.customerEmail ?? "—"}</td>
      <td>{REASON_LABELS[ret.reason] ?? ret.reason}</td>
      <td>
        {ret.itemCount} item{ret.itemCount === 1 ? "" : "s"}
      </td>
      <td>{createdDate}</td>
      <td>
        <ReturnStatusPill $status={ret.status}>
          {formatStatusLabel(ret.status)}
        </ReturnStatusPill>
      </td>
    </tr>
  );
};

export default ReturnRow;

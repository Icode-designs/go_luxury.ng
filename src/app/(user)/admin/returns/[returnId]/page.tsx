import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import { getReturnForAdmin } from "@/lib/returns/getReturnForAdmin";
import ResolveReturnForm from "@/components/user/returns/resolveReturnForm";
import {
  ReturnDetailGrid,
  DetailCard,
  DetailItemsTable,
  ReturnStatusPill,
} from "@/components/user/returns/returns.styles";

interface AdminReturnDetailPageProps {
  params: Promise<{ returnId: string }>;
}

const REASON_LABELS: Record<string, string> = {
  wrong_item: "Wrong item received",
  defective: "Item is defective / damaged",
  not_as_described: "Not as described",
  changed_mind: "Changed mind",
  other: "Other",
};

const page = async ({ params }: AdminReturnDetailPageProps) => {
  const { returnId } = await params;
  const ret = await getReturnForAdmin(returnId);

  if (!ret) {
    notFound();
  }

  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Return {ret.id.slice(0, 8).toUpperCase()}</h1>
        <Link href="/admin/returns">Back to returns</Link>
      </AdminHeaderBox>
      <div className="content">
        <ReturnDetailGrid>
          <div style={{ display: "grid", gap: 24 }}>
            <DetailCard>
              <h2>Items requested for return</h2>
              <DetailItemsTable>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th className="numeric">Qty</th>
                    <th className="numeric">Unit price</th>
                    <th className="numeric">Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {ret.items.map((item, i) => (
                    <tr key={item.orderItemId ?? i}>
                      <td>{item.name}</td>
                      <td className="numeric">{item.quantity}</td>
                      <td className="numeric">
                        {ret.order?.currency ?? ""} {item.unitPrice.toLocaleString()}
                      </td>
                      <td className="numeric">
                        {ret.order?.currency ?? ""}{" "}
                        {(item.unitPrice * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DetailItemsTable>
            </DetailCard>

            <DetailCard>
              <h2>Reason</h2>
              <p style={{ fontSize: 13, color: "#5F5E5E" }}>
                {REASON_LABELS[ret.reason] ?? ret.reason}
              </p>
              {ret.detail && (
                <p style={{ fontSize: 13, color: "#5F5E5E", fontStyle: "italic" }}>
                  “{ret.detail}”
                </p>
              )}
            </DetailCard>
          </div>

          <div style={{ display: "grid", gap: 24 }}>
            <DetailCard>
              <h2>Order</h2>
              <p style={{ fontSize: 13 }}>
                <Link href={`/admin/orders/${ret.orderId}`}>
                  {ret.orderId.slice(0, 8).toUpperCase()}
                </Link>
              </p>
              {ret.order && (
                <p style={{ fontSize: 13, color: "#5F5E5E" }}>
                  Order total: {ret.order.currency} {ret.order.total.toLocaleString()}
                </p>
              )}
            </DetailCard>

            <DetailCard>
              <h2>Customer</h2>
              {ret.customer ? (
                <div style={{ fontSize: 13, display: "grid", gap: 4 }}>
                  <span>{ret.customer.fullName ?? "—"}</span>
                  <span>{ret.customer.email}</span>
                  <span>{ret.customer.phone ?? "—"}</span>
                </div>
              ) : (
                <p style={{ fontSize: 13, color: "#5F5E5E" }}>
                  No customer on file.
                </p>
              )}
            </DetailCard>

            <DetailCard>
              <h2>Status</h2>
              <ReturnStatusPill $status={ret.status}>{ret.status}</ReturnStatusPill>
              <ResolveReturnForm
                returnId={ret.id}
                initialStatus={ret.status}
                initialAdminNotes={ret.adminNotes}
                initialRefundAmount={ret.refundAmount}
              />
            </DetailCard>
          </div>
        </ReturnDetailGrid>
      </div>
    </AdminContentBox>
  );
};

export default page;

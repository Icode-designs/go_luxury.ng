import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getCustomerOrderById } from "@/lib/returns/getCustomerOrderById";
import ReturnRequestForm from "@/components/customer/orders/returnRequestForm";
import OrderStatusTimeline from "@/components/customer/orders/orderStatusTimeline";
import {
  OrdersSection,
  OrdersContainer,
  BackLink,
  DetailHeaderRow,
  DetailCard,
  ItemRow,
  DetailRow,
  StatusPill,
  TrackingRow,
  ReturnHistoryCard,
} from "@/components/customer/orders/orders.styles";

interface CustomerOrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const RETURN_STATUS_LABEL: Record<string, string> = {
  requested: "Requested",
  approved: "Approved",
  rejected: "Rejected",
  refunded: "Refunded",
};

export default async function CustomerOrderDetailPage({
  params,
}: CustomerOrderDetailPageProps) {
  const { orderId } = await params;

  // getCustomerOrderById relies on the "Customers view their own orders" RLS
  // policy to scope the row to the logged-in customer — but that policy
  // also allows admins to read any order, so an admin visiting this
  // customer-facing route by URL would otherwise see someone else's order.
  // This page is customer-only, so gate on role explicitly.
  const user = await getCurrentUser();
  if (!user || user.role !== "customer") {
    notFound();
  }

  const order = await getCustomerOrderById(orderId);

  if (!order) {
    notFound();
  }

  return (
    <OrdersSection>
      <OrdersContainer>
        <Link href="/customer/orders" passHref legacyBehavior>
          <BackLink>&larr; Back to my orders</BackLink>
        </Link>

        <DetailHeaderRow>
          <h1>Order #{order.id.slice(0, 8).toUpperCase()}</h1>
          <StatusPill $status={order.status}>
            {order.status.replace("_", " ")}
          </StatusPill>
        </DetailHeaderRow>

        <DetailCard>
          <h2>Status</h2>
          <OrderStatusTimeline status={order.status} />
          {order.trackingNumber && (
            <TrackingRow>
              <span>Tracking number</span>
              <span>{order.trackingNumber}</span>
            </TrackingRow>
          )}
        </DetailCard>

        <DetailCard>
          <h2>Items</h2>
          {order.items.map((item) => (
            <ItemRow key={item.orderItemId}>
              <div>
                <div className="item-name">
                  {item.productId ? (
                    <Link href={`/product/${item.productId}`}>{item.name}</Link>
                  ) : (
                    item.name
                  )}
                </div>
                <div className="item-qty">Qty {item.quantity}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="item-name">
                  {order.currency} {item.lineTotal.toLocaleString()}
                </div>
              </div>
            </ItemRow>
          ))}

          <DetailRow>
            <span>Shipping</span>
            <span>
              {order.currency} {order.shippingCost.toLocaleString()}
            </span>
          </DetailRow>
          <DetailRow className="total">
            <span>Total</span>
            <span>
              {order.currency} {order.total.toLocaleString()}
            </span>
          </DetailRow>
        </DetailCard>

        {order.address && (
          <DetailCard>
            <h2>Shipping address</h2>
            <p style={{ fontSize: 13, color: "#5F5E5E" }}>
              {order.address.street}
              {order.address.city ? `, ${order.address.city}` : ""}
              {order.address.stateRegion ? `, ${order.address.stateRegion}` : ""}
              {`, ${order.address.country}`}
              {order.address.postalCode ? ` ${order.address.postalCode}` : ""}
            </p>
          </DetailCard>
        )}

        {order.status === "delivered" && (
          <DetailCard>
            <h2>Request a return</h2>
            <ReturnRequestForm orderId={order.id} items={order.items} />
          </DetailCard>
        )}

        {order.returns.length > 0 && (
          <DetailCard>
            <h2>Return requests</h2>
            {order.returns.map((ret) => (
              <ReturnHistoryCard key={ret.id}>
                <div className="return-top">
                  <StatusPill $status={ret.status}>
                    {RETURN_STATUS_LABEL[ret.status]}
                  </StatusPill>
                  <span className="return-date">{formatDate(ret.createdAt)}</span>
                </div>
                <div className="return-items">
                  {ret.items
                    .map((i) => `${i.name} × ${i.quantity}`)
                    .join(", ")}
                </div>
                {ret.refundAmount !== null && (
                  <div className="return-items">
                    Refund amount: {order.currency}{" "}
                    {ret.refundAmount.toLocaleString()}
                  </div>
                )}
                {ret.detail && <div className="return-notes">“{ret.detail}”</div>}
              </ReturnHistoryCard>
            ))}
          </DetailCard>
        )}
      </OrdersContainer>
    </OrdersSection>
  );
}

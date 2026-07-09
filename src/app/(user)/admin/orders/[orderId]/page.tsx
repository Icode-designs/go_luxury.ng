import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import { getOrderForAdmin } from "@/lib/orders/getOrderForAdmin";
import OrderStatusForm from "@/components/user/orders/orderStatusForm";
import {
  OrderDetailGrid,
  DetailCard,
  DetailItemsTable,
  DetailRow,
} from "@/components/user/orders/orders.styles";

interface AdminOrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

const page = async ({ params }: AdminOrderDetailPageProps) => {
  const { orderId } = await params;
  const order = await getOrderForAdmin(orderId);

  if (!order) {
    notFound();
  }

  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Order {order.id.slice(0, 8).toUpperCase()}</h1>
        <Link href="/admin/orders">Back to orders</Link>
      </AdminHeaderBox>
      <div className="content">
        <OrderDetailGrid>
          <div style={{ display: "grid", gap: 24 }}>
            <DetailCard>
              <h2>Items</h2>
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
                  {order.items.map((item, i) => (
                    <tr key={item.productId ?? i}>
                      <td>
                        {item.productId ? (
                          <Link href={`/product/${item.productId}`}>
                            {item.name}
                          </Link>
                        ) : (
                          item.name
                        )}
                      </td>
                      <td className="numeric">{item.quantity}</td>
                      <td className="numeric">
                        {order.currency} {item.unitPrice.toLocaleString()}
                      </td>
                      <td className="numeric">
                        {order.currency} {item.lineTotal.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DetailItemsTable>

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

            <DetailCard>
              <h2>Payments</h2>
              {order.payments.length === 0 ? (
                <p style={{ fontSize: 13, color: "#5F5E5E" }}>
                  No payment recorded yet — online payment isn&apos;t set up
                  yet, so this order is awaiting manual payment arrangement.
                </p>
              ) : (
                <DetailItemsTable>
                  <thead>
                    <tr>
                      <th>Provider</th>
                      <th>Status</th>
                      <th className="numeric">Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.payments.map((p) => (
                      <tr key={p.id}>
                        <td>{p.provider}</td>
                        <td>{p.status}</td>
                        <td className="numeric">
                          {order.currency} {p.amountCharged.toLocaleString()}
                        </td>
                        <td>
                          {new Date(p.createdAt).toLocaleDateString("en-NG")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </DetailItemsTable>
              )}
            </DetailCard>
          </div>

          <div style={{ display: "grid", gap: 24 }}>
            <DetailCard>
              <h2>Customer</h2>
              {order.customer ? (
                <div style={{ fontSize: 13, display: "grid", gap: 4 }}>
                  <span>{order.customer.fullName ?? "—"}</span>
                  <span>{order.customer.email}</span>
                  <span>{order.customer.phone ?? "—"}</span>
                </div>
              ) : (
                <p style={{ fontSize: 13, color: "#5F5E5E" }}>
                  No customer on file.
                </p>
              )}
            </DetailCard>

            <DetailCard>
              <h2>Shipping address</h2>
              {order.address ? (
                <p style={{ fontSize: 13, color: "#5F5E5E" }}>
                  {order.address.street}
                  {order.address.city ? `, ${order.address.city}` : ""}
                  {order.address.stateRegion
                    ? `, ${order.address.stateRegion}`
                    : ""}
                  {`, ${order.address.country}`}
                  {order.address.postalCode
                    ? ` ${order.address.postalCode}`
                    : ""}
                </p>
              ) : (
                <p style={{ fontSize: 13, color: "#5F5E5E" }}>
                  No address on file.
                </p>
              )}
            </DetailCard>

            <DetailCard>
              <h2>Order status</h2>
              <OrderStatusForm
                orderId={order.id}
                initialStatus={order.status}
                initialTrackingNumber={order.trackingNumber}
                initialInternalNotes={order.internalNotes}
              />
            </DetailCard>
          </div>
        </OrderDetailGrid>
      </div>
    </AdminContentBox>
  );
};

export default page;

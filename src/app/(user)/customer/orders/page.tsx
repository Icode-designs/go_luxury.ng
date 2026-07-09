import Link from "next/link";
import { getCustomerOrders } from "@/lib/returns/getCustomerOrders";
import {
  OrdersSection,
  OrdersContainer,
  OrdersHeaderRow,
  OrderList,
  OrderCard,
  StatusPill,
  EmptyOrdersBox,
} from "@/components/customer/orders/orders.styles";

function formatOrderDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const metadata = {
  title: "My Orders | Go_LuxuryHair.NG",
};

export default async function CustomerOrdersPage() {
  const orders = await getCustomerOrders();

  return (
    <OrdersSection>
      <OrdersContainer>
        <OrdersHeaderRow>
          <h1>My Orders</h1>
          <p>Track your orders and request returns.</p>
        </OrdersHeaderRow>

        {orders.length === 0 ? (
          <EmptyOrdersBox>
            <h2>No orders yet</h2>
            <p>Once you place an order, it will show up here.</p>
            <Link href="/shop">Start shopping</Link>
          </EmptyOrdersBox>
        ) : (
          <OrderList>
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/customer/orders/${order.id}`}
                passHref
                legacyBehavior
              >
                <OrderCard>
                  <div>
                    <div className="order-id">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </div>
                    <div className="order-meta">
                      {formatOrderDate(order.createdAt)} &middot; {order.itemCount}{" "}
                      item{order.itemCount === 1 ? "" : "s"}
                    </div>
                  </div>
                  <StatusPill $status={order.status}>
                    {order.status.replace("_", " ")}
                  </StatusPill>
                  <div className="order-total">
                    {order.currency} {order.total.toLocaleString()}
                  </div>
                </OrderCard>
              </Link>
            ))}
          </OrderList>
        )}
      </OrdersContainer>
    </OrdersSection>
  );
}

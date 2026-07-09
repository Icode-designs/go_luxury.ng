import Link from "next/link";
import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import { getDashboardStats } from "@/lib/dashboard/getDashboardStats";
import {
  StatCardsGrid,
  StatCard,
  DashboardGrid,
  PanelCard,
  SimpleListRow,
  EmptyNote,
  StatusBreakdownRow,
} from "@/components/user/dashboard/dashboard.styles";
import { OrderStatusPill } from "@/components/user/orders/orders.styles";

function formatStatusLabel(status: string): string {
  return status.replace("_", " ");
}

const page = async () => {
  const stats = await getDashboardStats();
  const openOrders =
    stats.orderStatusCounts.pending + stats.orderStatusCounts.processing;

  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Dashboard</h1>
      </AdminHeaderBox>
      <div className="content">
        <StatCardsGrid>
          <StatCard>
            <span className="label">Open orders</span>
            <span className="value">{openOrders}</span>
            <span className="sub">Pending + processing</span>
          </StatCard>
          <StatCard>
            <span className="label">Total order value</span>
            <span className="value">
              ₦{stats.totalOrderValue.toLocaleString()}
            </span>
            <span className="sub">Includes unpaid, pending orders</span>
          </StatCard>
          <StatCard>
            <span className="label">Active products</span>
            <span className="value">{stats.totalActiveProducts}</span>
          </StatCard>
          <StatCard>
            <span className="label">Customers</span>
            <span className="value">{stats.totalCustomers}</span>
          </StatCard>
        </StatCardsGrid>

        <DashboardGrid>
          <div style={{ display: "grid", gap: 24 }}>
            <PanelCard>
              <h2>
                Recent orders
                <Link href="/admin/orders">View all</Link>
              </h2>
              {stats.recentOrders.length === 0 ? (
                <EmptyNote>No orders yet.</EmptyNote>
              ) : (
                stats.recentOrders.map((order) => (
                  <SimpleListRow key={order.id}>
                    <Link href={`/admin/orders/${order.id}`}>
                      {order.id.slice(0, 8).toUpperCase()}
                    </Link>
                    <span>{order.customerName ?? "Guest"}</span>
                    <span>
                      {order.currency} {order.total.toLocaleString()}
                    </span>
                    <OrderStatusPill $status={order.status}>
                      {formatStatusLabel(order.status)}
                    </OrderStatusPill>
                  </SimpleListRow>
                ))
              )}
            </PanelCard>

            <PanelCard>
              <h2>Order status breakdown</h2>
              {Object.entries(stats.orderStatusCounts).map(([status, count]) => (
                <StatusBreakdownRow key={status}>
                  <span>{formatStatusLabel(status)}</span>
                  <span>{count}</span>
                </StatusBreakdownRow>
              ))}
            </PanelCard>
          </div>

          <div style={{ display: "grid", gap: 24 }}>
            <PanelCard>
              <h2>
                Low stock
                <Link href="/admin/products">View products</Link>
              </h2>
              {stats.lowStockProducts.length === 0 ? (
                <EmptyNote>Nothing low on stock right now.</EmptyNote>
              ) : (
                stats.lowStockProducts.map((product) => (
                  <SimpleListRow key={product.id}>
                    <Link href={`/admin/products/edit-product/${product.id}`}>
                      {product.name}
                    </Link>
                    <span>
                      {product.stockCount === 0
                        ? "Out of stock"
                        : `${product.stockCount} left`}
                    </span>
                  </SimpleListRow>
                ))
              )}
            </PanelCard>

            <PanelCard>
              <h2>
                Pending reviews
                <Link href="/admin/reviews">View reviews</Link>
              </h2>
              <span style={{ fontSize: 24 }}>{stats.pendingReviewsCount}</span>
              <EmptyNote>Awaiting approval before going live.</EmptyNote>
            </PanelCard>

            <PanelCard>
              <h2>
                Pending returns
                <Link href="/admin/returns">View returns</Link>
              </h2>
              <span style={{ fontSize: 24 }}>{stats.pendingReturnsCount}</span>
              <EmptyNote>Awaiting a decision.</EmptyNote>
            </PanelCard>
          </div>
        </DashboardGrid>
      </div>
    </AdminContentBox>
  );
};

export default page;

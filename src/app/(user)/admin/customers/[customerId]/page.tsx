import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import { getCustomerForAdmin } from "@/lib/customers/getCustomerForAdmin";
import {
  DetailGrid,
  DetailCard,
  AddressCard,
  GuestPill,
} from "@/components/user/customers/customers.styles";
import { OrderStatusPill } from "@/components/user/orders/orders.styles";

interface AdminCustomerDetailPageProps {
  params: Promise<{ customerId: string }>;
}

function formatStatusLabel(status: string): string {
  return status.replace("_", " ");
}

const page = async ({ params }: AdminCustomerDetailPageProps) => {
  const { customerId } = await params;
  const customer = await getCustomerForAdmin(customerId);

  if (!customer) {
    notFound();
  }

  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>
          {customer.fullName ?? "Unnamed customer"}{" "}
          {customer.isGuest && <GuestPill>Guest</GuestPill>}
        </h1>
        <Link href="/admin/customers">Back to customers</Link>
      </AdminHeaderBox>
      <div className="content">
        <DetailGrid>
          <div style={{ display: "grid", gap: 24 }}>
            <DetailCard>
              <h2>Order history</h2>
              {customer.orders.length === 0 ? (
                <p style={{ fontSize: 13, color: "#5F5E5E" }}>
                  No orders yet.
                </p>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {customer.orders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: 13,
                        padding: "8px 0",
                        borderBottom: "1px solid #E2DFDE",
                      }}
                    >
                      <Link href={`/admin/orders/${order.id}`}>
                        {order.id.slice(0, 8).toUpperCase()}
                      </Link>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-NG",
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </span>
                      <span>
                        {order.currency} {order.total.toLocaleString()}
                      </span>
                      <OrderStatusPill $status={order.status}>
                        {formatStatusLabel(order.status)}
                      </OrderStatusPill>
                    </div>
                  ))}
                </div>
              )}
            </DetailCard>

            <DetailCard>
              <h2>Addresses</h2>
              {customer.addresses.length === 0 ? (
                <p style={{ fontSize: 13, color: "#5F5E5E" }}>
                  No addresses on file.
                </p>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {customer.addresses.map((address) => (
                    <AddressCard key={address.id}>
                      {address.isDefault && (
                        <span className="default-badge">Default</span>
                      )}
                      {address.street}
                      {address.city ? `, ${address.city}` : ""}
                      {address.stateRegion ? `, ${address.stateRegion}` : ""}
                      {`, ${address.country}`}
                      {address.postalCode ? ` ${address.postalCode}` : ""}
                    </AddressCard>
                  ))}
                </div>
              )}
            </DetailCard>
          </div>

          <div style={{ display: "grid", gap: 24 }}>
            <DetailCard>
              <h2>Contact</h2>
              <div style={{ fontSize: 13, display: "grid", gap: 4 }}>
                <span>{customer.email}</span>
                <span>{customer.phone ?? "No phone on file"}</span>
                {customer.detectedCountry && (
                  <span>{customer.detectedCountry}</span>
                )}
                <span style={{ color: "#9A8880" }}>
                  Joined{" "}
                  {new Date(customer.createdAt).toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </DetailCard>
          </div>
        </DetailGrid>
      </div>
    </AdminContentBox>
  );
};

export default page;

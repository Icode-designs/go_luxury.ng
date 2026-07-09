import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import {
  OrdersSection,
  OrdersContainer,
  OrdersHeaderRow,
  OrderCard,
} from "@/components/customer/orders/orders.styles";

export const metadata = {
  title: "My Account | Go_LuxuryHair.NG",
};

const CustomerAccountPage = async () => {
  const user = await getCurrentUser();
  const name = user?.customer?.full_name?.trim();

  return (
    <OrdersSection>
      <OrdersContainer>
        <OrdersHeaderRow>
          <h1>{name ? `Welcome back, ${name}` : "My Account"}</h1>
          <p>{user?.customer?.email}</p>
        </OrdersHeaderRow>

        <Link href="/customer/orders" passHref legacyBehavior>
          <OrderCard>
            <div>
              <div className="order-id">My Orders</div>
              <div className="order-meta">
                View order history and request returns
              </div>
            </div>
          </OrderCard>
        </Link>

        <Link href="/customer/settings" passHref legacyBehavior>
          <OrderCard>
            <div>
              <div className="order-id">Account Settings</div>
              <div className="order-meta">
                Update your profile and password
              </div>
            </div>
          </OrderCard>
        </Link>
      </OrdersContainer>
    </OrdersSection>
  );
};

export default CustomerAccountPage;

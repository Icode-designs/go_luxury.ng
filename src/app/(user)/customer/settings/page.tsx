import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import ProfileForm from "@/components/customer/settings/profileForm";
import ChangePasswordForm from "@/components/customer/settings/changePasswordForm";
import {
  OrdersSection,
  OrdersContainer,
  OrdersHeaderRow,
  DetailCard,
} from "@/components/customer/orders/orders.styles";

export const metadata = {
  title: "Account Settings | Go_LuxuryHair.NG",
};

export default async function CustomerSettingsPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "customer") {
    notFound();
  }

  return (
    <OrdersSection>
      <OrdersContainer>
        <OrdersHeaderRow>
          <h1>Account Settings</h1>
          <p>Update your profile details and password.</p>
        </OrdersHeaderRow>

        <DetailCard>
          <h2>Profile</h2>
          <ProfileForm
            initialFullName={user.customer?.full_name ?? ""}
            initialPhone={user.customer?.phone ?? ""}
          />
        </DetailCard>

        <DetailCard>
          <h2>Password</h2>
          <ChangePasswordForm />
        </DetailCard>
      </OrdersContainer>
    </OrdersSection>
  );
}

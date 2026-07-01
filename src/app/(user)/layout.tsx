import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdminRoute = pathname.startsWith("/admin");
  const isCustomerRoute = pathname.startsWith("/customer");

  const currentUser = await getCurrentUser();

  // No session at all — fail closed regardless of which route was requested.
  if (!currentUser) {
    redirect(`/login?returnTo=${encodeURIComponent(pathname)}`);
  }

  switch (currentUser?.role) {
    case "admin":
      // Admins are not allowed on /customer — mutually exclusive by design.
      if (isCustomerRoute) {
        redirect("/admin");
      }
      break;

    case "customer":
      // Customers are not allowed on /admin.
      if (isAdminRoute) {
        redirect("/customer");
      }
      break;

    default:
      // Exhaustiveness guard — TypeScript should make this unreachable
      // given the discriminated union, but fail closed if it ever isn't.
      redirect("/login");
  }

  return <>{children}</>;
}

import Header from "@/components/layout/header/header";
import Button from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export default async function Home() {
  const user = await getCurrentUser()
  return (
    <main>
      <Header userRole={user?.role}/>
    </main>
  );
}

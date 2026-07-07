import Footer from "@/components/layout/footer/footer";
import Header from "@/components/layout/header/header";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getCurrentUser();
  return (
    <>
      <Header userRole={user?.role} />
      {children} <Footer />
    </>
  );
};

export default layout;

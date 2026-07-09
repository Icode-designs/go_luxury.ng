import Footer from "@/components/layout/footer/footer";
import Header from "@/components/layout/header/header";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { getCartItemCount } from "@/lib/cart/getCart";
import React from "react";

// Customer account pages (My Orders, etc.) keep the regular storefront
// chrome — unlike /admin, there's no separate customer dashboard shell, so
// customers can navigate straight back to shopping. Mirrors
// src/app/(main)/layout.tsx.
const layout = async ({ children }: { children: React.ReactNode }) => {
  const [user, cartCount] = await Promise.all([
    getCurrentUser(),
    getCartItemCount(),
  ]);
  return (
    <>
      <Header userRole={user?.role} cartCount={cartCount} />
      {children}
      <Footer />
    </>
  );
};

export default layout;

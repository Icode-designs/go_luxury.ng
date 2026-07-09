"use client";
import { useEffect } from "react";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import {
  StyledMobileNav,
  MobileNavOverlay,
  MobileNavHeader,
} from "./header.styles";
import { logoutAction } from "@/lib/auth/logout";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  userRole?: "admin" | "customer" | undefined;
}

const MobileNav = ({ open, onClose, userRole }: MobileNavProps) => {
  // Lock body scroll while the drawer is open, and let Escape close it —
  // both are baseline expectations for an accessible mobile menu.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <>
      {open && (
        <MobileNavOverlay onClick={onClose} aria-hidden="true" />
      )}
      <StyledMobileNav
        $open={open}
        aria-hidden={!open}
        aria-label="Mobile navigation"
      >
        <MobileNavHeader>
          <button type="button" onClick={onClose} aria-label="Close menu">
            <IoClose />
          </button>
        </MobileNavHeader>
        <Link href="/shop" onClick={onClose}>
          SHOP ALL
        </Link>
        <Link href="/#new-arrivals" onClick={onClose}>
          NEW ARRIVALS
        </Link>
        <Link href="/#best-deals" onClick={onClose}>
          BEST DEALS
        </Link>
        <Link href="/blog" onClick={onClose}>
          BLOG
        </Link>
        {userRole === "admin" && (
          <>
            <Link href="/admin" onClick={onClose}>
              DASHBOARD
            </Link>
            <form action={logoutAction}>
              <button type="submit">LOG OUT</button>
            </form>
          </>
        )}
        {userRole === "customer" && (
          <>
            <Link href="/customer/orders" onClick={onClose}>
              MY ORDERS
            </Link>
            <Link href="/customer/settings" onClick={onClose}>
              SETTINGS
            </Link>
            <form action={logoutAction}>
              <button type="submit">LOG OUT</button>
            </form>
          </>
        )}
        {!userRole && (
          <>
            <Link href="/login" onClick={onClose}>
              LOGIN
            </Link>
            <Link href="/signup" onClick={onClose}>
              SIGNUP
            </Link>
          </>
        )}
      </StyledMobileNav>
    </>
  );
};

export default MobileNav;

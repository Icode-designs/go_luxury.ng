"use client";
import React, { useEffect, useState } from "react";
import {
  HeaderContainer,
  LogoBox,
  StyledActionButtonBox,
  StyledHeader,
  StyledModal,
  CartLinkBox,
  CartCountBadge,
} from "./header.styles";
import Logo from "@/components/ui/logo";
import { useMediaQuery } from "@/hook/mediaquery";
import Link from "next/link";
import { AiOutlineUser } from "react-icons/ai";
import { SlBag } from "react-icons/sl";
import { FaBarsStaggered } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import MobileNav from "./mobileNav";
import { logoutAction } from "@/lib/auth/logout";

const Header = ({
  userRole,
  cartCount = 0,
}: {
  userRole: "admin" | "customer" | undefined;
  cartCount?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Close the mobile drawer automatically if the viewport grows past the
  // mobile breakpoint (e.g. rotating a tablet to landscape).
  useEffect(() => {
    if (!isMobile) setIsMenuOpen(false);
  }, [isMobile]);

  function handleMouseEnter() {
    setIsOpen(true);
  }

  function handleMouseLeave() {
    setIsOpen(false);
  }

  const cartLabel = `Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`;

  return (
    <StyledHeader>
      <HeaderContainer>
        <LogoBox>
          <Logo variant="small" />
          <h3>Go_LuxuryHair.NG</h3>
        </LogoBox>

        {!isMobile && (
          <nav>
            <Link href="/shop" className={pathname === "/shop" ? "active" : ""}>
              SHOP ALL
            </Link>
            <Link href="/#new-arrivals">NEW ARRIVALS</Link>
            <Link href="/#best-deals">BEST DEALS</Link>
            <Link href="/blog" className={pathname.startsWith("/blog") ? "active" : ""}>
              BLOG
            </Link>
          </nav>
        )}

        {!isMobile && (
          <StyledActionButtonBox>
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button aria-label="Account" aria-haspopup="true" aria-expanded={isOpen}>
                <AiOutlineUser />
              </button>
              {isOpen && (
                <StyledModal>
                  {userRole === "admin" && (
                    <>
                      <Link href="/admin">Dashboard</Link>
                      <form action={logoutAction}>
                        <button type="submit">Log out</button>
                      </form>
                    </>
                  )}
                  {userRole === "customer" && (
                    <>
                      <Link href="/customer">My Account</Link>
                      <Link href="/customer/orders">My Orders</Link>
                      <Link href="/customer/settings">Settings</Link>
                      <form action={logoutAction}>
                        <button type="submit">Log out</button>
                      </form>
                    </>
                  )}
                  {!userRole && (
                    <>
                      <Link href="/login">Login</Link>
                      <Link
                        href={`/signup?returnTo=${encodeURIComponent(pathname)}`}
                      >
                        Signup
                      </Link>
                    </>
                  )}
                </StyledModal>
              )}
            </div>

            <CartLinkBox as={Link} href="/cart" aria-label={cartLabel}>
              <SlBag />
              {cartCount > 0 && (
                <CartCountBadge aria-hidden="true">
                  {cartCount > 99 ? "99+" : cartCount}
                </CartCountBadge>
              )}
            </CartLinkBox>
          </StyledActionButtonBox>
        )}

        {isMobile && (
          <StyledActionButtonBox>
            <CartLinkBox as={Link} href="/cart" aria-label={cartLabel}>
              <SlBag />
              {cartCount > 0 && (
                <CartCountBadge aria-hidden="true">
                  {cartCount > 99 ? "99+" : cartCount}
                </CartCountBadge>
              )}
            </CartLinkBox>
            <button
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(true)}
            >
              <FaBarsStaggered />
            </button>
          </StyledActionButtonBox>
        )}
      </HeaderContainer>

      {isMobile && (
        <MobileNav
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          userRole={userRole}
        />
      )}
    </StyledHeader>
  );
};

export default Header;

"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  HeaderContainer,
  LogoBox,
  StyledActionButtonBox,
  StyledHeader,
  StyledModal,
} from "./header.styles";
import Logo from "@/components/ui/logo";
import { useMediaQuery } from "@/hook/mediaquery";
import MobileNav from "./mobileNav";
import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
import { SlBag } from "react-icons/sl";
import { FaBarsStaggered } from "react-icons/fa6";
import { usePathname } from "next/navigation";

const Header = ({
  userRole,
}: {
  userRole: "admin" | "customer" | undefined;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  function handleMouseEnter() {
    setIsOpen(true);
  }

  function handleMouseLeave() {
    setIsOpen(false);
  }
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
            <Link href="/" className={pathname === "/" ? "active" : ""}>
              WIGS
            </Link>
            <Link href="/shop" className={pathname === "/shop" ? "active" : ""}>
              BUNDLES
            </Link>
            <Link href="/shop" className={pathname === "/shop" ? "active" : ""}>
              NEW ARRIVALS
            </Link>
            <Link href="/shop" className={pathname === "/shop" ? "active" : ""}>
              HAIR CARE
            </Link>
          </nav>
        )}

        {!isMobile && (
          <StyledActionButtonBox>
            <button>
              <IoSearchOutline />
            </button>

            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button>
                <AiOutlineUser />
              </button>
              {isOpen && (
                <StyledModal>
                  {userRole === "admin" && <Link href="/admin">Dashboard</Link>}
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

            <button>
              <SlBag />
            </button>
          </StyledActionButtonBox>
        )}

        {isMobile && (
          <button>
            <FaBarsStaggered />
          </button>
        )}
      </HeaderContainer>
    </StyledHeader>
  );
};

export default Header;

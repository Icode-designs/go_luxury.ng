"use client";
import { useEffect } from "react";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import {
  StyledMobileNav,
  MobileNavOverlay,
  MobileNavHeader,
} from "./header.styles";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const MobileNav = ({ open, onClose }: MobileNavProps) => {
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
        <Link href="/" onClick={onClose}>
          WIGS
        </Link>
        <Link href="/shop" onClick={onClose}>
          BUNDLES
        </Link>
        <Link href="/shop" onClick={onClose}>
          NEW ARRIVALS
        </Link>
        <Link href="/shop" onClick={onClose}>
          HAIR CARE
        </Link>
      </StyledMobileNav>
    </>
  );
};

export default MobileNav;

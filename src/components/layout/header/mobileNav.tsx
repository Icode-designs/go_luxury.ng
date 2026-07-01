import { StyledMobileNav } from "./header.styles";
import Link from "next/link";

const MobileNav = () => {
  return (
    <StyledMobileNav>
      <Link href="/shop">SHOP ALL</Link>
      <Link href="/">WIGS</Link>
      <Link href="/shop">BUNDLES</Link>
      <Link href="/shop">NEW ARRIVALS</Link>
      <Link href="/shop">HAIR CARE</Link>
    </StyledMobileNav>
  );
};

export default MobileNav;

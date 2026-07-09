import React from "react";
import Image from "next/image";
import Link from "next/link";

const Logo = ({ variant }: { variant?: "small" | "large" }) => {
  return (
    <Link href="/">
      <Image
        width={variant === "small" ? 40 : 60}
        height={variant === "small" ? 40 : 60}
        src="/logo.png"
        alt="logo"
      />
    </Link>
  );
};

export default Logo;

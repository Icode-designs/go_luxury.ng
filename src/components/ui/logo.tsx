import React from "react";
import Image from "next/image";

const Logo = ({ variant }: { variant?: "small" | "large" }) => {
  return (
    <Image
      width={variant === "small" ? 40 : 60}
      height={variant === "small" ? 40 : 60}
      src="/logo.png"
      alt="logo"
    />
  );
};

export default Logo;

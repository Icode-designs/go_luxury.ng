"use client";
import React from "react";
import styled, { css } from "styled-components";
import Link from "next/link";

type ButtonVariant =
  | "filled-nude"
  | "filled-dark"
  | "outlined"
  | "text"
  | "rounded";

type ButtonAsButton = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: ButtonVariant;
  children: React.ReactNode;
  href?: undefined;
};

type ButtonAsLink = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant: ButtonVariant;
  children: React.ReactNode;
  /** When present, renders as a Next.js Link with the same variant styling. */
  href: string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

// Shared visual styling for both the <button> and Link renderings — kept as
// one `css` block so the two never drift out of sync with each other.
const buttonVariantStyles = css<{ $variant: ButtonVariant }>`
  padding: 12px 24px;
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  border: none;
  text-transform: uppercase;
  max-width: 200px;
  font-family: ${({ theme }) => theme.fonts.fontPrimary};
  font-size: 16px;
  font-weight: 400;
  transition: all 0.3s ease-in-out;
  text-decoration: none;
  &:hover {
    cursor: pointer;
  }

  ${({ $variant, theme }) => {
    switch ($variant) {
      case "filled-nude":
        return `
        background-color: ${theme.colors.col010};
        color: ${theme.colors.col000};

        &:hover {
          background-color: ${theme.colors.col110};
        }
      `;

      case "filled-dark":
        return `
        background-color: ${theme.colors.col000};
        color: ${theme.colors.col040};

        &:hover {
          background-color: ${theme.colors.col060};
        }
      `;

      case "outlined":
        return `
        border: 2px solid ${theme.colors.col000};
        color: ${theme.colors.col000};
        background-color: transparent;

        &:hover {
          background-color: ${theme.colors.col000};
          color: ${theme.colors.col040};
        }
      `;

      case "text":
        return `
        background-color: transparent;
      `;

      case "rounded":
        return `
        background-color: ${theme.colors.col070};
        color: ${theme.colors.col040};
        border-radius: 8px;

        &:hover {
          background-color: ${theme.colors.col000};
        }
      `;
    }
  }}
`;

export const StyledButton = styled.button<{ $variant: ButtonVariant }>`
  ${buttonVariantStyles}
`;

const StyledLinkButton = styled(Link)<{ $variant: ButtonVariant }>`
  ${buttonVariantStyles}
`;

const Button = ({ children, variant, href, ...props }: ButtonProps) => {
  if (href) {
    return (
      <StyledLinkButton
        href={href}
        $variant={variant}
        {...(props as Omit<ButtonAsLink, "variant" | "children" | "href">)}
      >
        {children}
      </StyledLinkButton>
    );
  }

  return (
    <StyledButton
      $variant={variant}
      {...(props as Omit<ButtonAsButton, "variant" | "children" | "href">)}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

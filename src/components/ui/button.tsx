"use client";
import React from "react";
import styled from "styled-components";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: "filled-nude" | "filled-dark" | "outlined" | "text" | "rounded";
  children: React.ReactNode;
};

export const StyledButton = styled.button<{
  $variant: "filled-nude" | "filled-dark" | "outlined" | "text" | "rounded";
}>`
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

const Button = ({ children, variant, ...props }: ButtonProps) => {
  return (
    <StyledButton $variant={variant} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;

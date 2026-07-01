"use client";
import styled from "styled-components";

/**
 * Minimal error message component for inline field validation feedback.
 * Displayed below form fields when react-hook-form or the Server Action
 * returns validation errors. No layout changes — purely additive.
 */
export const FieldError = styled.p`
  font-size: 11px;
  color: #c0392b;
  margin-top: -12px;
  font-family: ${({ theme }) => theme.fonts?.fontPrimary ?? "inherit"};
  letter-spacing: 0.3px;
`;

export const FormError = styled.p`
  font-size: 12px;
  color: #c0392b;
  text-align: center;
  padding: 10px 16px;
  background: rgba(192, 57, 43, 0.07);
  border: 1px solid rgba(192, 57, 43, 0.2);
  width: 100%;
  font-family: ${({ theme }) => theme.fonts?.fontPrimary ?? "inherit"};
  letter-spacing: 0.3px;
`;

export const FormSuccess = styled.p`
  font-size: 12px;
  color: #27ae60;
  text-align: center;
  padding: 10px 16px;
  background: rgba(39, 174, 96, 0.07);
  border: 1px solid rgba(39, 174, 96, 0.2);
  width: 100%;
  font-family: ${({ theme }) => theme.fonts?.fontPrimary ?? "inherit"};
  letter-spacing: 0.3px;
`;

/**
 * Hidden honeypot input — visually and semantically hidden from real users.
 * Bots that fill all fields will populate this; it is rejected server-side.
 * Uses inline style (not CSS class) because bots may ignore stylesheets.
 */
export const HoneypotInput = styled.input`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
`;

/**
 * Terms checkbox row
 */
export const TermsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;

  input[type="checkbox"] {
    margin-top: 2px;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    accent-color: ${({ theme }) => theme.colors?.col000 ?? "#000"};
    cursor: pointer;
  }

  label {
    font-size: 12px;
    color: ${({ theme }) => theme.colors?.col032 ?? "#666"};
    font-family: ${({ theme }) => theme.fonts?.fontPrimary ?? "inherit"};
    line-height: 1.5;
    cursor: pointer;

    a {
      color: ${({ theme }) => theme.colors?.col010 ?? "#888"};
      text-decoration: underline;

      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

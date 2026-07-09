"use client";
import styled from "styled-components";

export const ReviewsWrapper = styled.section`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 0 64px;
  border-top: 1px solid ${({ theme }) => theme.colors.col031};

  h2 {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: 22px;
    color: ${({ theme }) => theme.colors.col000};
    margin-bottom: 20px;

    @media (min-width: 768px) {
      font-size: 26px;
    }
  }
`;

export const SummaryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  .average {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: 32px;
    color: ${({ theme }) => theme.colors.col000};
  }

  .count {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.col032};
  }
`;

export const StarRow = styled.div<{ $size?: number }>`
  display: inline-flex;
  gap: 2px;
  color: ${({ theme }) => theme.colors.col010};
  font-size: ${({ $size }) => ($size ? `${$size}px` : "16px")};
`;

export const StarPickerButton = styled.button<{ $filled: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  font-size: 26px;
  line-height: 1;
  color: ${({ theme, $filled }) =>
    $filled ? theme.colors.col010 : theme.colors.col031};
`;

export const ReviewsList = styled.div`
  display: grid;
  gap: 20px;
  margin-bottom: 32px;
`;

export const ReviewCard = styled.article`
  border-bottom: 1px solid ${({ theme }) => theme.colors.col031};
  padding-bottom: 20px;
  display: grid;
  gap: 8px;

  h3 {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.col000};
  }

  p {
    font-size: 13px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.col032};
  }
`;

export const ReviewMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.col032};

  .reviewer-name {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.col000};
  }
`;

export const NoReviewsNote = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.col032};
  margin-bottom: 24px;
`;

export const ReviewFormBox = styled.form`
  display: grid;
  gap: 16px;
  max-width: 480px;
  padding-top: 8px;

  h3 {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.col000};
  }

  label {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.col032};
    display: block;
    margin-bottom: 6px;
  }

  input[type="text"],
  textarea {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.col031};
    padding: 10px 12px;
    font-size: 14px;
    font-family: inherit;
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

export const LoginPrompt = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.col032};

  a {
    color: ${({ theme }) => theme.colors.col070};
    text-decoration: underline;
  }
`;

export const FormNotice = styled.p<{ $variant: "error" | "success" }>`
  font-size: 13px;
  color: ${({ theme, $variant }) =>
    $variant === "error" ? theme.colors.col120 : theme.colors.col070};
`;

export const FieldErrorText = styled.span`
  display: block;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.col120};
  margin-top: 4px;
`;

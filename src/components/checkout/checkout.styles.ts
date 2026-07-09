"use client";
import styled from "styled-components";

export const CheckoutSection = styled.section`
  width: 100%;
  min-height: 60vh;
  padding: 24px 16px 64px;
  background-color: ${({ theme }) => theme.colors.col040};

  @media (min-width: 480px) {
    padding: 24px 24px 64px;
  }
`;

export const CheckoutContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

export const CheckoutHeaderRow = styled.div`
  margin-bottom: 24px;

  h1 {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: 24px;
    color: ${({ theme }) => theme.colors.col000};

    @media (min-width: 768px) {
      font-size: 30px;
    }
  }
`;

// The <form> itself IS the two-column layout (form fields | order summary)
// so the summary can sit as a real grid sibling instead of nesting a grid
// inside a single-child grid.
export const CheckoutForm = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: start;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 340px;
  }
`;

export const FormFieldsColumn = styled.div`
  display: grid;
  gap: 24px;

  fieldset {
    display: grid;
    gap: 16px;
    border: none;
    padding: 0;
    margin: 0;
  }

  legend {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: 16px;
    color: ${({ theme }) => theme.colors.col000};
    margin-bottom: 4px;
    padding: 0;
  }
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const StubPaymentNotice = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.col070};
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.col090};
  border: 1px solid ${({ theme }) => theme.colors.col100};
`;

export const OrderSummaryItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.col032};

  span:first-child {
    color: ${({ theme }) => theme.colors.col000};
  }
`;

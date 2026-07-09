"use client";
import styled from "styled-components";

export const CartSection = styled.section`
  width: 100%;
  min-height: 60vh;
  padding: 24px 16px 64px;
  background-color: ${({ theme }) => theme.colors.col040};

  @media (min-width: 480px) {
    padding: 24px 24px 64px;
  }
`;

export const CartContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

export const CartHeaderRow = styled.div`
  margin-bottom: 24px;

  h1 {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: 24px;
    color: ${({ theme }) => theme.colors.col000};

    @media (min-width: 768px) {
      font-size: 30px;
    }
  }

  p {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.col032};
    margin-top: 4px;
  }
`;

export const CartLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: start;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 340px;
  }
`;

export const CartItemsList = styled.ul`
  display: grid;
  gap: 16px;
`;

export const CartItemRow = styled.li`
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.col031};

  @media (min-width: 640px) {
    grid-template-columns: 100px 1fr auto;
    align-items: center;
    gap: 20px;
  }
`;

export const CartItemImageBox = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.col090};

  @media (min-width: 640px) {
    width: 100px;
    height: 100px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CartItemInfo = styled.div`
  display: grid;
  gap: 6px;
  align-content: start;

  h3 {
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.col000};
  }

  .unit-price {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.col032};
  }
`;

export const CartItemAttentionNote = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.col120};
`;

export const CartItemControlsRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (min-width: 640px) {
    grid-column: auto;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }
`;

export const QuantityStepper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.col031};

  button {
    width: 30px;
    height: 30px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.col000};

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  span {
    min-width: 28px;
    text-align: center;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.col000};
  }
`;

export const LineTotalText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.col000};
`;

export const RemoveLineButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.col032};
  text-decoration: underline;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.col120};
  }
`;

export const CartSummaryBox = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.col031};
  padding: 20px;
  display: grid;
  gap: 16px;

  @media (min-width: 1024px) {
    position: sticky;
    top: 96px;
  }

  h2 {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: 18px;
    color: ${({ theme }) => theme.colors.col000};
  }
`;

export const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.col032};

  &.total {
    font-size: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.col000};
    padding-top: 12px;
    border-top: 1px solid ${({ theme }) => theme.colors.col031};
  }
`;

export const EmptyCartBox = styled.div`
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 12px;
  padding: 64px 16px;

  svg {
    font-size: 36px;
    color: ${({ theme }) => theme.colors.col032};
  }

  h2 {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: 20px;
    color: ${({ theme }) => theme.colors.col000};
  }

  p {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.col032};
    max-width: 320px;
  }
`;

export const CartErrorNote = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.col120};
  margin: 0;
`;

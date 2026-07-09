"use client";
import styled from "styled-components";

// Mobile-first breakpoints, matching shop.styles.ts / blog.styles.ts
// (480/768/1024/1280px) — this is the storefront look, not the admin
// dashboard shell, since these pages live alongside shop/cart/checkout.

export const OrdersSection = styled.section`
  width: 100%;
  padding: 24px 16px 64px;
  background-color: ${({ theme }) => theme.colors.col040};
  min-height: 60vh;

  @media (min-width: 480px) {
    padding: 24px 24px 64px;
  }
`;

export const OrdersContainer = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
`;

export const OrdersHeaderRow = styled.div`
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
    font-size: 12px;
    color: ${({ theme }) => theme.colors.col032};
    margin-top: 6px;
  }
`;

export const OrderList = styled.div`
  display: grid;
  gap: 16px;
`;

export const OrderCard = styled.a`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border: 1px solid ${({ theme }) => theme.colors.col031};
  color: inherit;

  &:hover {
    border-color: ${({ theme }) => theme.colors.col000};
  }

  .order-id {
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.col000};
  }

  .order-meta {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.col032};
    margin-top: 4px;
  }

  .order-total {
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.col000};
  }
`;

export const StatusPill = styled.span<{ $status: string }>`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
  background-color: ${({ $status }) =>
    $status === "delivered"
      ? "#E1F5EE"
      : $status === "refund_requested"
        ? "#FDEDEA"
        : "#F3F0EC"};
  color: ${({ $status }) =>
    $status === "delivered"
      ? "#0F6E56"
      : $status === "refund_requested"
        ? "#B3261E"
        : "#9A8880"};
`;

export const EmptyOrdersBox = styled.div`
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 12px;
  padding: 64px 16px;

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

  a {
    margin-top: 8px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.col000};
  }
`;

// ---------------------------------------------------------------------------
// Order detail
// ---------------------------------------------------------------------------

export const BackLink = styled.a`
  display: inline-block;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.col032};
  margin-bottom: 20px;

  &:hover {
    color: ${({ theme }) => theme.colors.col000};
  }
`;

export const DetailHeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;

  h1 {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: 22px;
    color: ${({ theme }) => theme.colors.col000};
  }
`;

export const DetailCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.col031};
  padding: 20px;
  margin-bottom: 20px;

  h2 {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.col000};
    margin-bottom: 16px;
  }
`;

export const ItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.col090};
  font-size: 13px;

  &:last-child {
    border-bottom: none;
  }

  .item-name {
    color: ${({ theme }) => theme.colors.col000};
  }

  .item-qty {
    color: ${({ theme }) => theme.colors.col032};
    font-size: 12px;
  }

  .item-returnable {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.col032};
  }
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  padding: 6px 0;

  &.total {
    font-weight: 500;
    font-size: 14px;
    padding-top: 12px;
    border-top: 1px solid ${({ theme }) => theme.colors.col031};
    margin-top: 8px;
  }
`;

// ---------------------------------------------------------------------------
// Return request form
// ---------------------------------------------------------------------------

export const ReturnForm = styled.form`
  display: grid;
  gap: 16px;
`;

export const ReturnItemPicker = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.col090};
  font-size: 13px;

  &:last-of-type {
    border-bottom: none;
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${({ theme }) => theme.colors.col010};
    flex-shrink: 0;
  }

  .item-info {
    flex: 1;
    min-width: 0;
  }

  .item-info span {
    display: block;
    font-size: 11px;
    color: ${({ theme }) => theme.colors.col032};
  }

  input[type="number"] {
    width: 64px;
    border: 1px solid ${({ theme }) => theme.colors.col031};
    padding: 6px 8px;
    font-size: 13px;
  }
`;

export const ReturnField = styled.div`
  display: grid;
  gap: 6px;

  label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${({ theme }) => theme.colors.col032};
  }

  select,
  textarea {
    border: 1px solid ${({ theme }) => theme.colors.col031};
    padding: 10px 12px;
    font-size: 13px;
    font-family: inherit;
  }
`;

// ---------------------------------------------------------------------------
// Order status timeline
// ---------------------------------------------------------------------------

export const TimelineRow = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
`;

export const TimelineStep = styled.div<{ $done: boolean; $last?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: ${({ $last }) => ($last ? "0 0 auto" : "1 1 0")};
  text-align: center;
  position: relative;

  .dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    flex-shrink: 0;
    background-color: ${({ theme, $done }) =>
      $done ? theme.colors.col000 : theme.colors.col090};
    color: ${({ theme, $done }) => ($done ? theme.colors.col040 : theme.colors.col032)};
  }

  .line {
    position: absolute;
    top: 10px;
    left: calc(50% + 10px);
    right: calc(-50% + 10px);
    height: 2px;
    background-color: ${({ theme, $done }) =>
      $done ? theme.colors.col000 : theme.colors.col090};
  }

  .label {
    margin-top: 8px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${({ theme, $done }) => ($done ? theme.colors.col000 : theme.colors.col032)};
  }
`;

export const ReturnBanner = styled.div`
  margin-top: 16px;
  padding: 10px 14px;
  font-size: 12px;
  background-color: #fdedea;
  color: #b3261e;
  border-radius: 6px;
`;

export const TrackingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 13px;

  span:first-child {
    color: ${({ theme }) => theme.colors.col032};
  }

  span:last-child {
    color: ${({ theme }) => theme.colors.col000};
    font-weight: 500;
    letter-spacing: 0.02em;
  }
`;

export const ReturnHistoryCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.col031};
  padding: 16px;
  margin-bottom: 12px;
  font-size: 13px;

  .return-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }

  .return-date {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.col032};
  }

  .return-items {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.col032};
  }

  .return-notes {
    margin-top: 8px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.col030};
    font-style: italic;
  }
`;

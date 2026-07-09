"use client";
import styled from "styled-components";
import type { ReturnStatus } from "@/lib/returns/getReturnsForAdmin";

export const ToolbarWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;

  input[type="text"] {
    padding: 8px 14px;
    border: 1px solid ${({ theme }) => theme.colors.col033};
    border-radius: 8px;
    width: 260px;
  }

  > div {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
`;

export const FilterPill = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.col010 : theme.colors.col033};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.col010 : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.col040 : theme.colors.col010};
`;

export const TableWrap = styled.div`
  background-color: ${({ theme }) => theme.colors.col040};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.col033};
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead th {
    text-align: left;
    padding: 12px 16px;
    font-size: 11px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.col032};
    border-bottom: 1px solid ${({ theme }) => theme.colors.col033};
    white-space: nowrap;
  }

  tbody td {
    padding: 12px 16px;
    font-size: 13px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.col033};
    vertical-align: middle;
    white-space: nowrap;

    a {
      color: ${({ theme }) => theme.colors.col010};
    }
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const STATUS_COLORS: Record<ReturnStatus, { bg: string; fg: string }> = {
  requested: { bg: "#FBEAEA", fg: "#93000A" },
  approved: { bg: "#EAF1FB", fg: "#2C5FA3" },
  rejected: { bg: "#F3F0EC", fg: "#9A8880" },
  refunded: { bg: "#E1F5EE", fg: "#0F6E56" },
};

export const ReturnStatusPill = styled.span<{ $status: ReturnStatus }>`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 20px;
  white-space: nowrap;
  background-color: ${({ $status }) => STATUS_COLORS[$status].bg};
  color: ${({ $status }) => STATUS_COLORS[$status].fg};
`;

export const EmptyStateBox = styled.div`
  padding: 48px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.col032};
  font-size: 13px;
`;

// ---------------------------------------------------------------------------
// Return detail page
// ---------------------------------------------------------------------------

export const ReturnDetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 320px;
    align-items: start;
  }
`;

export const DetailCard = styled.div`
  background-color: ${({ theme }) => theme.colors.col040};
  border: 1px solid ${({ theme }) => theme.colors.col033};
  border-radius: 12px;
  padding: 20px;
  display: grid;
  gap: 16px;

  h2 {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${({ theme }) => theme.colors.col032};
  }
`;

export const DetailItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  th {
    text-align: left;
    padding: 8px 0;
    font-size: 11px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.col032};
    border-bottom: 1px solid ${({ theme }) => theme.colors.col033};
  }

  td {
    padding: 10px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.col033};
  }

  tr:last-child td {
    border-bottom: none;
  }

  td.numeric,
  th.numeric {
    text-align: right;
  }
`;

export const ResolveFormRow = styled.div`
  display: grid;
  gap: 12px;

  select,
  textarea,
  input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${({ theme }) => theme.colors.col033};
    border-radius: 8px;
    font-size: 13px;
    font-family: inherit;
  }

  label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${({ theme }) => theme.colors.col032};
    display: block;
    margin-bottom: 6px;
  }

  button {
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    background-color: ${({ theme }) => theme.colors.col000};
    color: ${({ theme }) => theme.colors.col040};
    font-size: 13px;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.col060};
    }
  }
`;

export const InlineNote = styled.p<{ $variant?: "error" | "success" }>`
  font-size: 12px;
  color: ${({ theme, $variant }) =>
    $variant === "error"
      ? theme.colors.col120
      : $variant === "success"
        ? "#0F6E56"
        : theme.colors.col032};
`;

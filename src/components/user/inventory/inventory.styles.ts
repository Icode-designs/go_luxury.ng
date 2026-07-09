"use client";
import styled from "styled-components";

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
    padding: 10px 16px;
    font-size: 13px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.col033};
    vertical-align: middle;

    a {
      color: ${({ theme }) => theme.colors.col010};
    }
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

export const RowThumb = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.col090};
  }
`;

export const ProductNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
`;

export const StockBadge = styled.span<{ $level: "ok" | "low" | "out" }>`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 20px;
  white-space: nowrap;
  background-color: ${({ $level }) =>
    $level === "out" ? "#FBEAEA" : $level === "low" ? "#FBF3E5" : "#E1F5EE"};
  color: ${({ $level }) =>
    $level === "out" ? "#93000A" : $level === "low" ? "#8A5A00" : "#0F6E56"};
`;

export const StockEditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input {
    width: 70px;
    padding: 6px 8px;
    border: 1px solid ${({ theme }) => theme.colors.col033};
    border-radius: 6px;
    font-size: 13px;
  }

  button {
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.colors.col000};
    background-color: ${({ theme }) => theme.colors.col000};
    color: ${({ theme }) => theme.colors.col040};
    font-size: 12px;
    cursor: pointer;

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
`;

export const EmptyStateBox = styled.div`
  padding: 48px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.col032};
  font-size: 13px;
`;

export const InlineNote = styled.span<{ $variant?: "error" | "success" }>`
  font-size: 11px;
  color: ${({ theme, $variant }) =>
    $variant === "error"
      ? theme.colors.col120
      : $variant === "success"
        ? "#0F6E56"
        : theme.colors.col032};
`;

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

export const StatusPill = styled.span<{ $status: "draft" | "published" }>`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 20px;
  background-color: ${({ $status }) =>
    $status === "published" ? "#E1F5EE" : "#F3F0EC"};
  color: ${({ $status }) => ($status === "published" ? "#0F6E56" : "#9A8880")};
`;

export const EmptyStateBox = styled.div`
  padding: 48px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.col032};
  font-size: 13px;
`;

export const StyledLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background-color: ${({ theme }) => theme.colors.col000};
  color: ${({ theme }) => theme.colors.col040};
  border-radius: 8px;
  font-size: 13px;
`;

// ---------------------------------------------------------------------------
// Post form
// ---------------------------------------------------------------------------

export const PostForm = styled.form`
  display: grid;
  gap: 20px;
  max-width: 720px;

  fieldset {
    display: grid;
    gap: 16px;
    border: none;
    padding: 0;
    margin: 0;
  }
`;

export const FormActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

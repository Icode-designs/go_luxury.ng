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
    width: 280px;
  }
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

export const GuestPill = styled.span`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 20px;
  background-color: #f3f0ec;
  color: #9a8880;
`;

export const EmptyStateBox = styled.div`
  padding: 48px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.col032};
  font-size: 13px;
`;

// ---------------------------------------------------------------------------
// Customer detail page
// ---------------------------------------------------------------------------

export const DetailGrid = styled.div`
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
  gap: 12px;

  h2 {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${({ theme }) => theme.colors.col032};
  }
`;

export const AddressCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.col033};
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.col032};
  position: relative;

  .default-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 10px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.col010};
  }
`;

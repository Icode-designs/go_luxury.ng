"use client";
import styled from "styled-components";

export const StatCardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.col040};
  border: 1px solid ${({ theme }) => theme.colors.col033};
  border-radius: 12px;
  padding: 16px;
  display: grid;
  gap: 6px;

  .label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.col032};
  }

  .value {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: 24px;
    color: ${({ theme }) => theme.colors.col000};
  }

  .sub {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.col032};
  }
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 1.5fr 1fr;
    align-items: start;
  }
`;

export const PanelCard = styled.div`
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
    display: flex;
    align-items: center;
    justify-content: space-between;

    a {
      font-size: 11px;
      text-transform: none;
      letter-spacing: normal;
      color: ${({ theme }) => theme.colors.col010};
    }
  }
`;

export const SimpleListRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.col033};
  font-size: 13px;

  &:last-child {
    border-bottom: none;
  }

  a {
    color: ${({ theme }) => theme.colors.col010};
  }
`;

export const EmptyNote = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.col032};
  padding: 12px 0;
`;

export const StatusBreakdownRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  padding: 6px 0;

  span:first-child {
    text-transform: capitalize;
    color: ${({ theme }) => theme.colors.col032};
  }

  span:last-child {
    color: ${({ theme }) => theme.colors.col000};
    font-weight: 500;
  }
`;

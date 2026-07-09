"use client";
import styled from "styled-components";

// Mobile-first breakpoints: base < 768px, tablet >= 768px, desktop >= 1280px.
// Filters live in a sidebar from 1024px up; below that they live in the
// off-canvas drawer (see FilterDrawerPanel).
export const ShopSection = styled.section`
  width: 100%;
  padding: 24px 16px 64px;
  background-color: ${({ theme }) => theme.colors.col040};

  @media (min-width: 480px) {
    padding: 24px 24px 64px;
  }
`;

export const ShopContainer = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
`;

export const ShopHeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;

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
  }
`;

export const ShopToolbarRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.col031};

  select {
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${({ theme }) => theme.colors.col000};
    border: 1px solid ${({ theme }) => theme.colors.col031};
    padding: 8px 10px;
    background-color: transparent;
  }
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 320px;
  border: 1px solid ${({ theme }) => theme.colors.col031};
  padding: 8px 10px;

  svg {
    color: ${({ theme }) => theme.colors.col032};
    font-size: 14px;
    flex-shrink: 0;
  }

  input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: none;
    font-size: 12px;
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    color: ${({ theme }) => theme.colors.col000};

    &::placeholder {
      color: ${({ theme }) => theme.colors.col032};
    }
  }
`;

export const FilterToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid ${({ theme }) => theme.colors.col000};
  padding: 8px 14px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.col000};
  background: none;
  cursor: pointer;

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const ShopLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 1024px) {
    grid-template-columns: 240px 1fr;
  }
`;

// Desktop-only static sidebar — hidden below 1024px in favor of the drawer.
export const FilterSidebar = styled.aside`
  display: none;

  @media (min-width: 1024px) {
    display: block;
    align-self: start;
    position: sticky;
    top: 88px;
  }
`;

export const FilterOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1999;

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const FilterDrawerPanel = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100dvh;
  width: min(300px, 85vw);
  background-color: ${({ theme }) => theme.colors.col040};
  z-index: 2000;
  padding: 20px;
  overflow-y: auto;
  transform: translateX(${({ $open }) => ($open ? "0" : "-100%")});
  transition: transform 0.25s ease;

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const FilterDrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h3 {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.col000};
  }

  button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.col000};
    padding: 4px;
  }
`;

export const FilterGroup = styled.div`
  margin-bottom: 24px;

  h4 {
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.col032};
    margin-bottom: 12px;
  }

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.col030};
    padding: 6px 0;
    cursor: pointer;
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${({ theme }) => theme.colors.col010};
  }
`;

export const PriceInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input {
    width: 100%;
    min-width: 0;
    border: 1px solid ${({ theme }) => theme.colors.col031};
    padding: 8px 10px;
    font-size: 13px;
  }

  span {
    color: ${({ theme }) => theme.colors.col032};
  }
`;

export const ClearFiltersButton = styled.button`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.col031};
  padding: 10px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.col030};
  background: none;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.col000};
    color: ${({ theme }) => theme.colors.col000};
  }
`;

export const NoResultsBox = styled.div`
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 12px;
  padding: 64px 16px;

  svg {
    font-size: 32px;
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

export const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const SkeletonCard = styled.div`
  display: grid;
  gap: 10px;

  .skeleton-image {
    aspect-ratio: 3 / 4;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.col090};
  }

  .skeleton-line {
    height: 10px;
    width: 70%;
    background-color: ${({ theme }) => theme.colors.col090};
  }
`;

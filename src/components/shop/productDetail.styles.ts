"use client";
import styled from "styled-components";

export const ProductDetailSection = styled.section`
  width: 100%;
  padding: 24px 16px 64px;
  background-color: ${({ theme }) => theme.colors.col040};

  @media (min-width: 480px) {
    padding: 24px 24px 64px;
  }
`;

export const ProductDetailContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 48px;
  }
`;

export const GalleryColumn = styled.div``;

export const MainImageBox = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.col090};
  margin-bottom: 10px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ThumbnailRow = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
`;

export const ThumbnailButton = styled.button<{ $active: boolean }>`
  flex: 0 0 auto;
  width: 64px;
  height: 64px;
  border-radius: 6px;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  border: 2px solid
    ${({ theme, $active }) => ($active ? theme.colors.col010 : "transparent")};
  background-color: ${({ theme }) => theme.colors.col090};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Below-gallery block: description + a read-only spec list (each product's
// own attribute values -- e.g. Color: Black, Length: 20 inch).
export const BelowGalleryBlock = styled.div`
  display: grid;
  gap: 20px;
  margin-top: 20px;
`;

export const Description = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.col032};
  white-space: pre-line;
`;

export const SpecsList = styled.dl`
  display: grid;
  gap: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.col031};
  padding-top: 16px;

  div {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 12px;

    @media (min-width: 480px) {
      grid-template-columns: 140px 1fr;
    }
  }

  dt {
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.col032};
  }

  dd {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.col000};
  }
`;

export const InfoColumn = styled.div`
  display: grid;
  gap: 16px;
  align-content: start;

  h1 {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: 24px;
    color: ${({ theme }) => theme.colors.col000};

    @media (min-width: 768px) {
      font-size: 30px;
    }
  }
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;

  .price-current {
    font-size: 20px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.col000};
  }

  .price-old {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.col032};
    text-decoration: line-through;
  }
`;

export const StockNote = styled.p<{ $lowOrOut: boolean }>`
  font-size: 12px;
  color: ${({ theme, $lowOrOut }) =>
    $lowOrOut ? theme.colors.col120 : theme.colors.col032};
`;

export const AddToCartNotice = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.col070};

  &[role="alert"] {
    color: ${({ theme }) => theme.colors.col120};
  }

  a {
    text-decoration: underline;
  }
`;

export const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  > span:first-child {
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.col032};
  }

  div {
    display: flex;
    align-items: center;
    border: 1px solid ${({ theme }) => theme.colors.col031};
  }

  button {
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 15px;
    color: ${({ theme }) => theme.colors.col000};

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  div > span {
    min-width: 32px;
    text-align: center;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.col000};
  }
`;

"use client";
import styled from "styled-components";
import heroBg from "@/asset/img/homepageHero.png";
import { SectionContent } from "@/styles/components.styled";

// ---------------------------------------------------------------------------
// Breakpoints used throughout this file (mobile-first):
//   base    -> < 768px  (phones)
//   768px+  -> tablets
//   1280px+ -> desktop
// ---------------------------------------------------------------------------

export const HomeHeroSection = styled.section<{ $imageUrl?: string | null }>`
  position: relative;
  width: 100%;
  background-image: url(${({ $imageUrl }) => $imageUrl || heroBg.src});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 88vh;
  min-height: 520px;
  padding: 0 16px;

  @media (min-width: 480px) {
    padding: 0 24px;
  }

  @media (min-width: 1280px) {
    height: 80vh;
  }

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.55) 0%,
      rgba(0, 0, 0, 0.8) 100%
    );
    z-index: 1;
  }

  @media (min-width: 1280px) {
    &::after {
      background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.8) 30%,
        transparent
      );
    }
  }
`;

export const HomeHeroContent = styled(SectionContent)`
  height: 100%;
  display: flex;
  padding: 32px 0;
  position: relative;
  z-index: 2;
  align-items: center;

  @media (min-width: 1280px) {
    padding: 40px 0;
  }
`;

export const HomeHeroArticle = styled.article`
  max-width: 100%;
  justify-self: left;
  display: grid;
  gap: 20px;
  width: 100%;

  @media (min-width: 1280px) {
    max-width: 552px;
    gap: 24px;
  }

  h3,
  span {
    color: ${({ theme }) => theme.colors.col010};
  }

  span {
    font-style: italic;
  }

  p {
    max-width: 100%;

    @media (min-width: 1280px) {
      max-width: 384px;
    }
  }

  h1 {
    color: ${({ theme }) => theme.colors.col040};
  }

  div {
    a {
      width: 100%;

      @media (min-width: 480px) {
        width: auto;
      }

      &:nth-child(2) {
        border: 1px solid ${({ theme }) => theme.colors.col040};
        color: ${({ theme }) => theme.colors.col040};

        &:hover {
          border-color: ${({ theme }) => theme.colors.col040};
          background-color: ${({ theme }) => theme.colors.col040};
          color: ${({ theme }) => theme.colors.col000};
        }
      }
    }
  }
`;

export const TrustbarSection = styled.section`
  position: relative;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.col000};
  padding: 0 16px;

  @media (min-width: 480px) {
    padding: 0 24px;
  }
`;

export const TrustbarContent = styled(SectionContent)`
  height: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 20px 0;
  align-content: space-between;
  justify-items: center;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    padding: 24px 0;
    gap: 24px;
  }

  > div {
    text-align: center;
    flex-direction: column;

    svg {
      font-size: 20px;
      color: ${({ theme }) => theme.colors.col010};
    }
    h3 {
      color: ${({ theme }) => theme.colors.col040};
      font-size: 10px;
      text-transform: uppercase;
    }
  }
`;

export const CategoriesSection = styled.section`
  position: relative;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.col100};
  padding: 0 16px;

  @media (min-width: 480px) {
    padding: 0 24px;
  }
`;

export const SectionHeader = styled.div`
  display: grid;
  gap: 8px;
  margin-bottom: 24px;
  text-align: center;

  @media (min-width: 768px) {
    margin-bottom: 32px;
  }

  h3 {
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.col010};
  }

  h2 {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: 22px;
    color: ${({ theme }) => theme.colors.col000};
    font-weight: 500;

    @media (min-width: 768px) {
      font-size: 26px;
    }
  }
`;

export const CategoriesGrid = styled.div`
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

export const CategoryTile = styled.a`
  position: relative;
  display: block;
  aspect-ratio: 3 / 4;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.col090};

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.75) 0%,
      transparent 55%
    );
  }

  .category-label {
    position: absolute;
    bottom: 12px;
    left: 12px;
    z-index: 2;

    @media (min-width: 768px) {
      bottom: 16px;
      left: 16px;
    }

    h3 {
      font-family: ${({ theme }) => theme.fonts.fontPrimary};
      font-size: 13px;
      color: ${({ theme }) => theme.colors.col040};

      @media (min-width: 768px) {
        font-size: 15px;
      }
    }

    span {
      font-size: 11px;
      color: ${({ theme }) => theme.colors.col033};
    }
  }
`;

export const TrustStatsSection = styled.section`
  width: 100%;
  padding: 0 16px;
  background-color: ${({ theme }) => theme.colors.col100};

  @media (min-width: 480px) {
    padding: 0 24px;
  }
`;

export const TrustStatsContent = styled(SectionContent)`
  > div {
    &:nth-of-type(2) {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      align-content: space-between;
      gap: 12px;

      @media (min-width: 600px) {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
      }

      @media (min-width: 1280px) {
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      }
    }
  }
`;

export const TrustStatBox = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.col040};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;

  @media (min-width: 1280px) {
    height: 145px;
  }

  > div {
    display: grid;
    height: fit-content;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  h2,
  svg {
    color: ${({ theme }) => theme.colors.col010};
  }
`;

export const TestimonialsSection = styled.section`
  width: 100%;
  padding: 0 16px;
  background-color: ${({ theme }) => theme.colors.col000};

  @media (min-width: 480px) {
    padding: 0 24px;
  }
`;

// Left info panel (stat/tagline/hashtag CTA) + right photo-card carousel.
// Stacks on mobile/tablet; becomes a two-column layout at desktop width.
export const TestimonialsGrid = styled(SectionContent)`
  display: grid;
  gap: 32px;
  padding: 56px 0;

  @media (min-width: 768px) {
    padding: 72px 0;
  }

  @media (min-width: 1280px) {
    grid-template-columns: 300px 1fr;
    gap: 60px;
    align-items: center;
    padding: 88px 0;
  }
`;

export const TestimonialsPanel = styled.div`
  display: grid;
  gap: 16px;
  text-align: center;
  justify-items: center;

  @media (min-width: 1280px) {
    text-align: left;
    justify-items: start;
  }

  .eyebrow {
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.col010};
  }

  .stat {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: 40px;
    font-weight: 500;
    line-height: 1.1;
    color: ${({ theme }) => theme.colors.col040};

    @media (min-width: 768px) {
      font-size: 52px;
    }

    @media (min-width: 1280px) {
      font-size: 44px;
    }
  }

  .tagline {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-style: italic;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.col033};
    max-width: 320px;

    @media (min-width: 768px) {
      font-size: 18px;
    }
  }

  .cta-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 4px;

    @media (min-width: 1280px) {
      align-items: flex-start;
    }
  }

  .hashtag {
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.col010};
  }

  .cta-button {
    display: inline-block;
    padding: 10px 24px;
    border-radius: 999px;
    border: 1px solid ${({ theme }) => theme.colors.col040};
    color: ${({ theme }) => theme.colors.col040};
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background-color: ${({ theme }) => theme.colors.col040};
      color: ${({ theme }) => theme.colors.col000};
    }
  }
`;

export const TestimonialNavRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 8px;
`;

export const TestimonialNavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.col060};
  background: none;
  color: ${({ theme }) => theme.colors.col040};
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    opacity 0.2s ease;

  svg {
    font-size: 14px;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    border-color: ${({ theme }) => theme.colors.col010};
    color: ${({ theme }) => theme.colors.col010};
  }
`;

export const TestimonialsCarouselArea = styled.div`
  display: grid;
  gap: 20px;
  min-width: 0;
`;

// Horizontal-scroll viewport with snap points -- shows a peek of the next
// card on mobile and multiple cards side by side on wider screens, matching
// the reference design's photo-card row rather than a single full-width slide.
export const TestimonialsCarouselViewport = styled.div`
  width: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TestimonialsTrack = styled.div`
  display: flex;
  gap: 16px;
  width: max-content;

  @media (min-width: 768px) {
    gap: 24px;
  }
`;

export const TestimonialCard = styled.article`
  scroll-snap-align: start;
  flex: 0 0 auto;
  width: 82vw;
  max-width: 320px;
  border: 1px solid ${({ theme }) => theme.colors.col060};
  border-radius: 16px;
  padding: 24px;
  display: grid;
  gap: 16px;
  background-color: ${({ theme }) => theme.colors.col020};

  @media (min-width: 768px) {
    width: 340px;
    padding: 28px;
  }
`;

export const TestimonialCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  h3 {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.col031};
  }
`;

export const TestimonialCardPhoto = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.col010};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .monogram {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: 18px;
    color: ${({ theme }) => theme.colors.col000};
  }
`;

export const TestimonialCardBody = styled.div`
  display: grid;
  gap: 10px;

  p {
    font-size: 14px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.col033};
  }

  .stars {
    display: flex;
    gap: 2px;

    svg {
      font-size: 13px;
      color: ${({ theme }) => theme.colors.col010};
    }
  }
`;

export const TestimonialDotsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;

  @media (min-width: 1280px) {
    justify-content: flex-start;
  }
`;

export const TestimonialDot = styled.button<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  border: none;
  padding: 0;
  cursor: pointer;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.col010 : theme.colors.col060};
  transform: scale(${({ $active }) => ($active ? 1.3 : 1)});
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
`;

// append to src/components/home/home.styles.ts

export const ProductsSection = styled.section`
  width: 100%;
  padding: 0 16px;
  background-color: ${({ theme }) => theme.colors.col040};

  @media (min-width: 480px) {
    padding: 0 24px;
  }
`;

export const ProductsSectionAlt = styled(ProductsSection)`
  background-color: ${({ theme }) => theme.colors.col100};
`;

export const ProductsSectionHeaderRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;

  @media (min-width: 768px) {
    margin-bottom: 32px;
  }

  > div {
    margin-bottom: 0;
  }

  a {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.col032};
    text-decoration: underline;
    white-space: nowrap;
  }
`;

export const ProductsGrid = styled.div`
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

export const ProductCard = styled.a`
  display: block;

  .product-image-wrap {
    position: relative;
    aspect-ratio: 3 / 4;
    border-radius: 8px;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.col090};
    margin-bottom: 10px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .product-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 2;
    font-size: 9px;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 3px 8px;
    font-weight: 500;
  }

  .badge-new {
    background-color: ${({ theme }) => theme.colors.col000};
    color: ${({ theme }) => theme.colors.col040};
  }

  .badge-sale {
    background-color: ${({ theme }) => theme.colors.col070};
    color: ${({ theme }) => theme.colors.col000};
  }

  .product-rating {
    font-size: 10px;
    color: ${({ theme }) => theme.colors.col070};
    margin-bottom: 4px;

    span {
      color: ${({ theme }) => theme.colors.col032};
      margin-left: 4px;
    }
  }

  h3 {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.col000};
    margin-bottom: 4px;
  }

  .product-price {
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.col000};
  }

  .price-old {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.col032};
    text-decoration: line-through;
    margin-right: 6px;
  }

  .price-range-label {
    font-size: 11px;
    color: ${({ theme }) => theme.colors.col032};
    font-weight: 400;
    margin-right: 4px;
  }
`;

// append to src/components/home/home.styles.ts

export const SaleBanner = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background-color: ${({ theme }) => theme.colors.col000};
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    padding: 20px 24px;
    margin-bottom: 24px;
  }

  p {
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    font-style: italic;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.col033};

    @media (min-width: 768px) {
      font-size: 15px;
    }
  }

  span {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${({ theme }) => theme.colors.col070};
    border: 1px solid ${({ theme }) => theme.colors.col070};
    padding: 6px 14px;
    white-space: nowrap;
  }
`;

// ---------------------------------------------------------------------------
// Homepage gallery (masonry-style, exactly 5 images — see
// getGalleryImages.ts / gallerySettings.tsx)
// ---------------------------------------------------------------------------

export const GallerySection = styled.section`
  width: 100%;
  padding: 0 16px;
  background-color: ${({ theme }) => theme.colors.col040};

  @media (min-width: 480px) {
    padding: 0 24px;
  }
`;

export const GalleryMosaicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;

  .gallery-item {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.col090};
    aspect-ratio: 1 / 1;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .gallery-item-large {
    grid-column: span 2;
    aspect-ratio: 16 / 10;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 220px);
    gap: 12px;

    .gallery-item {
      aspect-ratio: unset;
      height: 100%;
    }

    .gallery-item-large {
      grid-column: span 2;
      grid-row: span 2;
      aspect-ratio: unset;
    }
  }
`;

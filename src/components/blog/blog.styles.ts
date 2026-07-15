"use client";
import styled from "styled-components";

// Mobile-first breakpoints, matching shop.styles.ts (480/768/1024/1280px).

export const BlogSection = styled.section`
  width: 100%;
  padding: 24px 16px 64px;
  background-color: ${({ theme }) => theme.colors.col040};

  @media (min-width: 480px) {
    padding: 24px 24px 64px;
  }
`;

export const BlogContainer = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
`;

export const BlogHeaderRow = styled.div`
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

export const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
`;

export const BlogCard = styled.a`
  display: grid;
  gap: 12px;
  color: inherit;

  .blog-image-wrap {
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.col090};

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }

  &:hover .blog-image-wrap img {
    transform: scale(1.04);
  }

  .blog-date {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.col032};
  }

  h2 {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: 18px;
    color: ${({ theme }) => theme.colors.col000};
    line-height: 1.3;
  }

  p {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.col032};
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const EmptyBlogBox = styled.div`
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
`;

// ---------------------------------------------------------------------------
// Detail page
// ---------------------------------------------------------------------------

export const BlogDetailSection = styled.section`
  width: 100%;
  padding: 24px 16px 64px;
  background-color: ${({ theme }) => theme.colors.col040};

  @media (min-width: 480px) {
    padding: 24px 24px 64px;
  }
`;

export const BlogDetailContainer = styled.article`
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
`;

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

export const BlogDetailHeader = styled.header`
  margin-bottom: 24px;

  .blog-date {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.col032};
    margin-bottom: 8px;
  }

  h1 {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    font-size: 28px;
    color: ${({ theme }) => theme.colors.col000};
    line-height: 1.25;

    @media (min-width: 768px) {
      font-size: 36px;
    }
  }
`;

export const BlogCoverImage = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.col090};
  margin-bottom: 24px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

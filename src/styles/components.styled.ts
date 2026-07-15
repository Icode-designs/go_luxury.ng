"use client";
import styled from "styled-components";

export const FlexBox = styled.div<{
  $gap?: number;
  $justify?: string;
  $width?: string | number;
  $height?: string | number;
  $background?: string;
}>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ $gap }) => `${$gap}px` || "8px"};
  justify-content: ${({ $justify }) => $justify || "start"};
  align-items: center;
  width: ${({ $width }) =>
    $width && typeof $width === "string"
      ? $width
      : typeof $width === "number"
        ? `${$width}px`
        : "fit-content"};
  height: ${({ $height }) =>
    $height && typeof $height === "string"
      ? $height
      : typeof $height === "number"
        ? `${$height}px`
        : "fit-content"};

  background-color: ${({ $background }) => $background || "transparent"};
`;

// Typographic rules for admin-authored rich text (currently Terms &
// Policies) rendered via dangerouslySetInnerHTML -- the tags here match
// exactly what sanitizeRichText allows through, so nothing here is
// decorative-only dead CSS for tags that can never appear.
export const RichTextContent = styled.div`
  font-size: 15px;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.col030};

  p {
    margin-bottom: 16px;
  }

  h2,
  h3 {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    color: ${({ theme }) => theme.colors.col000};
    margin: 28px 0 12px;
  }

  h2 {
    font-size: 22px;
  }

  h3 {
    font-size: 18px;
  }

  ul,
  ol {
    margin: 0 0 16px 22px;
  }

  li {
    margin-bottom: 6px;
  }

  blockquote {
    margin: 0 0 16px;
    padding-left: 16px;
    border-left: 3px solid ${({ theme }) => theme.colors.col010};
    color: ${({ theme }) => theme.colors.col032};
  }

  a {
    color: ${({ theme }) => theme.colors.col010};
    text-decoration: underline;
  }

  strong,
  b {
    font-weight: 600;
  }
`;

// Mobile-first: compact section padding on small screens, growing at
// tablet (768px) and desktop (1280px) breakpoints.
export const SectionContent = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 48px 0;

  @media (min-width: 768px) {
    padding: 56px 0;
  }

  @media (min-width: 1280px) {
    padding: 70px 0;
  }
`;

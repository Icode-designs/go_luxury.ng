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

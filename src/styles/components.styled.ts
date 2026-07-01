import styled from "styled-components";

export const FlexBox = styled.div<{
  $gap?: number;
  $justify?: string;
  $width?: string | number;
  $height?: string | number;
  $background?: string;
}>`
  display: flex;
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

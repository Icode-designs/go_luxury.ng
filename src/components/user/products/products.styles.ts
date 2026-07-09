// src/components/admin/products/products.styles.ts
"use client";
import { StyledButton } from "@/components/ui/button";
import Link from "next/link";
import styled from "styled-components";

export const PageHeaderWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  h1 {
    font-size: 22px;
    font-weight: 500;
  }

  a {
    background-color: ${({ theme }) => theme.colors.col070};
    color: ${({ theme }) => theme.colors.col040};
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 13px;
  }
`;

export const ToolbarWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  input[type="text"] {
    padding: 8px 14px;
    border: 1px solid ${({ theme }) => theme.colors.col033};
    border-radius: 8px;
    width: 260px;
  }

  > div {
    display: flex;
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
  }

  tbody td {
    padding: 12px 16px;
    font-size: 13px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.col033};
    vertical-align: middle;

    a {
      color: ${({ theme }) => theme.colors.col000};
    }
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

export const RowThumb = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 6px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.col090};
  }
`;

export const StatusPill = styled.span<{ $status: "active" | "draft" }>`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 20px;
  background-color: ${({ $status }) =>
    $status === "active" ? "#E1F5EE" : "#F3F0EC"};
  color: ${({ $status }) => ($status === "active" ? "#0F6E56" : "#9A8880")};
`;

export const ActionsMenu = styled.div`
  position: relative;
`;

export const ActionsMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  cursor: pointer;
`;

export const ActionsDropdown = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  background-color: ${({ theme }) => theme.colors.col040};
  border: 1px solid ${({ theme }) => theme.colors.col033};
  border-radius: 8px;
  min-width: 130px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  a {
    padding: 10px 14px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.col000};
  }
`;

export const EmptyStateWrap = styled.div`
  text-align: center;
  padding: 60px 20px;
  background-color: ${({ theme }) => theme.colors.col040};
  border-radius: 12px;

  a {
    color: #745a27;
    font-size: 13px;
    text-decoration: underline;
  }
`;

export const StyledSelect = styled.select`
  background-color: ${({ theme }) => theme.colors.col040};
  border-radius: 8px;
  padding: 8px 12px;
  width: 100%;
  font-size: 16px;
  border: none;
`;

export const FilterBtn = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.col040};
  justify-content: center;
  gap: 10px;
  svg,
  h3 {
    font-size: 16px;
  }
`;

export const StyledLink = styled(Link)`
  padding: 12px 24px;
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  border: none;
  max-width: 200px;
  font-family: ${({ theme }) => theme.fonts.fontPrimary};
  font-size: 16px;
  font-weight: 400;
  transition: all 0.3s ease-in-out;

  background-color: ${({ theme }) => theme.colors.col070};
  color: ${({ theme }) => theme.colors.col040};
  border-radius: 8px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.col000};
    cursor: pointer;
  }
`;

export const ProductForm = styled.form`
  width: 100%;
  background-color: transparent;
  height: fit-content;
  display: grid;
  gap: 24px;

  fieldset {
    background-color: ${({ theme }) => theme.colors.col040};
    padding: 24px;
    border-radius: 12px;
    display: grid;
    gap: 24px;
    width: 100%;
    height: fit-content;

    h2 {
      text-transform: capitalize;
      font-size: 24px;
      font-family: ${({ theme }) => theme.fonts.fontPrimary};
      font-weight: 500;
    }

    > div {
      width: 100%;
      &:first-of-type {
        padding-bottom: 16px;
        border-bottom: 1px ${({ theme }) => theme.colors.col033} solid;
        font-family: ${({ theme }) => theme.fonts.fontPrimary};
        text-transform: uppercase;
      }
    }
  }
`;

export const ProductMediaBox = styled.div`
  display: grid;
  gap: 16px;
  grid-template-areas:
    "primary primary secondary1 secondary2"
    "primary primary secondary3 secondary4";

  @media (max-width: 768px) {
    grid-template-areas:
      "primary primary"
      "secondary1 secondary2"
      "secondary3 secondary4";
  }

  /* ── Individual tile ─────────────────────────────────────────────────── */
  .media-tile {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1.5px dashed ${({ theme }) => theme.colors.col033};
    border-radius: 8px;
    min-height: 220px;
    min-width: 152px;
    height: 100%;
    width: 100%;
    cursor: pointer;
    overflow: hidden;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease;
    outline: none;

    /* Hide the file input */
    input[type="file"] {
      display: none;
    }

    /* ── Drag-over highlight ── */
    &.drag-over {
      border-color: ${({ theme }) => theme.colors.col070};
      background-color: ${({ theme }) => theme.colors.col090};
    }

    /* ── Image preview ── */
    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      border-radius: 8px;
    }

    /* ── Remove (×) button – always visible on top-right ── */
    .remove-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 20;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.colors.col120};
      opacity: 0;
      transition: opacity 0.2s ease;
      cursor: pointer;

      svg {
        font-size: 16px;
        color: ${({ theme }) => theme.colors.col040};
      }
    }

    /* ── "Replace" overlay – shown on hover when image is present ── */
    .replace-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.45);
      border-radius: 8px;
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 10;

      svg {
        font-size: 32px;
        color: ${({ theme }) => theme.colors.col040};
      }

      span {
        font-size: 13px;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.col040};
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    /* Show overlay + remove button when hovering a tile that HAS an image */
    &.has-image:hover {
      .replace-overlay {
        opacity: 1;
      }
      .remove-btn {
        opacity: 1;
      }
    }

    /* ── Empty-state content ── */
    .empty-state {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
      justify-content: center;
      pointer-events: none;

      svg {
        font-size: 40px;
        color: ${({ theme }) => theme.colors.col032};
        transition: transform 0.3s ease;
      }

      .hint-text {
        font-size: 11px;
        color: ${({ theme }) => theme.colors.col032};
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    &:hover .empty-state svg {
      transform: scale(1.1);
    }

    /* ── Grid placement ── */
    &:nth-of-type(1) {
      grid-area: primary;

      /* "Primary Image" badge */
      &::after {
        content: "Primary Image";
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: ${({ theme }) => theme.colors.col070};
        border-radius: 24px;
        padding: 4px 8px;
        color: ${({ theme }) => theme.colors.col040};
        font-size: 12px;
        position: absolute;
        text-transform: uppercase;
        font-weight: 600;
        top: 8px;
        left: 8px;
        z-index: 25;
      }
    }
    &:nth-of-type(2) {
      grid-area: secondary1;
    }
    &:nth-of-type(3) {
      grid-area: secondary2;
    }
    &:nth-of-type(4) {
      grid-area: secondary3;
    }
    &:nth-of-type(5) {
      grid-area: secondary4;
    }
  }
`;

export const StyledFormBtn = styled(StyledButton)<{
  $color?: string;
  $size?: string;
}>`
  color: ${({ $color, theme }) => ($color ? $color : theme.colors.col000)};
  font-weight: 500;
  text-transform: capitalize;
  font-size: ${({ $size }) => ($size ? $size : "12px")};
  padding: 8px 16px;

  svg {
    font-size: inherit;
    font-weight: inherit;
  }
`;

// append to src/components/user/user.styles.ts

export const PriceToggleRow = styled.div`
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.col010};
    cursor: pointer;
  }
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${({ theme }) => theme.colors.col070};
  }
`;

// -- Per-product attribute values (replaces the old variant-grid UI) ------
export const AttributeRowBox = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 16px;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.col090};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.col033};

  > div {
    width: fit-content;

    h3 {
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 4px;
      text-transform: uppercase;
    }

    input {
      border-radius: 8px;
      padding: 8px 16px;
      border: 1px solid ${({ theme }) => theme.colors.col033};
    }

    &:nth-of-type(1) input {
      width: 200px;
    }

    &:nth-of-type(2) input {
      width: 240px;
    }
  }

  > button {
    transform: translateY(-4px);
  }
`;

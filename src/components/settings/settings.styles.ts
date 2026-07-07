// src/components/settings/settings.styles.ts
"use client";
import styled from "styled-components";

export const CategoryImageTileWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1.5px dashed ${({ theme }) => theme.colors.col033};
  border-radius: 8px;
  width: 96px;
  height: 96px;
  cursor: pointer;
  overflow: hidden;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
  outline: none;
  flex-shrink: 0;

  input[type="file"] {
    display: none;
  }

  &.drag-over {
    border-color: ${({ theme }) => theme.colors.col070};
    background-color: ${({ theme }) => theme.colors.col090};
  }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .remove-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.col120};
    opacity: 0;
    transition: opacity 0.2s ease;

    svg {
      font-size: 13px;
      color: ${({ theme }) => theme.colors.col040};
    }
  }

  .replace-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.45);
    opacity: 0;
    transition: opacity 0.2s ease;

    svg {
      font-size: 18px;
      color: ${({ theme }) => theme.colors.col040};
    }
    span {
      font-size: 9px;
      color: ${({ theme }) => theme.colors.col040};
      text-transform: uppercase;
    }
  }

  &.has-image:hover {
    .replace-overlay {
      opacity: 1;
    }
    .remove-btn {
      opacity: 1;
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    justify-content: center;
    pointer-events: none;

    svg {
      font-size: 22px;
      color: ${({ theme }) => theme.colors.col032};
    }
    .hint-text {
      font-size: 9px;
      color: ${({ theme }) => theme.colors.col032};
      text-align: center;
      text-transform: uppercase;
    }
  }
`;

export const CategoryListWrap = styled.div`
  display: grid;
  gap: 16px;
`;

export const CategoryRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.col033};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.col040};
`;

export const CategoryRowInfo = styled.div`
  flex: 1;
  display: grid;
  gap: 10px;

  input[type="text"] {
    padding: 8px 12px;
    border: 1px solid ${({ theme }) => theme.colors.col033};
    border-radius: 6px;
    font-size: 14px;
    max-width: 260px;
  }
`;

export const CategoryStatusPill = styled.span<{
  $status: "active" | "archived";
}>`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 20px;
  width: fit-content;
  background-color: ${({ $status }) =>
    $status === "active" ? "#E1F5EE" : "#F3F0EC"};
  color: ${({ $status }) => ($status === "active" ? "#0F6E56" : "#9A8880")};
`;

export const AttributeTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`;

export const AttributeTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  padding: 4px 10px;
  background-color: ${({ theme }) => theme.colors.col090};
  border: 1px solid ${({ theme }) => theme.colors.col033};
  border-radius: 20px;

  button {
    display: flex;
    cursor: pointer;
    svg {
      font-size: 12px;
      color: ${({ theme }) => theme.colors.col032};
    }
  }
`;

export const AddAttributeInput = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;

  input {
    padding: 5px 10px;
    border: 1px dashed ${({ theme }) => theme.colors.col033};
    border-radius: 20px;
    font-size: 12px;
    width: 140px;
  }
  button {
    font-size: 12px;
    color: #745a27;
    cursor: pointer;
  }
`;

export const CategoryRowActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;

  button {
    font-size: 12px;
    cursor: pointer;
    background: none;
    border: none;
  }
`;

export const NewCategoryRow = styled.div`
  display: flex;
  gap: 10px;

  input {
    flex: 1;
    padding: 10px 14px;
    border: 1px solid ${({ theme }) => theme.colors.col033};
    border-radius: 8px;
  }
`;

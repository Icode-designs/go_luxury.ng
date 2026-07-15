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

// ---------------------------------------------------------------------------
// Settings hub
// ---------------------------------------------------------------------------

export const SettingsHubGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
`;

export const SettingsHubCard = styled.div`
  display: grid;
  gap: 6px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.col033};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.col040};
  color: inherit;

  &:hover {
    border-color: ${({ theme }) => theme.colors.col010};
  }

  svg {
    font-size: 20px;
    color: ${({ theme }) => theme.colors.col010};
    margin-bottom: 4px;
  }

  h3 {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.col000};
  }

  p {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.col032};
  }
`;

export const SettingsSectionHeading = styled.h2`
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.col032};
  padding-top: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.col033};

  &:first-of-type {
    padding-top: 0;
    border-top: none;
  }
`;

export const SettingsBackLink = styled.div`
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

// ---------------------------------------------------------------------------
// Generic image upload tile (used by hero + gallery settings)
// ---------------------------------------------------------------------------

export const ImageUploadTileWrap = styled.div<{ $size?: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1.5px dashed ${({ theme }) => theme.colors.col033};
  border-radius: 8px;
  width: ${({ $size }) => $size ?? 96}px;
  height: ${({ $size }) => $size ?? 96}px;
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
    padding: 8px;

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

export const GallerySlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 20px;
`;

export const GallerySlotBox = styled.div`
  display: grid;
  gap: 8px;
  justify-items: center;
  text-align: center;

  .slot-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${({ theme }) => theme.colors.col032};
  }
`;

// ---------------------------------------------------------------------------
// Rich text editor (Terms & Policies)
// ---------------------------------------------------------------------------

export const RichTextEditorWrap = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.col033};
  border-radius: 8px;
  overflow: hidden;
`;

export const RichTextToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.col090};
  border-bottom: 1px solid ${({ theme }) => theme.colors.col033};

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 30px;
    height: 30px;
    padding: 0 6px;
    border-radius: 6px;
    border: none;
    background: none;
    color: ${({ theme }) => theme.colors.col000};
    cursor: pointer;
    font-size: 15px;

    &:hover {
      background-color: ${({ theme }) => theme.colors.col100};
    }
  }

  button.text-btn {
    font-size: 12px;
    font-weight: 600;
  }

  .divider {
    width: 1px;
    height: 20px;
    background-color: ${({ theme }) => theme.colors.col033};
    margin: 0 4px;
  }
`;

export const RichTextSurface = styled.div`
  min-height: 320px;
  max-height: 640px;
  overflow-y: auto;
  padding: 16px 18px;
  font-size: 14px;
  line-height: 1.65;
  color: ${({ theme }) => theme.colors.col000};
  background-color: ${({ theme }) => theme.colors.col040};
  outline: none;

  &:empty::before {
    content: attr(data-placeholder);
    color: ${({ theme }) => theme.colors.col032};
  }

  p {
    margin-bottom: 12px;
  }

  h2,
  h3 {
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    margin: 16px 0 8px;
  }

  h2 {
    font-size: 20px;
  }

  h3 {
    font-size: 17px;
  }

  ul,
  ol {
    margin: 0 0 12px 20px;
  }

  blockquote {
    margin: 0 0 12px;
    padding-left: 14px;
    border-left: 3px solid ${({ theme }) => theme.colors.col010};
    color: ${({ theme }) => theme.colors.col032};
  }

  a {
    color: ${({ theme }) => theme.colors.col010};
    text-decoration: underline;
  }
`;

export const SettingsFormBox = styled.div`
  display: grid;
  gap: 16px;
  max-width: 560px;

  label {
    display: block;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: ${({ theme }) => theme.colors.col032};
    margin-bottom: 6px;
  }

  input[type="text"],
  textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid ${({ theme }) => theme.colors.col033};
    border-radius: 8px;
    font-size: 13px;
    font-family: inherit;
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }

  button[type="submit"] {
    justify-self: start;
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    background-color: ${({ theme }) => theme.colors.col000};
    color: ${({ theme }) => theme.colors.col040};
    font-size: 13px;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

"use client";
import styled from "styled-components";
import type { ReviewStatus } from "@/lib/reviews/getReviewsForAdmin";

export const ToolbarWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;

  input[type="text"] {
    padding: 8px 14px;
    border: 1px solid ${({ theme }) => theme.colors.col033};
    border-radius: 8px;
    width: 260px;
  }

  > div {
    display: flex;
    flex-wrap: wrap;
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

const STATUS_COLORS: Record<ReviewStatus, { bg: string; fg: string }> = {
  pending: { bg: "#F3F0EC", fg: "#9A8880" },
  approved: { bg: "#E1F5EE", fg: "#0F6E56" },
  rejected: { bg: "#FBEAEA", fg: "#93000A" },
};

export const ReviewStatusPill = styled.span<{ $status: ReviewStatus }>`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 20px;
  white-space: nowrap;
  background-color: ${({ $status }) => STATUS_COLORS[$status].bg};
  color: ${({ $status }) => STATUS_COLORS[$status].fg};
`;

export const ReviewCardsList = styled.div`
  display: grid;
  gap: 16px;
`;

export const ReviewCard = styled.div`
  background-color: ${({ theme }) => theme.colors.col040};
  border: 1px solid ${({ theme }) => theme.colors.col033};
  border-radius: 12px;
  padding: 20px;
  display: grid;
  gap: 10px;
`;

export const ReviewCardHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  a {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.col000};
  }

  .meta {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.col032};
  }
`;

export const StarRow = styled.div`
  display: flex;
  gap: 2px;
  color: ${({ theme }) => theme.colors.col010};
  font-size: 14px;
`;

export const ReviewBody = styled.div`
  display: grid;
  gap: 4px;

  h3 {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.col000};
  }

  p {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.col032};
    line-height: 1.5;
  }
`;

export const ReviewActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  button {
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.colors.col033};
    background: none;
    color: ${({ theme }) => theme.colors.col000};

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  button.approve {
    border-color: #0f6e56;
    color: #0f6e56;
  }

  button.reject {
    border-color: #93000a;
    color: #93000a;
  }
`;

export const EmptyStateBox = styled.div`
  padding: 48px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.col032};
  font-size: 13px;
`;

export const InlineNote = styled.span<{ $variant?: "error" | "success" }>`
  font-size: 12px;
  color: ${({ theme, $variant }) =>
    $variant === "error"
      ? theme.colors.col120
      : $variant === "success"
        ? "#0F6E56"
        : theme.colors.col032};
`;

// ---------------------------------------------------------------------------
// Homepage testimonials management (5 fixed slots — mirrors the gallery's
// GallerySlotGrid/GallerySlotBox pattern in settings.styles.ts).
// ---------------------------------------------------------------------------

export const TestimonialSlotGrid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const TestimonialSlotCard = styled.div`
  background-color: ${({ theme }) => theme.colors.col040};
  border: 1px solid ${({ theme }) => theme.colors.col033};
  border-radius: 12px;
  padding: 20px;
  display: grid;
  gap: 12px;
`;

export const TestimonialSlotHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  .slot-label {
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.col000};
  }
`;

export const TestimonialStatusPill = styled.span<{ $isPlaceholder: boolean }>`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 20px;
  white-space: nowrap;
  background-color: ${({ $isPlaceholder }) =>
    $isPlaceholder ? "#F3F0EC" : "#E1F5EE"};
  color: ${({ $isPlaceholder }) => ($isPlaceholder ? "#9A8880" : "#0F6E56")};
`;

export const TestimonialPhotoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .photo-hint {
    display: block;
    font-size: 11px;
    color: ${({ theme }) => theme.colors.col032};
    margin-bottom: 4px;
  }
`;

export const TestimonialForm = styled.div`
  display: grid;
  gap: 10px;

  label {
    display: grid;
    gap: 4px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.col032};
  }

  input,
  textarea,
  select {
    padding: 8px 10px;
    border: 1px solid ${({ theme }) => theme.colors.col033};
    border-radius: 8px;
    font-size: 13px;
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    color: ${({ theme }) => theme.colors.col000};
    resize: vertical;
  }

  .row {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr 1fr;
  }
`;

export const TestimonialSlotActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  button {
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.colors.col033};
    background: none;
    color: ${({ theme }) => theme.colors.col000};

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  button.save {
    border-color: ${({ theme }) => theme.colors.col010};
    color: ${({ theme }) => theme.colors.col010};
  }

  button.clear {
    border-color: #93000a;
    color: #93000a;
  }
`;

"use client";
import { useMemo, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import type { AdminReviewRow, ReviewStatus } from "@/lib/reviews/getReviewsForAdmin";
import { AdminHeaderInputBox } from "../user.styles";
import {
  ToolbarWrap,
  FilterPill,
  ReviewCardsList,
  EmptyStateBox,
} from "./reviews.styles";
import ReviewCard from "./reviewCard";

const STATUS_OPTIONS: { value: ReviewStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

interface ReviewsListProps {
  initialReviews: AdminReviewRow[];
}

const ReviewsList = ({ initialReviews }: ReviewsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "all">("pending");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return initialReviews.filter((review) => {
      const matchesSearch =
        term.length === 0 ||
        review.productName.toLowerCase().includes(term) ||
        (review.customerName?.toLowerCase().includes(term) ?? false) ||
        (review.customerEmail?.toLowerCase().includes(term) ?? false);
      const matchesStatus = statusFilter === "all" || review.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [initialReviews, searchTerm, statusFilter]);

  return (
    <div>
      <ToolbarWrap>
        <AdminHeaderInputBox>
          <div>
            <input
              type="text"
              placeholder="Search by product or customer…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoIosSearch />
          </div>
        </AdminHeaderInputBox>

        <div>
          {STATUS_OPTIONS.map((opt) => (
            <FilterPill
              key={opt.value}
              type="button"
              $active={statusFilter === opt.value}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </FilterPill>
          ))}
        </div>
      </ToolbarWrap>

      {filtered.length === 0 ? (
        <EmptyStateBox>
          {initialReviews.length === 0
            ? "No reviews yet."
            : "No reviews match your search/filter."}
        </EmptyStateBox>
      ) : (
        <ReviewCardsList>
          {filtered.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </ReviewCardsList>
      )}
    </div>
  );
};

export default ReviewsList;

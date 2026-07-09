"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AdminReviewRow, ReviewStatus } from "@/lib/reviews/getReviewsForAdmin";
import {
  ReviewCard as ReviewCardBox,
  ReviewCardHeader,
  StarRow,
  ReviewBody,
  ReviewActionsRow,
  ReviewStatusPill,
  InlineNote,
} from "./reviews.styles";

// Status changes write directly from the browser client, matching the
// order-status and product-archive/reactivate patterns elsewhere in the
// admin section — enforcement is the "Admins manage reviews" RLS policy
// (is_admin()), not this component.
interface ReviewCardProps {
  review: AdminReviewRow;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [note, setNote] = useState<{ text: string; variant: "error" | "success" } | null>(
    null,
  );
  const router = useRouter();

  async function setStatus(status: ReviewStatus) {
    setIsSaving(true);
    setNote(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("reviews")
      .update({ status })
      .eq("id", review.id);

    setIsSaving(false);

    if (error) {
      console.error("[ReviewCard] status update error:", error.message);
      setNote({ text: "Failed to update. Please try again.", variant: "error" });
      return;
    }

    router.refresh();
  }

  const createdDate = new Date(review.createdAt).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <ReviewCardBox>
      <ReviewCardHeader>
        <div>
          <Link href={`/product/${review.productId}`}>{review.productName}</Link>
          <div className="meta">
            {review.customerName ?? "Unknown"} · {review.customerEmail ?? "—"} ·{" "}
            {createdDate}
          </div>
        </div>
        <ReviewStatusPill $status={review.status}>{review.status}</ReviewStatusPill>
      </ReviewCardHeader>

      <StarRow aria-label={`${review.rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} aria-hidden="true">
            {n <= review.rating ? "★" : "☆"}
          </span>
        ))}
      </StarRow>

      <ReviewBody>
        {review.title && <h3>{review.title}</h3>}
        <p>{review.comment}</p>
      </ReviewBody>

      <ReviewActionsRow>
        <button
          type="button"
          className="approve"
          disabled={isSaving || review.status === "approved"}
          onClick={() => setStatus("approved")}
        >
          Approve
        </button>
        <button
          type="button"
          className="reject"
          disabled={isSaving || review.status === "rejected"}
          onClick={() => setStatus("rejected")}
        >
          Reject
        </button>
        {review.status !== "pending" && (
          <button
            type="button"
            disabled={isSaving}
            onClick={() => setStatus("pending")}
          >
            Revert to pending
          </button>
        )}
        {note && <InlineNote $variant={note.variant}>{note.text}</InlineNote>}
      </ReviewActionsRow>
    </ReviewCardBox>
  );
};

export default ReviewCard;

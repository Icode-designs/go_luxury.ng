import Link from "next/link";
import { getProductReviews } from "@/lib/reviews/getProductReviews";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import ReviewForm from "./reviewForm";
import {
  ReviewsWrapper,
  SummaryRow,
  StarRow,
  ReviewsList,
  ReviewCard,
  ReviewMeta,
  NoReviewsNote,
  LoginPrompt,
} from "./reviews.styles";

interface ReviewsSectionProps {
  productId: string;
}

function StarDisplay({ rating, size }: { rating: number; size?: number }) {
  const rounded = Math.round(rating);
  return (
    <StarRow $size={size} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((value) => (
        <span key={value}>{value <= rounded ? "★" : "☆"}</span>
      ))}
    </StarRow>
  );
}

const ReviewsSection = async ({ productId }: ReviewsSectionProps) => {
  const [{ reviews, averageRating, reviewCount }, user] = await Promise.all([
    getProductReviews(productId),
    getCurrentUser(),
  ]);

  const canReview = !!user && user.role === "customer" && !!user.customer;

  return (
    <ReviewsWrapper id="reviews">
      <h2>Reviews</h2>

      <SummaryRow>
        {averageRating !== null ? (
          <>
            <span className="average">{averageRating.toFixed(1)}</span>
            <StarDisplay rating={averageRating} size={20} />
            <span className="count">
              Based on {reviewCount} review{reviewCount === 1 ? "" : "s"}
            </span>
          </>
        ) : (
          <span className="count">No reviews yet — be the first.</span>
        )}
      </SummaryRow>

      {reviews.length > 0 && (
        <ReviewsList>
          {reviews.map((review) => (
            <ReviewCard key={review.id}>
              <StarDisplay rating={review.rating} />
              {review.title && <h3>{review.title}</h3>}
              <p>{review.comment}</p>
              <ReviewMeta>
                <span className="reviewer-name">{review.reviewerName}</span>
                <span>
                  {new Date(review.createdAt).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </ReviewMeta>
            </ReviewCard>
          ))}
        </ReviewsList>
      )}

      {reviews.length === 0 && (
        <NoReviewsNote>
          This product doesn&apos;t have any reviews yet.
        </NoReviewsNote>
      )}

      {canReview ? (
        <ReviewForm productId={productId} />
      ) : (
        <LoginPrompt>
          <Link href={`/login?returnTo=${encodeURIComponent(`/product/${productId}#reviews`)}`}>
            Log in
          </Link>{" "}
          to write a review.
        </LoginPrompt>
      )}
    </ReviewsWrapper>
  );
};

export default ReviewsSection;

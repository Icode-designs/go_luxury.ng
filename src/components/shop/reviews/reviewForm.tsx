"use client";
import { useActionState, useState, useTransition } from "react";
import Button from "@/components/ui/button";
import {
  submitReviewAction,
  type SubmitReviewState,
} from "@/lib/reviews/submitReview";
import {
  ReviewFormBox,
  StarPickerButton,
  StarRow,
  FormNotice,
  FieldErrorText,
} from "./reviews.styles";

interface ReviewFormProps {
  productId: string;
}

const initialState: SubmitReviewState = { status: "idle" };

const ReviewForm = ({ productId }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(submitReviewAction, initialState);

  const fieldError = (field: string): string | undefined =>
    state.status === "error" ? state.fieldErrors?.[field]?.[0] : undefined;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("productId", productId);
    formData.set("rating", String(rating));

    startTransition(() => {
      formAction(formData);
    });
  };

  if (state.status === "success") {
    return (
      <FormNotice role="status" $variant="success">
        Thanks for your review! It will appear here once it&apos;s been
        approved.
      </FormNotice>
    );
  }

  return (
    <ReviewFormBox onSubmit={handleSubmit} noValidate>
      <h3>Write a review</h3>

      {state.status === "error" && (
        <FormNotice role="alert" $variant="error">
          {state.message}
        </FormNotice>
      )}

      {/* Honeypot — hidden from real users, catches simple bots */}
      <input
        type="text"
        name="website"
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: "absolute", left: "-9999px" }}
      />

      <div>
        <label>Your rating</label>
        <StarRow $size={26} role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <StarPickerButton
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              $filled={value <= rating}
              onClick={() => setRating(value)}
            >
              ★
            </StarPickerButton>
          ))}
        </StarRow>
        {fieldError("rating") && (
          <FieldErrorText role="alert">{fieldError("rating")}</FieldErrorText>
        )}
      </div>

      <div>
        <label htmlFor="review-title">Title (optional)</label>
        <input id="review-title" type="text" name="title" maxLength={80} />
        {fieldError("title") && (
          <FieldErrorText role="alert">{fieldError("title")}</FieldErrorText>
        )}
      </div>

      <div>
        <label htmlFor="review-comment">Your review</label>
        <textarea
          id="review-comment"
          name="comment"
          maxLength={1000}
          required
        />
        {fieldError("comment") && (
          <FieldErrorText role="alert">{fieldError("comment")}</FieldErrorText>
        )}
      </div>

      <Button variant="filled-dark" type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </ReviewFormBox>
  );
};

export default ReviewForm;

import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import ReviewsList from "@/components/user/reviews/reviewsList";
import { getReviewsForAdmin } from "@/lib/reviews/getReviewsForAdmin";
import React from "react";

const page = async () => {
  const reviews = await getReviewsForAdmin();
  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Reviews</h1>
      </AdminHeaderBox>
      <div className="content">
        <ReviewsList initialReviews={reviews} />
      </div>
    </AdminContentBox>
  );
};

export default page;

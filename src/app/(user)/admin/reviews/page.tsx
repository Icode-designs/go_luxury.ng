import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import ReviewsList from "@/components/user/reviews/reviewsList";
import TestimonialsManagement from "@/components/user/reviews/testimonialsManagement";
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

      <AdminHeaderBox style={{ marginTop: 40 }}>
        <h1>Homepage Testimonials</h1>
      </AdminHeaderBox>
      <div className="content">
        <TestimonialsManagement />
      </div>
    </AdminContentBox>
  );
};

export default page;

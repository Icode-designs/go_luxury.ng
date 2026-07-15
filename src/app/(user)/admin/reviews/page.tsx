import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import ReviewsList from "@/components/user/reviews/reviewsList";
import { getReviewsForAdmin } from "@/lib/reviews/getReviewsForAdmin";
import React from "react";

// Homepage testimonial slots moved to /admin/setting/testimonials, alongside
// the testimonials panel copy (stat/tagline/hashtag) -- this page is now
// scoped to customer product reviews only, matching the settings hub
// convention of keeping homepage-content editing under /admin/setting/*.
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

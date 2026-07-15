import Link from "next/link";
import TestimonialsManagement from "@/components/user/reviews/testimonialsManagement";
import TestimonialsPanelSettings from "@/components/settings/testimonialsPanelSettings";
import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import {
  SettingsBackLink,
  SettingsSectionHeading,
} from "@/components/settings/settings.styles";
import React from "react";

// Both the 5 testimonial slots (moved here from /admin/reviews) and the
// surrounding panel copy (stat/tagline/hashtag) live on one page -- they're
// two halves of the same homepage section, matching the settings hub
// convention of grouping homepage-content editing under /admin/setting/*.
const page = () => {
  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Testimonials</h1>
      </AdminHeaderBox>
      <div className="content">
        <Link href="/admin/setting">
          <SettingsBackLink>&larr; Back to settings</SettingsBackLink>
        </Link>

        <SettingsSectionHeading>Testimonial slots</SettingsSectionHeading>
        <TestimonialsManagement />

        <SettingsSectionHeading>Panel copy</SettingsSectionHeading>
        <TestimonialsPanelSettings />
      </div>
    </AdminContentBox>
  );
};

export default page;

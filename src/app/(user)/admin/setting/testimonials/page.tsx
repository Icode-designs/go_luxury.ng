import Link from "next/link";
import TestimonialsPanelSettings from "@/components/settings/testimonialsPanelSettings";
import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import { SettingsBackLink } from "@/components/settings/settings.styles";
import React from "react";

const page = () => {
  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Testimonials Panel</h1>
      </AdminHeaderBox>
      <div className="content">
        <Link href="/admin/setting" passHref legacyBehavior>
          <SettingsBackLink>&larr; Back to settings</SettingsBackLink>
        </Link>
        <TestimonialsPanelSettings />
      </div>
    </AdminContentBox>
  );
};

export default page;

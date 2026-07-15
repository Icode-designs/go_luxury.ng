import Link from "next/link";
import HeroSettings from "@/components/settings/heroSettings";
import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import { SettingsBackLink } from "@/components/settings/settings.styles";
import React from "react";

const page = () => {
  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Homepage Hero</h1>
      </AdminHeaderBox>
      <div className="content">
        <Link href="/admin/setting">
          <SettingsBackLink>&larr; Back to settings</SettingsBackLink>
        </Link>
        <HeroSettings />
      </div>
    </AdminContentBox>
  );
};

export default page;

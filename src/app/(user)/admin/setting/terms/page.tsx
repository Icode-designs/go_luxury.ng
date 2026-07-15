import Link from "next/link";
import TermsSettings from "@/components/settings/termsSettings";
import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import { SettingsBackLink } from "@/components/settings/settings.styles";
import React from "react";

const page = () => {
  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Terms &amp; Policies</h1>
      </AdminHeaderBox>
      <div className="content">
        <Link href="/admin/setting">
          <SettingsBackLink>&larr; Back to settings</SettingsBackLink>
        </Link>
        <TermsSettings />
      </div>
    </AdminContentBox>
  );
};

export default page;

import CategoriesSettings from "@/components/settings/categorySettings";
import { AdminContentBox, AdminHeaderBox } from "@/components/user/user.styles";
import React from "react";

const page = () => {
  return (
    <AdminContentBox>
      <AdminHeaderBox>
        <h1>Settings</h1>
      </AdminHeaderBox>
      <div className="content">
        <CategoriesSettings />
      </div>
    </AdminContentBox>
  );
};

export default page;

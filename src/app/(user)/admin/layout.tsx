import SidebarNavComponent from "@/components/user/sidebarNav";
import AdminShell from "@/components/user/adminShell";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return <AdminShell nav={<SidebarNavComponent />}>{children}</AdminShell>;
};

export default layout;

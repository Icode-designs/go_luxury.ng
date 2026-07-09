import SidebarNavComponent from "@/components/user/sidebarNav";
import {
  AdminLogoBox,
  MainViewPort,
  Sidebar,
  SidebarActions,
} from "@/components/user/user.styles";
import Logo from "@/components/ui/logo";
import { logoutAction } from "@/lib/auth/logout";

import React from "react";

import { FaPowerOff } from "react-icons/fa6";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <MainViewPort>
      <Sidebar>
        <AdminLogoBox>
          <Logo variant="large" />
          <h3>INTERNAL MANAGEMENT</h3>
        </AdminLogoBox>

        <SidebarNavComponent />

        <SidebarActions>
          <form action={logoutAction}>
            <button type="submit">
              <FaPowerOff />
              <p>Logout</p>
            </button>
          </form>
        </SidebarActions>
      </Sidebar>
      {children}
    </MainViewPort>
  );
};

export default layout;

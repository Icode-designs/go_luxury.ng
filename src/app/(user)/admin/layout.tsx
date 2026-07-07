import SidebarNavComponent from "@/components/user/sidebarNav";
import {
  AdminLogoBox,
  MainViewPort,
  Sidebar,
  SidebarActions,
} from "@/components/user/user.styles";
import Logo from "@/components/ui/logo";

import React from "react";

import { FaPowerOff } from "react-icons/fa6";
import Link from "next/link";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <MainViewPort>
      <Sidebar>
        <Link href="/">
          <AdminLogoBox>
            <Logo variant="large" />
            <h3>INTERNAL MANAGEMENT</h3>
          </AdminLogoBox>
        </Link>

        <SidebarNavComponent />

        <SidebarActions>
          <button>
            <FaPowerOff />
            <p>Logout</p>
          </button>
        </SidebarActions>
      </Sidebar>
      {children}
    </MainViewPort>
  );
};

export default layout;

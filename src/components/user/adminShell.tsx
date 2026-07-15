// src/components/user/adminShell.tsx
//
// Client-side chrome for the admin dashboard: a sidebar that collapses to an
// icon rail on desktop (>=1024px) and becomes an off-canvas drawer below
// that, opened via MobileTopBar's hamburger button. admin/layout.tsx (a
// Server Component) renders this and passes the nav links + logout form as
// children so the logout Server Action can still be wired up server-side.
"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HiMenu } from "react-icons/hi";
import { IoChevronBack, IoChevronForward, IoClose } from "react-icons/io5";
import Logo from "@/components/ui/logo";
import {
  MainViewPort,
  Sidebar,
  AdminLogoBox,
  SidebarActions,
  SidebarBackdrop,
  SidebarCollapseButton,
  ContentArea,
  MobileTopBar,
  MobileMenuButton,
} from "./user.styles";
import { logoutAction } from "@/lib/auth/logout";
import { FaPowerOff } from "react-icons/fa6";

const COLLAPSE_STORAGE_KEY = "admin-sidebar-collapsed";

interface AdminShellProps {
  nav: React.ReactNode;
  children: React.ReactNode;
}

const AdminShell = ({ nav, children }: AdminShellProps) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Restore the desktop collapse preference. Read after mount only, so
  // server- and client-rendered markup match on first paint.
  useEffect(() => {
    const stored = window.localStorage.getItem(COLLAPSE_STORAGE_KEY);
    if (stored === "1") setIsCollapsed(true);
  }, []);

  // Close the mobile drawer automatically whenever the route changes (i.e.
  // after tapping a nav link).
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  function toggleCollapsed() {
    setIsCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <MainViewPort>
      <Sidebar $collapsed={isCollapsed} $mobileOpen={isMobileOpen}>
        <AdminLogoBox $collapsed={isCollapsed}>
          <Logo variant={isCollapsed ? "small" : "large"} />
          <h3>INTERNAL MANAGEMENT</h3>
        </AdminLogoBox>

        {nav}

        <SidebarActions $collapsed={isCollapsed}>
          <button onClick={logoutAction}>
            <FaPowerOff />
            <p>Logout</p>
          </button>
        </SidebarActions>

        <SidebarCollapseButton
          type="button"
          onClick={toggleCollapsed}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={isCollapsed}
        >
          {isCollapsed ? <IoChevronForward /> : <IoChevronBack />}
        </SidebarCollapseButton>
      </Sidebar>

      {isMobileOpen && (
        <SidebarBackdrop
          role="button"
          aria-label="Close menu"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <ContentArea>
        <MobileTopBar>
          <MobileMenuButton
            type="button"
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMobileOpen((prev) => !prev)}
          >
            {isMobileOpen ? <IoClose /> : <HiMenu />}
          </MobileMenuButton>
          <Logo variant="small" />
        </MobileTopBar>

        {children}
      </ContentArea>
    </MainViewPort>
  );
};

export default AdminShell;

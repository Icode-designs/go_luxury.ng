"use client";
import styled from "styled-components";

// ---------------------------------------------------------------------------
// Admin shell: a fixed-width rail on desktop that can collapse to an icon
// rail, and an off-canvas drawer on smaller screens (< 1024px) triggered by
// MobileTopBar's hamburger button. See adminShell.tsx for the state that
// drives $collapsed / $mobileOpen.
// ---------------------------------------------------------------------------

export const MainViewPort = styled.main`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  position: relative;
`;

export const AdminLogoBox = styled.div<{ $collapsed?: boolean }>`
  display: grid;
  justify-items: center;
  margin-bottom: 32px;
  align-content: start;
  gap: 8px;
  padding: 0 12px;

  h3 {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.col010};
    text-align: center;
    display: ${({ $collapsed }) => ($collapsed ? "none" : "block")};
  }
`;

export const Sidebar = styled.div<{
  $collapsed: boolean;
  $mobileOpen: boolean;
}>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1200;
  width: 240px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.col070};
  font-size: 14px;
  padding: 24px 0;
  transform: translateX(${({ $mobileOpen }) => ($mobileOpen ? "0" : "-100%")});
  transition:
    transform 0.25s ease,
    width 0.25s ease;

  @media (min-width: 1024px) {
    position: relative;
    flex-shrink: 0;
    transform: none;
    width: ${({ $collapsed }) => ($collapsed ? "76px" : "240px")};

    ${({ $collapsed }) =>
      $collapsed
        ? `
          nav a {
            justify-content: center;
            padding: 10px 0;
          }
          nav a p {
            display: none;
          }
        `
        : ""}
  }
`;

export const SidebarBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(13, 13, 13, 0.5);
  z-index: 1100;

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const SidebarCollapseButton = styled.button`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 28px;
    right: -12px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.col040};
    border: 1px solid ${({ theme }) => theme.colors.col033};
    color: ${({ theme }) => theme.colors.col000};
    cursor: pointer;
    z-index: 5;

    svg {
      font-size: 12px;
    }

    &:hover {
      border-color: ${({ theme }) => theme.colors.col010};
      color: ${({ theme }) => theme.colors.col010};
    }
  }
`;

export const SideBarNav = styled.nav`
  height: 100%;
  width: 100%;
  padding: 0 12px;
  overflow-y: auto;

  a {
    color: ${({ theme }) => theme.colors.col040};
    display: flex;
    gap: 12px;
    padding: 8px 12px;
    align-items: center;
    white-space: nowrap;

    svg {
      flex-shrink: 0;
    }

    svg,
    p {
      color: ${({ theme }) => theme.colors.col040};
      text-transform: capitalize;
    }

    &.active {
      background-color: #e9e1da79;
      border-left: ${({ theme }) => theme.colors.col040} 2px solid;

      svg,
      p {
        color: ${({ theme }) => theme.colors.col010};
      }
    }
  }
`;

export const SidebarActions = styled.div<{ $collapsed?: boolean }>`
  border-top: ${({ theme }) => theme.colors.col040} 2px solid;
  padding: 16px 12px;
  width: 100%;
  display: flex;
  justify-content: ${({ $collapsed }) => ($collapsed ? "center" : "start")};

  button {
    display: flex;
    gap: 12px;
    align-items: center;
    width: fit-content;

    svg,
    p {
      color: ${({ theme }) => theme.colors.col120};
      font-weight: 600;
    }
    p {
      display: ${({ $collapsed }) => ($collapsed ? "none" : "flex")};
    }
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  min-width: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const MobileTopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  height: 56px;
  padding: 0 16px;
  background-color: ${({ theme }) => theme.colors.col000};

  @media (min-width: 1024px) {
    display: none;
  }
`;

export const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.col040};
  font-size: 22px;
  cursor: pointer;
`;

export const AdminHeaderBox = styled.header`
  width: 100%;
  height: fit-content;
  background-color: ${({ theme }) => theme.colors.col040};
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 900;
  box-shadow: 6px 0px 4px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    padding: 24px;
  }

  h1 {
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    font-size: 18px;
    line-height: 20px;
    letter-spacing: -0.4px;

    @media (min-width: 768px) {
      font-size: 20px;
    }
  }
`;

export const AdminContentBox = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 0;
  background-color: ${({ theme }) => theme.colors.col100};
  overflow: auto;
  scrollbar-width: thin;

  .content {
    padding: 24px 16px;
    display: grid;
    gap: 24px;

    @media (min-width: 768px) {
      padding: 50px 24px;
    }
  }
`;

export const AdminHeaderInputBox = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 300px;

  div {
    position: relative;
    width: 100% !important;
    input {
      padding: 8px 16px;
      border: 1px solid ${({ theme }) => theme.colors.col031};
      padding-right: 45px;
      border-radius: 8px;
      width: 100% !important;
      &:focus {
        ${({ theme }) => theme.colors.col010}
      }
    }

    svg {
      position: absolute;
      color: ${({ theme }) => theme.colors.col032};
      top: 8px;
      right: 8px;
    }
  }
`;

export const StyledSelect = styled.select`
  border: ${({ theme }) => theme.colors.col033} 1px solid;
  width: 100%;
  padding: 14px 16px;
  align-self: flex-end;

  &:focus {
    border-color: ${({ theme }) => theme.colors.col010};
  }
`;

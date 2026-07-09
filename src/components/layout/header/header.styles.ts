"use client";
import styled from "styled-components";

export const StyledHeader = styled.header`
  width: 100%;
  height: fit-content;
  background-color: ${({ theme }) => theme.colors.col000};
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

export const HeaderContainer = styled.div`
  width: 100%;
  height: fit-content;
  max-width: 1200px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.col040};
    font-size: 16px;
    border: none;
  }

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 440px;
    width: 100%;

    a {
      &:hover {
        color: ${({ theme }) => theme.colors.col010};
      }
      .active {
        color: ${({ theme }) => theme.colors.col010};
      }
    }
  }
`;

export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  height: fit-content;
  gap: 8px;
  h3 {
    font-size: 14px;
    font-weight: 600;
    font-family: ${({ theme }) => theme.fonts.fontSecondary};
    color: ${({ theme }) => theme.colors.col010};
  }
`;

export const MobileNavOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1999;
`;

export const StyledMobileNav = styled.nav<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100dvh;
  width: min(320px, 85vw);
  background-color: ${({ theme }) => theme.colors.col000};
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 24px 24px;
  transform: translateX(${({ $open }) => ($open ? "0" : "100%")});
  transition: transform 0.25s ease;

  a {
    padding: 14px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.col020};
    color: ${({ theme }) => theme.colors.col040};
    font-size: 14px;
    letter-spacing: 0.04em;

    &:hover {
      color: ${({ theme }) => theme.colors.col010};
    }
  }

  form {
    display: contents;
  }

  button {
    all: unset;
    padding: 14px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.col020};
    color: ${({ theme }) => theme.colors.col040};
    font-size: 14px;
    letter-spacing: 0.04em;
    cursor: pointer;
    text-align: left;
    width: 100%;

    &:hover {
      color: ${({ theme }) => theme.colors.col010};
    }
  }
`;

export const MobileNavHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 8px;

  button {
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.col040};
    font-size: 22px;
    cursor: pointer;
    padding: 8px;
  }
`;

export const StyledActionButtonBox = styled.div`
  position: relative;
  display: flex;
  gap: 20px;
  align-items: center;
  width: fit-content;
  height: fit-content;
  background-color: none;
  anchor-name: --my-trigger;

  button {
    cursor: pointer;
  }
`;

export const StyledModal = styled.div`
  position: absolute;
  position-anchor: --my-trigger;
  top: anchor(bottom);
  left: anchor(left);
  width: fit-content;
  height: fit-content;
  display: grid;
  gap: 8px;
  padding: 16px;
  padding-top: 32px;
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.col000};

  a {
    &:hover {
      color: ${({ theme }) => theme.colors.col010};
    }
  }

  form {
    display: contents;
  }

  button {
    all: unset;
    color: ${({ theme }) => theme.colors.col040};
    cursor: pointer;
    font: inherit;

    &:hover {
      color: ${({ theme }) => theme.colors.col010};
    }
  }
`;

export const SearchDropdown = styled.div`
  position: absolute;
  position-anchor: --my-trigger;
  top: anchor(bottom);
  left: anchor(left);
  width: max(260px, 100%);
  z-index: 100;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.col000};

  form {
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.col020};
    padding-bottom: 8px;
  }

  input {
    flex: 1;
    min-width: 0;
    border: none;
    background: none;
    outline: none;
    font-size: 14px;
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    color: ${({ theme }) => theme.colors.col010};

    &::placeholder {
      color: ${({ theme }) => theme.colors.col040};
    }
  }

  button {
    all: unset;
    display: flex;
    color: ${({ theme }) => theme.colors.col040};
    cursor: pointer;
    font-size: 16px;

    &:hover {
      color: ${({ theme }) => theme.colors.col010};
    }
  }
`;

// Cart icon + count badge. Visible on both mobile and desktop (unlike the
// search/account icons, which are desktop-only) since reaching the cart is
// essential on every breakpoint.
export const CartLinkBox = styled.a`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.col040};
  font-size: 16px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.col010};
  }
`;

export const CartCountBadge = styled.span`
  position: absolute;
  top: -7px;
  right: -9px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.colors.col010};
  color: ${({ theme }) => theme.colors.col000};
  font-family: ${({ theme }) => theme.fonts.fontPrimary};
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
`;

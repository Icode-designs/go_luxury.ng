import styled from "styled-components";

export const StyledHeader = styled.header`
  width: 100vw;
  height: fit-content;
  background-color: ${({ theme }) => theme.colors.col000};
  display: flex;
  align-items: center;
  justify-content: center;
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

export const StyledMobileNav = styled.nav``;

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
`;

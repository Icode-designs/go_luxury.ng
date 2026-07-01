"use client";
import styled from "styled-components";

export const MainViewPort = styled.main`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
`;

export const AdminLogoBox = styled.div`
  display: grid;
  justify-items: center;
  margin-bottom: 32px;
  align-content: start;
  gap: 8px;
  h3 {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.col010};
  }
`;

export const Sidebar = styled.div`
  width: 240px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.col070};
  font-size: 14px;
  padding: 24px 0;
`;

export const SideBarNav = styled.nav`
  height: 100%;
  width: 100%;
  padding: 0 12px;

  a {
    color: ${({ theme }) => theme.colors.col040};
    display: flex;
    gap: 12px;
    padding: 8px 12px;
    align-items: center;
    svg,
    p {
      color: ${({ theme }) => theme.colors.col040};
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

export const SidebarActions = styled.div`
  border-top: ${({ theme }) => theme.colors.col040} 2px solid;
  padding: 16px 12px;
  button {
    display: flex;
    gap: 12px;
    align-items: center;
    svg,
    p {
      color: ${({ theme }) => theme.colors.col120};
    }
  }
`;

export const AdminHeaderBox = styled.header`
  width: 100%;
  height: fit-content;
  background-color: ${({ theme }) => theme.colors.col040};
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 0;

  h1 {
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    font-size: 20px;
    line-height: 20px;
    letter-spacing: -0.4px;
  }
`;

export const AdminContentBox = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  padding: 50px 24px;
  padding-top: 100px;
  background-color: ${({ theme }) => theme.colors.col100};
  overflow: auto;
  scrollbar-width: thin;
`;

export const AdminHeaderInputBox = styled.div`
  display: flex;
  gap: 10px;
  div {
    position: relative;
    width: fit-content;
    input {
      padding: 8px 16px;
      border: 1px solid ${({ theme }) => theme.colors.col031};
      padding-right: 32px;
      border-radius: 8px;
      width: 270px;
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

export const ProductForm = styled.form`
  width: 100%;
  background-color: transparent;
  height: fit-content;
  display: grid;
  gap: 24px;

  fieldset {
    background-color: ${({ theme }) => theme.colors.col040};
    padding: 24px;
    border-radius: 12px;
    display: grid;
    gap: 24px;
    width: 100%;
    height: fit-content;

    > div {
      width: 100%;
      &:first-of-type {
        padding-bottom: 16px;
        border-bottom: 1px ${({ theme }) => theme.colors.col033} solid;
        font-family: ${({ theme }) => theme.fonts.fontPrimary};
        text-transform: uppercase;
      }
    }
  }
`;

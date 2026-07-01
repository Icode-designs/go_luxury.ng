"use client";
import styled from "styled-components";

export const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.col110};
  width: 100%;
  height: 100vh;
  overflow: auto;
  padding: 120px 24px;
  position: relative;
`;

export const AuthForm = styled.form`
  max-width: 650px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.col040};
  padding: 24px;
  display: grid;
  gap: 32px;
  justify-items: center;
  height: fit-content;
  position: relative;

  fieldset {
    display: grid;
    gap: 20px;
    width: 100%;
    border: none;
    background: none;
  }
  > button {
    width: 100%;
    max-width: none;
  }

  @media (min-width: 768px) {
    padding: 40px;
  }
`;

export const BackButton = styled.button`
  position: absolute;
  top: 24px;
  left: 24px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.col000};
  padding: 8px;
  margin: -8px;
  gap: 8px;
  h3 {
    font-size: 12px;
  }

  svg {
    font-size: 20px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

export const RedirectBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  justify-content: center;
  p,
  a {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.col032};
  }

  a {
    &:hover {
      color: ${({ theme }) => theme.colors.col010};
    }
  }
`;

export const AuthFormHeader = styled.div`
  display: grid;
  gap: 8px;
  position: relative;
  padding-top: 32px;
  max-width: 314.39px;
  width: 100%;
  justify-items: center;
  text-align: center;
  &::after {
    content: "";
    display: flex;
    position: absolute;
    background-color: ${({ theme }) => theme.colors.col010};
    width: 40px;
    height: 2px;
    justify-self: center;
    top: 0;
  }

  h3 {
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    color: ${({ theme }) => theme.colors.col010};
  }

  h1 {
    font-weight: 500;
    line-height: 50px;
    letter-spacing: -0.4px;
    text-transform: none;
  }
`;

export const InputBox = styled.div`
  position: relative;
  width: 100%;
  display: grid;
  gap: 8px;

  label {
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    color: ${({ theme }) => theme.colors.col000};
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1.2px;
    line-height: 16px;
    text-transform: uppercase;
  }

  input,
  textarea {
    border: ${({ theme }) => theme.colors.col033} 1px solid;
    width: 100%;
    padding: 14px 16px;

    &:focus {
      border-color: ${({ theme }) => theme.colors.col010};
    }
    &[type="password"] {
      padding-right: 40px;
    }
  }

  textarea {
    height: 200px;
    overflow: auto;
  }

  button {
    background: none;
    border: none;
    width: fit-content;
    position: absolute;
    right: 16px;
    bottom: 10px;

    svg {
      font-size: 18px;
      color: ${({ theme }) => theme.colors.col030};
    }
  }
`;

export const Dividerbox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;

  > div {
    width: 100%;
    height: 2px;
    background-color: ${({ theme }) => theme.colors.col033};
  }
`;

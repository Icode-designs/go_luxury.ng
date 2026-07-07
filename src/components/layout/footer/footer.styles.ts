"use client";

import styled from "styled-components";

export const FooterSection = styled.footer`
  width: 100%;
  height: fit-content;
  padding: 0 16px;
  background-color: ${({ theme }) => theme.colors.col000};

  @media (min-width: 480px) {
    padding: 0 24px;
  }
`;

export const FooterContent = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 0 32px;
  display: grid;
  align-content: space-between;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
    padding: 64px 0 40px;
  }

  > * {
    height: fit-content;
    p {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      letter-spacing: 0;
      font-family: ${({ theme }) => theme.fonts.fontPrimary};
      color: ${({ theme }) => theme.colors.col030};
    }
  }
  color: ${({ theme }) => theme.colors.col040};
`;

export const FooterArticle = styled.article`
  display: grid;
  gap: 16px;
  max-width: 300px;
  width: 100%;

  &:nth-child(1) {
    display: grid;
    gap: 16px;

    h3 {
      font-family: ${({ theme }) => theme.fonts.fontSecondary};
      font-size: 20px;
      letter-spacing: 0;
      line-height: 30px;
      color: ${({ theme }) => theme.colors.col010};
    }
  }

  &:last-child {
    svg {
      font-size: 20px;
      color: ${({ theme }) => theme.colors.col040};
    }
  }
`;

export const UsefulLinks = styled.div`
  display: grid;
  gap: 16px;
  width: fit-content;
  h3 {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0;
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    color: ${({ theme }) => theme.colors.col040};
  }

  > div {
    display: grid;
    gap: 8px;
    width: fit-content;

    a {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      letter-spacing: 0;
      font-family: ${({ theme }) => theme.fonts.fontPrimary};
      color: ${({ theme }) => theme.colors.col030};
    }
  }
`;

export const NewsLetter = styled.form`
  display: grid;
  gap: 16px;
  max-width: 250px;
  width: 100%;
  h3 {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0;
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    color: ${({ theme }) => theme.colors.col040};
  }
`;

export const NewsletterInputBox = styled.div`
  width: 100%;
  position: relative;
  input {
    background: none;
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.col031};
    padding: 13px 12px;
    padding-right: 40px;
    width: 100%;
  }
  button {
    position: absolute;
    text-transform: uppercase;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0;
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    color: ${({ theme }) => theme.colors.col010};
    padding: 13px 0;
    right: 0;
    top: 0;
  }
`;

export const PaymentMethods = styled.div`
  display: grid;
  gap: 16px;
  max-width: 250px;
  width: 100%;

  h3 {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0;
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    color: ${({ theme }) => theme.colors.col040};
  }

  p {
    color: ${({ theme }) => theme.colors.col030};
    font-size: 12px;
    font-weight: 400;
    text-transform: uppercase;
  }

  div {
    svg {
      font-size: 20px;
      color: ${({ theme }) => theme.colors.col040};
    }
  }
`;

export const Accreditation = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.col031};
  display: flex;
  padding: 16px 0;
  justify-content: center;
  p {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0;
    font-family: ${({ theme }) => theme.fonts.fontPrimary};
    color: ${({ theme }) => theme.colors.col030};
    text-align: center;
  }
`;

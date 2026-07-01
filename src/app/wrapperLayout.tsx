"use client";
import GlobalStyles from "@/styles/globalStyles";
import theme from "@/styles/theme";
import React from "react";
import { ThemeProvider } from "styled-components";

const WrapperLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </>
  );
};

export default WrapperLayout;

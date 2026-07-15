"use client";
import GlobalStyles from "@/styles/globalStyles";
import StyledComponentsRegistry from "@/lib/styledComponentsRegistry";
import theme from "@/styles/theme";
import React from "react";
import { ThemeProvider } from "styled-components";

const WrapperLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
};

export default WrapperLayout;

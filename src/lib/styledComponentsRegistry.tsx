// src/lib/styledComponentsRegistry.tsx
//
// Required for styled-components v6 to work correctly with the Next.js App
// Router (see https://nextjs.org/docs/app/building-your-application/styling/css-in-js).
// Without this, styled-components has no way to collect the CSS generated
// during a given server render into that request's HTML response -- so the
// initial HTML sent to the browser has NO <style> tags at all. In dev this
// is masked because styles get injected client-side the moment the page
// hydrates (fast, invisible flash), but in a production build this is what
// causes "styles don't load on the live site" while working locally: any
// delay or failure in hydration leaves the page permanently unstyled
// because the server-rendered HTML never had the CSS to begin with.
"use client";
import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

const StyledComponentsRegistry = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  // On the client (post-hydration), there's no server render to collect
  // styles for -- just render children directly through styled-components'
  // normal client-side runtime.
  if (typeof window !== "undefined") return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
};

export default StyledComponentsRegistry;

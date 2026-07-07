import React from "react";
import { SectionHeader } from "./home.styles";

interface Labels {
  tag: string;
  text: string;
}

const HomeSectionHeader = ({ tag, text }: Labels) => {
  return (
    <SectionHeader>
      <h3>{tag}</h3>
      <h2>{text}</h2>
    </SectionHeader>
  );
};

export default HomeSectionHeader;

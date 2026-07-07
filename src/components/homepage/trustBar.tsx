import React from "react";
import { TrustbarContent, TrustbarSection } from "./home.styles";
import { FlexBox } from "@/styles/components.styled";
import { LuBadgeCheck } from "react-icons/lu";
import { PiGlobeHemisphereEastFill } from "react-icons/pi";
import { GiMoneyStack } from "react-icons/gi";
import { RiRefund2Line } from "react-icons/ri";

const TrustBar = () => {
  return (
    <TrustbarSection>
      <TrustbarContent>
        <FlexBox $gap={12}>
          <LuBadgeCheck />
          <h3>100% AUTHENTIC DONOR HAIR</h3>
        </FlexBox>
        <FlexBox $gap={12}>
          <PiGlobeHemisphereEastFill />
          <h3>SHIPS TO 7+ COUNTRIES</h3>
        </FlexBox>
        <FlexBox $gap={12}>
          <GiMoneyStack />
          <h3>LOCAL & INTERNATIONAL PAYMENTS</h3>
        </FlexBox>
        <FlexBox $gap={12}>
          <RiRefund2Line />
          <h3>REFUND POLICY</h3>
        </FlexBox>
      </TrustbarContent>
    </TrustbarSection>
  );
};

export default TrustBar;

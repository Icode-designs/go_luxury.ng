import React from "react";
import {
  TrustStatBox,
  TrustStatsContent,
  TrustStatsSection,
} from "./home.styles";
import HomeSectionHeader from "./homeSectionHeader";
import { IoIosStar, IoMdCheckboxOutline } from "react-icons/io";
import { MdOutlineSupportAgent } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";

const TrustStats = () => {
  return (
    <TrustStatsSection>
      <TrustStatsContent>
        <HomeSectionHeader tag="THE DIFFERENCE" text="Why Choose Us" />
        <div>
          <TrustStatBox>
            <div>
              <h2>100%</h2>
              <h3>real donor hair</h3>
            </div>{" "}
          </TrustStatBox>
          <TrustStatBox>
            <div>
              {" "}
              <h2>
                5<IoIosStar />
              </h2>
              <h3>Rated for Excellence</h3>
            </div>
          </TrustStatBox>
          <TrustStatBox>
            <div>
              {" "}
              <h2>7+</h2>
              <h3>countries</h3>
            </div>{" "}
          </TrustStatBox>
          <TrustStatBox>
            <div>
              {" "}
              <h2>
                <IoMdCheckboxOutline />
              </h2>
              <h3>Premium quality</h3>
            </div>{" "}
          </TrustStatBox>
          <TrustStatBox>
            <div>
              {" "}
              <h2>
                <MdOutlineSupportAgent />
              </h2>
              <h3>24/7 support</h3>
            </div>{" "}
          </TrustStatBox>
          <TrustStatBox>
            <div>
              {" "}
              <h2>
                <RiSecurePaymentFill />
              </h2>
              <h3>Secure payments</h3>
            </div>{" "}
          </TrustStatBox>
        </div>
      </TrustStatsContent>
    </TrustStatsSection>
  );
};

export default TrustStats;

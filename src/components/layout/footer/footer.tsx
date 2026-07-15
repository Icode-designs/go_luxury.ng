import React from "react";
import {
  Accreditation,
  FooterArticle,
  FooterContent,
  FooterSection,
  NewsLetter,
  NewsletterInputBox,
  PaymentMethods,
  SocialLinksBox,
  UsefulLinks,
} from "./footer.styles";
import Logo from "@/components/ui/logo";
import { FlexBox } from "@/styles/components.styled";
import Link from "next/link";
import { AiOutlineBank } from "react-icons/ai";
import {
  FaCcMastercard,
  FaInstagram,
  FaStripe,
  FaTiktok,
} from "react-icons/fa6";
import { MdWhatsapp } from "react-icons/md";
import { RiVisaFill } from "react-icons/ri";

const Footer = () => {
  return (
    <FooterSection>
      <FooterContent>
        <FooterArticle>
          <div>
            <Logo variant="large" />
            <h3>Go_LuxuryHair.NG</h3>
          </div>

          <p>
            Elevating standard to exclusivity. The home of the {`${"world's"}`}{" "}
            finest authentic donor hair.
          </p>
          <SocialLinksBox $gap={8}>
            <Link
              href="https://www.tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaTiktok />
            </Link>
            <Link
              href="https://www.instagram.com/go_luxuryhair.ng/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </Link>
            <Link
              href="https://wa.me/2348123542162"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <MdWhatsapp />
            </Link>
          </SocialLinksBox>
        </FooterArticle>

        <UsefulLinks>
          <h3>LINKS</h3>
          <div>
            <Link href="/terms">TERMS &amp; POLICIES</Link>
            <Link href="">CONTACT US</Link>
            <Link href="/shop">GO TO SHOP</Link>
            <Link href="/blog">GO TO BLOG</Link>
          </div>
        </UsefulLinks>

        <NewsLetter>
          <h3>JOIN THE LIST</h3>
          <p>
            Be the first to know about new drops and exclusive private sales.
          </p>
          <NewsletterInputBox>
            <input
              type="email"
              name="subscriber"
              id="subscriber"
              placeholder="YOUR EMAIL"
            />
            <button>JOIN</button>
          </NewsletterInputBox>
        </NewsLetter>

        <PaymentMethods>
          <h3>PAYMENT METHODS</h3>
          <FlexBox $width="100%" $justify="space-between" $gap={10}>
            <AiOutlineBank />
            <FaStripe />
            <RiVisaFill />
            <FaCcMastercard />
          </FlexBox>
          <p>PAYSTACK · stripe · Mastercard · VISA</p>
        </PaymentMethods>
      </FooterContent>
      <Accreditation>
        <p>© 2024 GO_LUXURYHAIR.NG. ALL RIGHTS RESERVED.</p>
      </Accreditation>
    </FooterSection>
  );
};

export default Footer;

"use client";
import { motion } from "framer-motion";
import { FlexBox } from "@/styles/components.styled";
import {
  HomeHeroArticle,
  HomeHeroContent,
  HomeHeroSection,
} from "./home.styles";
import Button from "../ui/button";

// Reusable animation variants — each child fades + slides up 24px,
// staggered slightly so they don't all move in lockstep.
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, easeout: "easeOut" },
  },
};

interface HomeHeroProps {
  imageUrl?: string | null;
  tag?: string;
  headingMain?: string;
  headingHighlight?: string;
  subtext?: string;
}

const HomeHero = ({
  imageUrl,
  tag = "100% AUTHENTIC DONOR HAIR AVAILABLE",
  headingMain = "Luxury Hair.",
  headingHighlight = "Worth Every Penny.",
  subtext = "Ethically sourced · Ships to Nigeria, UK, USA, Canada & Europe.",
}: HomeHeroProps) => {
  return (
    <HomeHeroSection $imageUrl={imageUrl}>
      <HomeHeroContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <HomeHeroArticle as="div">
            <motion.h3 variants={itemVariants}>{tag}</motion.h3>

            <motion.h1 variants={itemVariants}>
              {headingMain} <br />
              <span>{headingHighlight}</span>
            </motion.h1>

            <motion.p variants={itemVariants}>{subtext}</motion.p>

            <motion.div variants={itemVariants} style={{ width: "100%" }}>
              <FlexBox $width="100%" $gap={20}>
                <Button variant="filled-nude" href="/shop">
                  Go to Shop
                </Button>
                <Button variant="outlined" href="/blog">
                  Go to Blog
                </Button>
              </FlexBox>
            </motion.div>
          </HomeHeroArticle>
        </motion.div>
      </HomeHeroContent>
    </HomeHeroSection>
  );
};

export default HomeHero;

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

const HomeHero = () => {
  return (
    <HomeHeroSection>
      <HomeHeroContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <HomeHeroArticle as="div">
            <motion.h3 variants={itemVariants}>
              100% AUTHENTIC DONOR HAIR AVAILABLE
            </motion.h3>

            <motion.h1 variants={itemVariants}>
              Luxury Hair. <br />
              <span>Worth Every Penny.</span>
            </motion.h1>

            <motion.p variants={itemVariants}>
              Ethically sourced · Ships to Nigeria, UK, USA, Canada & Europe.
            </motion.p>

            <motion.div variants={itemVariants} style={{ width: "100%" }}>
              <FlexBox $width="100%" $gap={20}>
                <Button variant="filled-nude">Go to Shop</Button>
                <Button variant="outlined">Go to Blog</Button>
              </FlexBox>
            </motion.div>
          </HomeHeroArticle>
        </motion.div>
      </HomeHeroContent>
    </HomeHeroSection>
  );
};

export default HomeHero;

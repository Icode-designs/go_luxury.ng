// src/components/home/categories.tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { CategoriesSection, CategoriesGrid, CategoryTile } from "./home.styles";
import { useCategories } from "@/hook/useCategories";
import { SectionContent } from "@/styles/components.styled";
import HomeSectionHeader from "./homeSectionHeader";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, easeout: "easeOut" },
  },
};

const HomeCategories = () => {
  const { categories, isLoading } = useCategories();

  if (isLoading || categories.length === 0) return null;

  return (
    <CategoriesSection>
      <SectionContent>
        <HomeSectionHeader tag="Browse by type" text="Shop by category" />

        <CategoriesGrid
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                href={`/shop?category=${category.id}`}
                passHref
                legacyBehavior
              >
                <CategoryTile>
                  {category.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={category.image_url} alt={category.name} />
                  ) : null}

                  <div className="category-label">
                    <h3>{category.name}</h3>
                  </div>
                </CategoryTile>
              </Link>
            </motion.div>
          ))}
        </CategoriesGrid>
      </SectionContent>
    </CategoriesSection>
  );
};

export default HomeCategories;

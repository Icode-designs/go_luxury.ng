"use client";
import { SectionContent } from "@/styles/components.styled";
import { ProductsSection, ProductsGrid } from "./home.styles";
import HomeSectionHeader from "./homeSectionHeader";
import { ProductCardItem } from "./productCardItem";
import { useHomeProducts } from "@/hook/useHomeProducts";

const BestRated = () => {
  const { products, isLoading } = useHomeProducts("best_rated", 4);

  if (isLoading || products.length === 0) return null;

  return (
    <ProductsSection>
      <SectionContent>
        <HomeSectionHeader tag="ADORED EXCELLENCE" text="Best Rated Products" />
        <ProductsGrid>
          {products.map((product) => (
            <ProductCardItem key={product.id} product={product} showRating />
          ))}
        </ProductsGrid>
      </SectionContent>
    </ProductsSection>
  );
};

export default BestRated;

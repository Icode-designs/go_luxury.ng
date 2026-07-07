"use client";
import { SectionContent } from "@/styles/components.styled";
import { ProductsSectionAlt, ProductsGrid } from "./home.styles";
import HomeSectionHeader from "./homeSectionHeader";
import { ProductCardItem } from "./productCardItem";
import { useHomeProducts } from "@/hook/useHomeProducts";

const BestSellers = () => {
  const { products, isLoading } = useHomeProducts("best_selling", 4);

  if (isLoading || products.length === 0) return null;

  return (
    <ProductsSectionAlt>
      <SectionContent>
        <HomeSectionHeader tag="MOST ADORED" text="Best Sellers" />
        <ProductsGrid>
          {products.map((product) => (
            <ProductCardItem key={product.id} product={product} />
          ))}
        </ProductsGrid>
      </SectionContent>
    </ProductsSectionAlt>
  );
};

export default BestSellers;

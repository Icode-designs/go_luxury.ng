"use client";
import { SectionContent } from "@/styles/components.styled";
import { ProductsSectionAlt, ProductsGrid, SaleBanner } from "./home.styles";
import HomeSectionHeader from "./homeSectionHeader";
import { ProductCardItem } from "./productCardItem";
import { useSaleProducts } from "@/hook/useSaleProducts";

const BestValue = () => {
  const { products, isLoading, maxDiscountPercent } = useSaleProducts(4);

  if (isLoading || products.length === 0) return null;

  return (
    <ProductsSectionAlt>
      <SectionContent>
        <HomeSectionHeader tag="LIMITED TIME" text="Best Value" />

        <SaleBanner>
          <p>&ldquo;Premium hair. Rare savings. Don&apos;t miss it.&rdquo;</p>
          <span>Up to {maxDiscountPercent}% off</span>
        </SaleBanner>

        <ProductsGrid>
          {products.map((product) => (
            <ProductCardItem key={product.id} product={product} />
          ))}
        </ProductsGrid>
      </SectionContent>
    </ProductsSectionAlt>
  );
};

export default BestValue;

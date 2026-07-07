"use client";
import Link from "next/link";
import {
  ProductsSection,
  ProductsSectionHeaderRow,
  ProductsGrid,
} from "./home.styles";
import HomeSectionHeader from "./homeSectionHeader";
import { ProductCardItem } from "./productCardItem";
import { useHomeProducts } from "@/hook/useHomeProducts";
import { SectionContent } from "@/styles/components.styled";

const NewArrivals = () => {
  const { products, isLoading } = useHomeProducts("newest", 4);

  if (isLoading || products.length === 0) return null;

  return (
    <ProductsSection>
      <SectionContent>
        <ProductsSectionHeaderRow>
          <HomeSectionHeader tag="THE LATEST DROPS" text="New Arrivals" />
          <Link href="/shop?sort=newest">View all</Link>
        </ProductsSectionHeaderRow>

        <ProductsGrid>
          {products.map((product) => (
            <ProductCardItem key={product.id} product={product} />
          ))}
        </ProductsGrid>
      </SectionContent>
    </ProductsSection>
  );
};

export default NewArrivals;

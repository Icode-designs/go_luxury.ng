import Link from "next/link";
import {
  ProductsSection,
  ProductsSectionHeaderRow,
  ProductsGrid,
} from "./home.styles";
import HomeSectionHeader from "./homeSectionHeader";
import { ProductCardItem } from "./productCardItem";
import type { HomeProduct } from "@/lib/products/getHomeProducts";
import { SectionContent } from "@/styles/components.styled";

interface NewArrivalsProps {
  products: HomeProduct[];
}

const NewArrivals = ({ products }: NewArrivalsProps) => {
  if (products.length === 0) return null;

  return (
    <ProductsSection id="new-arrivals">
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

import { SectionContent } from "@/styles/components.styled";
import { ProductsSectionAlt, ProductsGrid } from "./home.styles";
import HomeSectionHeader from "./homeSectionHeader";
import { ProductCardItem } from "./productCardItem";
import type { HomeProduct } from "@/lib/products/getHomeProducts";

interface BestSellersProps {
  products: HomeProduct[];
}

// Ranking is computed server-side in getHomeProducts("best_selling", ...):
// higher units sold (from order_items) first, falling back to newest-first
// while there's no order history yet -- so this section always renders
// regular product cards rather than hiding for lack of data.
const BestSellers = ({ products }: BestSellersProps) => {
  if (products.length === 0) return null;

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

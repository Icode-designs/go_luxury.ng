import { SectionContent } from "@/styles/components.styled";
import { ProductsSection, ProductsGrid } from "./home.styles";
import HomeSectionHeader from "./homeSectionHeader";
import { ProductCardItem } from "./productCardItem";
import type { HomeProduct } from "@/lib/products/getHomeProducts";

interface BestRatedProps {
  products: HomeProduct[];
}

// Ranking is computed server-side in getHomeProducts("best_rated", ...):
// higher average rating first, falling back to newest-first while ratings
// are still sparse or nonexistent -- so this section always renders regular
// product cards (with a rating badge once a product has approved reviews)
// rather than hiding for lack of data.
const BestRated = ({ products }: BestRatedProps) => {
  if (products.length === 0) return null;

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

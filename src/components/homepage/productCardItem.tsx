"use client";
import Link from "next/link";
import { ProductCard } from "./home.styles";

// Structural subset of HomeProduct (and of the shop page's Product type) --
// only the fields this card actually renders. Kept independent of either
// source hook's full shape so both the homepage and the shop page can pass
// their own product objects here without extra fields to satisfy.
export interface ProductCardData {
  id: string;
  name: string;
  base_price: number;
  discounted_price: number | null;
  primaryImageUrl: string | null;
  isNew: boolean;
  averageRating: number | null;
  reviewCount: number;
}

interface ProductCardItemProps {
  product: ProductCardData;
  showRating?: boolean;
}

export function ProductCardItem({
  product,
  showRating = false,
}: ProductCardItemProps) {
  const isOnSale = product.discounted_price !== null;

  return (
    <Link href={`/product/${product.id}`} passHref legacyBehavior>
      <ProductCard>
        <div className="product-image-wrap">
          {product.isNew && (
            <span className="product-badge badge-new">New</span>
          )}
          {!product.isNew && isOnSale && (
            <span className="product-badge badge-sale">
              -
              {Math.round(
                ((product.base_price - product.discounted_price!) /
                  product.base_price) *
                  100,
              )}
              %
            </span>
          )}
          {product.primaryImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.primaryImageUrl} alt={product.name} />
          ) : null}
        </div>

        {showRating && product.averageRating !== null && (
          <div className="product-rating">
            {"★".repeat(Math.round(product.averageRating))}
            <span>({product.reviewCount} reviews)</span>
          </div>
        )}

        <h3>{product.name}</h3>

        <div className="product-price">
          {isOnSale ? (
            <>
              <span className="price-old">
                {"₦"}
                {product.base_price.toLocaleString()}
              </span>
              {"₦"}
              {product.discounted_price!.toLocaleString()}
            </>
          ) : (
            <>
              {"₦"}
              {product.base_price.toLocaleString()}
            </>
          )}
        </div>
      </ProductCard>
    </Link>
  );
}

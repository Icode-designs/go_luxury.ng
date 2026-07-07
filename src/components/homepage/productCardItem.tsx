"use client";
import Link from "next/link";
import { ProductCard } from "./home.styles";
import type { HomeProduct } from "@/hook/useHomeProducts";

interface ProductCardItemProps {
  product: HomeProduct;
  showRating?: boolean;
}

export function ProductCardItem({
  product,
  showRating = false,
}: ProductCardItemProps) {
  const isOnSale = product.discounted_price !== null;
  const isVariantRange =
    product.minVariantPrice !== null &&
    product.maxVariantPrice !== null &&
    product.minVariantPrice !== product.maxVariantPrice;

  return (
    <Link href={`/product/${product.id}`} passHref legacyBehavior>
      <ProductCard>
        <div className="product-image-wrap">
          {product.isNew && (
            <span className="product-badge badge-new">New</span>
          )}
          {!product.isNew && isOnSale && (
            <span className="product-badge badge-sale">
              −
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
                ₦{product.base_price.toLocaleString()}
              </span>
              ₦{product.discounted_price!.toLocaleString()}
            </>
          ) : isVariantRange ? (
            <>
              <span className="price-range-label">From</span>₦
              {product.minVariantPrice!.toLocaleString()}
            </>
          ) : (
            <>₦{product.base_price.toLocaleString()}</>
          )}
        </div>
      </ProductCard>
    </Link>
  );
}

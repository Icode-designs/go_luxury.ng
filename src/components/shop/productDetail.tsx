"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ProductDetail } from "@/lib/products/getProductById";
import Button from "@/components/ui/button";
import { addToCartAction } from "@/lib/cart/cartActions";
import {
  ProductDetailContainer,
  GalleryColumn,
  MainImageBox,
  ThumbnailRow,
  ThumbnailButton,
  BelowGalleryBlock,
  Description,
  SpecsList,
  InfoColumn,
  PriceRow,
  StockNote,
  AddToCartNotice,
  QuantityRow,
} from "./productDetail.styles";
import { FlexBox } from "@/styles/components.styled";

interface ProductDetailViewProps {
  product: ProductDetail;
}

const ProductDetailView = ({ product }: ProductDetailViewProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addState, setAddState] = useState<
    | { status: "idle" }
    | { status: "error"; message: string }
    | { status: "success" }
  >({ status: "idle" });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const images = product.images.length
    ? product.images
    : [{ url: "", isPrimary: true }];

  const isOnSale =
    product.discountedPrice !== null &&
    product.discountedPrice < product.basePrice;
  const effectivePrice = product.discountedPrice ?? product.basePrice;

  const outOfStock = product.stockCount === 0;
  const maxQty = Math.min(product.stockCount, 20);

  function handleAddToCart() {
    setAddState({ status: "idle" });
    startTransition(async () => {
      const result = await addToCartAction(product.id, quantity);
      if (!result.ok) {
        setAddState({ status: "error", message: result.message });
        return;
      }
      setAddState({ status: "success" });
      router.refresh(); // updates the header cart badge
    });
  }

  return (
    <ProductDetailContainer>
      <FlexBox $width="100%" $justify="space-between" $gap={48}>
        <GalleryColumn>
          <MainImageBox>
            {images[activeImageIndex]?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[activeImageIndex].url} alt={product.name} />
            ) : null}
          </MainImageBox>

          {images.length > 1 && (
            <ThumbnailRow>
              {images.map((img, i) => (
                <ThumbnailButton
                  key={img.url + i}
                  type="button"
                  $active={i === activeImageIndex}
                  onClick={() => setActiveImageIndex(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-current={i === activeImageIndex}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" />
                </ThumbnailButton>
              ))}
            </ThumbnailRow>
          )}
        </GalleryColumn>

        <InfoColumn>
          <h1>{product.name}</h1>

          {product.category && <p>{product.category.name}</p>}

          <PriceRow>
            <span className="price-current">
              {"₦"}
              {effectivePrice.toLocaleString()}
            </span>
            {isOnSale && (
              <span className="price-old">
                {"₦"}
                {product.basePrice.toLocaleString()}
              </span>
            )}
          </PriceRow>

          <StockNote $lowOrOut={product.stockCount <= 3}>
            {outOfStock
              ? "Out of stock"
              : product.stockCount <= 3
                ? `Only ${product.stockCount} left in stock`
                : "In stock"}
          </StockNote>

          {!outOfStock && (
            <QuantityRow>
              <span>Quantity</span>
              <div>
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span aria-live="polite">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={quantity >= maxQty}
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                >
                  +
                </button>
              </div>
            </QuantityRow>
          )}

          <Button
            variant="filled-dark"
            disabled={outOfStock || isPending}
            onClick={handleAddToCart}
            style={{ maxWidth: "100%" }}
          >
            {outOfStock
              ? "Out of Stock"
              : isPending
                ? "Adding…"
                : "Add to Cart"}
          </Button>

          {addState.status === "success" && (
            <AddToCartNotice role="status">
              Added to your cart. <Link href="/cart">View cart</Link>
            </AddToCartNotice>
          )}
          {addState.status === "error" && (
            <AddToCartNotice role="alert">{addState.message}</AddToCartNotice>
          )}
        </InfoColumn>
      </FlexBox>

      {/* Description + a read-only spec list live under the gallery. */}
      <BelowGalleryBlock>
        {product.description && (
          <Description>{product.description}</Description>
        )}

        {product.attributes.length > 0 && (
          <SpecsList>
            {product.attributes.map((attribute) => (
              <div key={attribute.id}>
                <dt>{attribute.label}</dt>
                <dd>{attribute.value}</dd>
              </div>
            ))}
          </SpecsList>
        )}
      </BelowGalleryBlock>
    </ProductDetailContainer>
  );
};

export default ProductDetailView;

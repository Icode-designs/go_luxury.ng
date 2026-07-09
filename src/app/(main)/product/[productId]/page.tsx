import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products/getProductById";
import ProductDetailView from "@/components/shop/productDetail";
import { ProductDetailSection } from "@/components/shop/productDetail.styles";
import ReviewsSection from "@/components/shop/reviews/reviewsSection";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  const product = await getProductById(productId);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description:
      product.description?.slice(0, 160) ??
      `${product.name} — 100% authentic donor hair, available now at Go_LuxuryHair.NG.`,
    openGraph: {
      title: product.name,
      images: product.images[0]?.url ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <ProductDetailSection>
      <ProductDetailView product={product} />
      <ReviewsSection productId={product.id} />
    </ProductDetailSection>
  );
}

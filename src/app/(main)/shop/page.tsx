import { Suspense } from "react";
import type { Metadata } from "next";
import { getCategories } from "@/lib/products/getCategories";
import ShopContent from "@/components/shop/shopContent";
import { ShopSection } from "@/components/shop/shop.styles";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse 100% authentic donor hair wigs and bundles from Go_LuxuryHair.NG. Filter by category and price.",
};

export default async function ShopPage() {
  const categories = await getCategories();

  return (
    <ShopSection>
      {/* useSearchParams (used inside ShopContent) requires a Suspense
          boundary — otherwise the whole route opts into fully client-side
          rendering, which we don't want for an indexable shop page. */}
      <Suspense fallback={null}>
        <ShopContent categories={categories} />
      </Suspense>
    </ShopSection>
  );
}

import BestRated from "@/components/homepage/bestRated";
import BestSellers from "@/components/homepage/bestSellers";
import BestValue from "@/components/homepage/bestValue";
import HomeCategories from "@/components/homepage/categories";
import HomeGallery from "@/components/homepage/gallery";
import HomeHero from "@/components/homepage/hero";
import NewArrivals from "@/components/homepage/newArrivals";
import Testimonials from "@/components/homepage/testimonials";
import TrustBar from "@/components/homepage/trustBar";
import TrustStats from "@/components/homepage/trustStats";
import { getSiteContent } from "@/lib/settings/getSiteContent";
import {
  getGalleryImages,
  isGalleryComplete,
} from "@/lib/settings/getGalleryImages";
import { getTestimonials } from "@/lib/settings/getTestimonials";
import { getHomeProducts } from "@/lib/products/getHomeProducts";

// Section order follows the Figma homepage flow (node 279:1537).
// "Hair Origins" is intentionally not yet implemented — its copy hasn't
// been pulled from Figma yet (blocked on the Figma MCP rate limit).
// "Gallery (Masonry Style)" is now implemented (see gallery.tsx) — it only
// renders once an admin has filled all 5 gallery slots in
// /admin/setting/gallery; until then it's hidden rather than showing
// placeholders.
// "Shop by Occasion" was removed — it linked to a ?occasion= filter that has
// no backing column/filter in the product schema, so every link was dead.
export default async function Home() {
  const [
    siteContent,
    galleryImages,
    testimonials,
    newArrivals,
    bestSellers,
    bestRated,
  ] = await Promise.all([
    getSiteContent(),
    getGalleryImages(),
    getTestimonials(),
    getHomeProducts("newest", 4),
    getHomeProducts("best_selling", 4),
    getHomeProducts("best_rated", 4),
  ]);

  return (
    <main>
      <HomeHero
        imageUrl={siteContent.heroImageUrl}
        tag={siteContent.heroTag}
        headingMain={siteContent.heroHeadingMain}
        headingHighlight={siteContent.heroHeadingHighlight}
        subtext={siteContent.heroSubtext}
      />
      <TrustBar />
      <HomeCategories />
      <NewArrivals products={newArrivals} />
      <BestSellers products={bestSellers} />
      <BestRated products={bestRated} />
      <BestValue />
      {isGalleryComplete(galleryImages) && (
        <HomeGallery images={galleryImages} />
      )}
      <TrustStats />
      <Testimonials
        testimonials={testimonials}
        panel={{
          testimonialsStatNumber: siteContent.testimonialsStatNumber,
          testimonialsTagline: siteContent.testimonialsTagline,
          testimonialsHashtag: siteContent.testimonialsHashtag,
          testimonialsInstagramUrl: siteContent.testimonialsInstagramUrl,
        }}
      />
    </main>
  );
}

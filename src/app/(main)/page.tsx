import BestRated from "@/components/homepage/bestRated";
import BestSellers from "@/components/homepage/bestSellers";
import BestValue from "@/components/homepage/bestValue";
import HomeCategories from "@/components/homepage/categories";
import HomeHero from "@/components/homepage/hero";
import NewArrivals from "@/components/homepage/newArrivals";
import ShopByOccasion from "@/components/homepage/shopByOccasion";
import Testimonials from "@/components/homepage/testimonials";
import TrustBar from "@/components/homepage/trustBar";
import TrustStats from "@/components/homepage/trustStats";

// Section order follows the Figma homepage flow (node 279:1537).
// Two Figma sections — "Gallery (Masonry Style)" and "Hair Origins" — are
// intentionally not yet implemented: Gallery needs real photography assets
// and Hair Origins' copy hasn't been pulled from Figma yet (blocked on the
// Figma MCP rate limit). Both are tracked as follow-ups.
export default async function Home() {
  return (
    <main>
      <HomeHero />
      <TrustBar />
      <HomeCategories />
      <NewArrivals />
      <BestSellers />
      <BestRated />
      <ShopByOccasion />
      <BestValue />
      <Testimonials />
      <TrustStats />
    </main>
  );
}

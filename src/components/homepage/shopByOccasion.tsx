// src/components/homepage/shopByOccasion.tsx
//
// Figma: "Section - 8. Shop by Occasion" (node 279:1820).
// Icons are rendered with react-icons rather than the Figma-exported PNGs —
// the exported asset URLs are temporary (7-day expiry) and inline SVG icons
// are lighter and sharper at any screen size, which also keeps this section
// dependency-free for images.
"use client";
import Link from "next/link";
import {
  IoSparklesOutline,
  IoStarOutline,
  IoHeartOutline,
  IoCameraOutline,
  IoBriefcaseOutline,
  IoAirplaneOutline,
} from "react-icons/io5";
import { SectionContent } from "@/styles/components.styled";
import { OccasionSection, OccasionGrid, OccasionCard } from "./home.styles";
import HomeSectionHeader from "./homeSectionHeader";

const OCCASIONS = [
  { label: "Wedding", icon: IoSparklesOutline, query: "wedding" },
  { label: "Special Events", icon: IoStarOutline, query: "special-events" },
  { label: "Everyday", icon: IoHeartOutline, query: "everyday" },
  { label: "Photoshoots", icon: IoCameraOutline, query: "photoshoots" },
  { label: "Corporate", icon: IoBriefcaseOutline, query: "corporate" },
  { label: "Vacation", icon: IoAirplaneOutline, query: "vacation" },
] as const;

const ShopByOccasion = () => {
  return (
    <OccasionSection>
      <SectionContent>
        <HomeSectionHeader
          tag="TAILORED FOR YOUR MOMENTS"
          text="Shop by Occasion"
        />

        <OccasionGrid>
          {OCCASIONS.map(({ label, icon: Icon, query }) => (
            <Link key={query} href={`/shop?occasion=${query}`} passHref legacyBehavior>
              <OccasionCard>
                <Icon aria-hidden="true" />
                <h3>{label.toUpperCase()}</h3>
              </OccasionCard>
            </Link>
          ))}
        </OccasionGrid>
      </SectionContent>
    </OccasionSection>
  );
};

export default ShopByOccasion;

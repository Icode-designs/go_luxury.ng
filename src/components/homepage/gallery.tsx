import { SectionContent } from "@/styles/components.styled";
import { GallerySection, GalleryMosaicGrid } from "./home.styles";
import HomeSectionHeader from "./homeSectionHeader";
import type { GalleryImage } from "@/lib/settings/getGalleryImages";

interface HomeGalleryProps {
  images: GalleryImage[];
}

// Renders the Figma "Gallery (Masonry Style)" section — only ever called
// with exactly 5 complete images (see isGalleryComplete() / page.tsx), so
// there's no empty-state handling here by design.
const HomeGallery = ({ images }: HomeGalleryProps) => {
  const sorted = [...images].sort((a, b) => a.slotNumber - b.slotNumber);

  return (
    <GallerySection>
      <SectionContent>
        <HomeSectionHeader tag="THE EXPERIENCE" text="Gallery" />

        <GalleryMosaicGrid>
          {sorted.map((image, i) => (
            <div
              key={image.slotNumber}
              className={i === 0 ? "gallery-item gallery-item-large" : "gallery-item"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.imageUrl!} alt={image.caption ?? "Gallery photo"} />
            </div>
          ))}
        </GalleryMosaicGrid>
      </SectionContent>
    </GallerySection>
  );
};

export default HomeGallery;

"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { IoIosStar, IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  TestimonialsSection,
  TestimonialsGrid,
  TestimonialsPanel,
  TestimonialNavRow,
  TestimonialNavButton,
  TestimonialsCarouselArea,
  TestimonialsCarouselViewport,
  TestimonialsTrack,
  TestimonialCard,
  TestimonialCardHeader,
  TestimonialCardPhoto,
  TestimonialCardBody,
  TestimonialDotsRow,
  TestimonialDot,
} from "./home.styles";
import type { DisplayTestimonial } from "@/lib/settings/getTestimonials";
import type { SiteContent } from "@/lib/settings/getSiteContent";

interface TestimonialsProps {
  testimonials: DisplayTestimonial[];
  panel: Pick<
    SiteContent,
    | "testimonialsStatNumber"
    | "testimonialsTagline"
    | "testimonialsHashtag"
    | "testimonialsInstagramUrl"
  >;
}

function monogramFor(name: string) {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

const Testimonials = ({ testimonials, panel }: TestimonialsProps) => {
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (testimonials.length === 0) return null;

  function scrollToIndex(i: number) {
    const clamped = Math.max(0, Math.min(testimonials.length - 1, i));
    cardRefs.current[clamped]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
    setActiveIndex(clamped);
  }

  return (
    <TestimonialsSection>
      <TestimonialsGrid>
        <TestimonialsPanel>
          <span className="eyebrow">THE ULTIMATE VIBE</span>

          {panel.testimonialsStatNumber && (
            <h2 className="stat">{panel.testimonialsStatNumber}</h2>
          )}

          <p className="tagline">{panel.testimonialsTagline}</p>

          {panel.testimonialsHashtag && (
            <div className="cta-row">
              <span className="hashtag">{panel.testimonialsHashtag}</span>
              {panel.testimonialsInstagramUrl ? (
                <Link
                  href={panel.testimonialsInstagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-button"
                >
                  Get Featured!
                </Link>
              ) : (
                <span className="cta-button">Get Featured!</span>
              )}
            </div>
          )}

          <TestimonialNavRow>
            <TestimonialNavButton
              type="button"
              aria-label="Previous testimonial"
              onClick={() => scrollToIndex(activeIndex - 1)}
              disabled={activeIndex === 0}
            >
              <IoIosArrowBack aria-hidden="true" />
            </TestimonialNavButton>
            <TestimonialNavButton
              type="button"
              aria-label="Next testimonial"
              onClick={() => scrollToIndex(activeIndex + 1)}
              disabled={activeIndex === testimonials.length - 1}
            >
              <IoIosArrowForward aria-hidden="true" />
            </TestimonialNavButton>
          </TestimonialNavRow>
        </TestimonialsPanel>

        <TestimonialsCarouselArea>
          <TestimonialsCarouselViewport>
            <TestimonialsTrack>
              {testimonials.map((testimonial, i) => (
                <TestimonialCard
                  key={testimonial.slotNumber}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                >
                  <TestimonialCardHeader>
                    <TestimonialCardPhoto>
                      {testimonial.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={testimonial.photoUrl}
                          alt={testimonial.customerName}
                        />
                      ) : (
                        <span className="monogram">
                          {monogramFor(testimonial.customerName)}
                        </span>
                      )}
                    </TestimonialCardPhoto>
                    <h3>
                      {testimonial.customerName}
                      {testimonial.customerLocation
                        ? `, ${testimonial.customerLocation}`
                        : ""}
                    </h3>
                  </TestimonialCardHeader>

                  <TestimonialCardBody>
                    <div
                      className="stars"
                      aria-label={`${testimonial.rating} out of 5 stars`}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <IoIosStar
                          key={n}
                          aria-hidden="true"
                          style={{
                            opacity: n <= testimonial.rating ? 1 : 0.25,
                          }}
                        />
                      ))}
                    </div>
                    <p>{`"${testimonial.quote}"`}</p>
                  </TestimonialCardBody>
                </TestimonialCard>
              ))}
            </TestimonialsTrack>
          </TestimonialsCarouselViewport>

          <TestimonialDotsRow role="tablist" aria-label="Testimonials">
            {testimonials.map((testimonial, i) => (
              <TestimonialDot
                key={testimonial.slotNumber}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Show testimonial from ${testimonial.customerName}`}
                $active={i === activeIndex}
                onClick={() => scrollToIndex(i)}
              />
            ))}
          </TestimonialDotsRow>
        </TestimonialsCarouselArea>
      </TestimonialsGrid>
    </TestimonialsSection>
  );
};

export default Testimonials;

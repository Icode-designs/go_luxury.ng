// src/lib/settings/getSiteContent.ts
//
// Public read of the site_content singleton (hero copy/image + the combined
// Terms & Policies text). Relies on the "Public can view site content" RLS
// policy, same convention as getProductReviews.ts. Falls back to sensible
// defaults if the row is somehow missing, so the homepage never breaks.
import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface SiteContent {
  heroImageUrl: string | null;
  heroTag: string;
  heroHeadingMain: string;
  heroHeadingHighlight: string;
  heroSubtext: string;
  termsAndPolicies: string | null;
  /** Testimonials-section left info panel. The stat number is a specific
   * factual claim (customer count) so it's admin-set only and null hides
   * that line entirely -- the app never fabricates a number. Tagline has a
   * sensible default since it's plain marketing copy; hashtag/Instagram
   * link are null until an admin sets them, which hides the CTA button. */
  testimonialsStatNumber: string | null;
  testimonialsTagline: string;
  testimonialsHashtag: string | null;
  testimonialsInstagramUrl: string | null;
}

const DEFAULTS: SiteContent = {
  heroImageUrl: null,
  heroTag: "100% AUTHENTIC DONOR HAIR AVAILABLE",
  heroHeadingMain: "Luxury Hair.",
  heroHeadingHighlight: "Worth Every Penny.",
  heroSubtext:
    "Ethically sourced · Ships to Nigeria, UK, USA, Canada & Europe.",
  termsAndPolicies: null,
  testimonialsStatNumber: null,
  testimonialsTagline: "Real Looks. Real Stories. Real You.",
  testimonialsHashtag: null,
  testimonialsInstagramUrl: null,
};

export async function getSiteContent(): Promise<SiteContent> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_content")
    .select(
      "hero_image_url, hero_tag, hero_heading_main, hero_heading_highlight, hero_subtext, terms_and_policies, testimonials_stat_number, testimonials_tagline, testimonials_hashtag, testimonials_instagram_url",
    )
    .eq("id", true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[getSiteContent] fetch error:", error.message);
    return DEFAULTS;
  }

  return {
    heroImageUrl: data.hero_image_url,
    heroTag: data.hero_tag ?? DEFAULTS.heroTag,
    heroHeadingMain: data.hero_heading_main ?? DEFAULTS.heroHeadingMain,
    heroHeadingHighlight:
      data.hero_heading_highlight ?? DEFAULTS.heroHeadingHighlight,
    heroSubtext: data.hero_subtext ?? DEFAULTS.heroSubtext,
    termsAndPolicies: data.terms_and_policies,
    testimonialsStatNumber: data.testimonials_stat_number,
    testimonialsTagline:
      data.testimonials_tagline ?? DEFAULTS.testimonialsTagline,
    testimonialsHashtag: data.testimonials_hashtag,
    testimonialsInstagramUrl: data.testimonials_instagram_url,
  };
}

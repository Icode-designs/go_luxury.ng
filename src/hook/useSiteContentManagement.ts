// src/hook/useSiteContentManagement.ts
//
// Admin hook for the site_content singleton (hero copy/image + Terms &
// Policies text). Mirrors useCategoryManagement.ts: direct browser-client
// writes relying on the "Admins manage site content" RLS policy, plus a
// storage upload helper for the hero image (same pattern as category
// images, using the hero-images bucket).
"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface ManagedSiteContent {
  heroImageUrl: string | null;
  heroImageStorageId: string | null;
  heroTag: string;
  heroHeadingMain: string;
  heroHeadingHighlight: string;
  heroSubtext: string;
  termsAndPolicies: string;
}

const EMPTY: ManagedSiteContent = {
  heroImageUrl: null,
  heroImageStorageId: null,
  heroTag: "",
  heroHeadingMain: "",
  heroHeadingHighlight: "",
  heroSubtext: "",
  termsAndPolicies: "",
};

export function useSiteContentManagement() {
  const [content, setContent] = useState<ManagedSiteContent>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("site_content")
      .select(
        "hero_image_url, hero_image_storage_id, hero_tag, hero_heading_main, hero_heading_highlight, hero_subtext, terms_and_policies",
      )
      .eq("id", true)
      .maybeSingle();

    if (fetchError) {
      console.error("[useSiteContentManagement] fetch error:", fetchError.message);
      setError("Failed to load site content.");
      setIsLoading(false);
      return;
    }

    setContent({
      heroImageUrl: data?.hero_image_url ?? null,
      heroImageStorageId: data?.hero_image_storage_id ?? null,
      heroTag: data?.hero_tag ?? "",
      heroHeadingMain: data?.hero_heading_main ?? "",
      heroHeadingHighlight: data?.hero_heading_highlight ?? "",
      heroSubtext: data?.hero_subtext ?? "",
      termsAndPolicies: data?.terms_and_policies ?? "",
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const updateHeroCopy = useCallback(
    async (fields: {
      heroTag: string;
      heroHeadingMain: string;
      heroHeadingHighlight: string;
      heroSubtext: string;
    }) => {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("site_content")
        .update({
          hero_tag: fields.heroTag,
          hero_heading_main: fields.heroHeadingMain,
          hero_heading_highlight: fields.heroHeadingHighlight,
          hero_subtext: fields.heroSubtext,
        })
        .eq("id", true);

      if (updateError) throw new Error(updateError.message);
      await fetchContent();
    },
    [fetchContent],
  );

  const setHeroImage = useCallback(
    async (file: File, previousStorageId: string | null) => {
      const supabase = createClient();

      if (previousStorageId) {
        await supabase.storage.from("hero-images").remove([previousStorageId]);
      }

      const ext = file.name.split(".").pop();
      const storagePath = `hero/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("hero-images")
        .upload(storagePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage
        .from("hero-images")
        .getPublicUrl(storagePath);

      const { error: updateError } = await supabase
        .from("site_content")
        .update({
          hero_image_url: urlData.publicUrl,
          hero_image_storage_id: storagePath,
        })
        .eq("id", true);

      if (updateError) throw new Error(updateError.message);
      await fetchContent();
    },
    [fetchContent],
  );

  const removeHeroImage = useCallback(
    async (storageId: string) => {
      const supabase = createClient();
      await supabase.storage.from("hero-images").remove([storageId]);

      const { error: updateError } = await supabase
        .from("site_content")
        .update({ hero_image_url: null, hero_image_storage_id: null })
        .eq("id", true);

      if (updateError) throw new Error(updateError.message);
      await fetchContent();
    },
    [fetchContent],
  );

  const updateTermsAndPolicies = useCallback(
    async (text: string) => {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("site_content")
        .update({ terms_and_policies: text })
        .eq("id", true);

      if (updateError) throw new Error(updateError.message);
      await fetchContent();
    },
    [fetchContent],
  );

  return {
    content,
    isLoading,
    error,
    retry: fetchContent,
    updateHeroCopy,
    setHeroImage,
    removeHeroImage,
    updateTermsAndPolicies,
  };
}

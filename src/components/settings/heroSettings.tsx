// src/components/settings/heroSettings.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSiteContentManagement } from "@/hook/useSiteContentManagement";
import ImageUploadTile from "./imageUploadTile";
import { SettingsFormBox } from "./settings.styles";

const HeroSettings = () => {
  const {
    content,
    isLoading,
    error,
    updateHeroCopy,
    setHeroImage,
    removeHeroImage,
  } = useSiteContentManagement();

  const [heroTag, setHeroTag] = useState("");
  const [heroHeadingMain, setHeroHeadingMain] = useState("");
  const [heroHeadingHighlight, setHeroHeadingHighlight] = useState("");
  const [heroSubtext, setHeroSubtext] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Sync local form state once the content has loaded (and whenever it
  // refetches after a save), same pattern as the category rename input.
  useEffect(() => {
    if (isLoading) return;
    setHeroTag(content.heroTag);
    setHeroHeadingMain(content.heroHeadingMain);
    setHeroHeadingHighlight(content.heroHeadingHighlight);
    setHeroSubtext(content.heroSubtext);
  }, [isLoading, content]);

  async function handleImageUpload(file: File) {
    setIsUploadingImage(true);
    setActionError(null);
    try {
      await setHeroImage(file, content.heroImageStorageId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setActionError(null);
    setSaved(false);
    try {
      await updateHeroCopy({
        heroTag,
        heroHeadingMain,
        heroHeadingHighlight,
        heroSubtext,
      });
      setSaved(true);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <p>Loading hero settings…</p>;
  if (error) return <p style={{ color: "#8B3A2A" }}>{error}</p>;

  return (
    <div>
      <p style={{ fontSize: 13, color: "#9A8880", marginBottom: 20, maxWidth: 560 }}>
        Controls the homepage hero banner — the image, the small tag line
        above the heading, the heading itself, and the paragraph beneath it.
        The two buttons ("Go to Shop" / "Go to Blog") always stay as-is.
      </p>

      <div style={{ marginBottom: 24 }}>
        <label
          style={{
            display: "block",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "#9A8880",
            marginBottom: 8,
          }}
        >
          Hero image
        </label>
        <ImageUploadTile
          image={content.heroImageUrl}
          isUploading={isUploadingImage}
          alt="hero image"
          size={160}
          onFile={handleImageUpload}
          onRemove={() => {
            if (content.heroImageStorageId) removeHeroImage(content.heroImageStorageId);
          }}
        />
      </div>

      {actionError && (
        <p style={{ color: "#8B3A2A", fontSize: 13, marginBottom: 16 }}>
          {actionError}
        </p>
      )}

      <form onSubmit={handleSave}>
        <SettingsFormBox>
          <div>
            <label htmlFor="heroTag">Tag (above heading)</label>
            <input
              id="heroTag"
              type="text"
              value={heroTag}
              onChange={(e) => setHeroTag(e.target.value)}
              maxLength={120}
            />
          </div>

          <div>
            <label htmlFor="heroHeadingMain">Heading</label>
            <input
              id="heroHeadingMain"
              type="text"
              value={heroHeadingMain}
              onChange={(e) => setHeroHeadingMain(e.target.value)}
              maxLength={80}
            />
          </div>

          <div>
            <label htmlFor="heroHeadingHighlight">Heading (highlighted line)</label>
            <input
              id="heroHeadingHighlight"
              type="text"
              value={heroHeadingHighlight}
              onChange={(e) => setHeroHeadingHighlight(e.target.value)}
              maxLength={80}
            />
          </div>

          <div>
            <label htmlFor="heroSubtext">Subtext</label>
            <textarea
              id="heroSubtext"
              value={heroSubtext}
              onChange={(e) => setHeroSubtext(e.target.value)}
              maxLength={200}
              rows={2}
            />
          </div>

          {saved && (
            <p style={{ color: "#0F6E56", fontSize: 13 }}>Saved.</p>
          )}

          <button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </SettingsFormBox>
      </form>
    </div>
  );
};

export default HeroSettings;

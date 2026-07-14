// src/components/settings/testimonialsPanelSettings.tsx
//
// Admin controls for the homepage testimonials section's left info panel
// (stat number, tagline, hashtag, Instagram CTA link). Mirrors
// heroSettings.tsx's form pattern. The stat number is a specific factual
// claim (a customer count) so it's left blank by default and the homepage
// hides that line entirely until an admin fills in a real figure — the app
// never fabricates a number here.
"use client";
import React, { useEffect, useState } from "react";
import { useSiteContentManagement } from "@/hook/useSiteContentManagement";
import { SettingsFormBox } from "./settings.styles";

const TestimonialsPanelSettings = () => {
  const { content, isLoading, error, updateTestimonialsPanel } =
    useSiteContentManagement();

  const [statNumber, setStatNumber] = useState("");
  const [tagline, setTagline] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    setStatNumber(content.testimonialsStatNumber);
    setTagline(content.testimonialsTagline);
    setHashtag(content.testimonialsHashtag);
    setInstagramUrl(content.testimonialsInstagramUrl);
  }, [isLoading, content]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setActionError(null);
    setSaved(false);
    try {
      await updateTestimonialsPanel({
        testimonialsStatNumber: statNumber,
        testimonialsTagline: tagline,
        testimonialsHashtag: hashtag,
        testimonialsInstagramUrl: instagramUrl,
      });
      setSaved(true);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <p>Loading testimonials panel…</p>;
  if (error) return <p style={{ color: "#8B3A2A" }}>{error}</p>;

  return (
    <div>
      <p style={{ fontSize: 13, color: "#9A8880", marginBottom: 20, maxWidth: 560 }}>
        Controls the info panel shown beside the homepage testimonials
        carousel. Leave the stat number blank to hide that line — it&apos;s
        only shown once you have a real figure to display. Leave the hashtag
        blank to hide the &quot;Get Featured&quot; button.
      </p>

      {actionError && (
        <p style={{ color: "#8B3A2A", fontSize: 13, marginBottom: 16 }}>
          {actionError}
        </p>
      )}

      <form onSubmit={handleSave}>
        <SettingsFormBox>
          <div>
            <label htmlFor="statNumber">Stat number (e.g. 12,400+)</label>
            <input
              id="statNumber"
              type="text"
              value={statNumber}
              onChange={(e) => setStatNumber(e.target.value)}
              maxLength={20}
              placeholder="Leave blank to hide"
            />
          </div>

          <div>
            <label htmlFor="tagline">Tagline</label>
            <input
              id="tagline"
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              maxLength={80}
            />
          </div>

          <div>
            <label htmlFor="hashtag">Hashtag (e.g. #luvmeforyou)</label>
            <input
              id="hashtag"
              type="text"
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
              maxLength={40}
              placeholder="Leave blank to hide the CTA button"
            />
          </div>

          <div>
            <label htmlFor="instagramUrl">Instagram / social link</label>
            <input
              id="instagramUrl"
              type="text"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://instagram.com/yourhandle"
            />
          </div>

          {saved && <p style={{ color: "#0F6E56", fontSize: 13 }}>Saved.</p>}

          <button type="submit" disabled={isSaving}>
            {isSaving ? "Saving…" : "Save changes"}
          </button>
        </SettingsFormBox>
      </form>
    </div>
  );
};

export default TestimonialsPanelSettings;

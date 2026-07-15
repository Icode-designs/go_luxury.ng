// src/components/settings/termsSettings.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useSiteContentManagement } from "@/hook/useSiteContentManagement";
import RichTextEditor from "./richTextEditor";
import { SettingsFormBox } from "./settings.styles";

const TermsSettings = () => {
  const { content, isLoading, error, updateTermsAndPolicies } =
    useSiteContentManagement();

  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    setText(content.termsAndPolicies);
  }, [isLoading, content]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setActionError(null);
    setSaved(false);
    try {
      await updateTermsAndPolicies(text);
      setSaved(true);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "#8B3A2A" }}>{error}</p>;

  return (
    <div>
      <p style={{ fontSize: 13, color: "#9A8880", marginBottom: 20, maxWidth: 560 }}>
        Format this however reads best — headings, bold, lists, links — it
        renders exactly as shown here on the public <code>/terms</code> page.
      </p>

      {actionError && (
        <p style={{ color: "#8B3A2A", fontSize: 13, marginBottom: 16 }}>
          {actionError}
        </p>
      )}

      <form onSubmit={handleSave}>
        <SettingsFormBox style={{ maxWidth: 720 }}>
          <div>
            <label htmlFor="termsText">Terms &amp; Policies</label>
            <RichTextEditor
              id="termsText"
              value={text}
              onChange={setText}
              placeholder="Write your terms & policies here…"
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

export default TermsSettings;

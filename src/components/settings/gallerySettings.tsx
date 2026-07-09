// src/components/settings/gallerySettings.tsx
"use client";
import React, { useState } from "react";
import { useGalleryManagement } from "@/hook/useGalleryManagement";
import ImageUploadTile from "./imageUploadTile";
import { GallerySlotGrid, GallerySlotBox } from "./settings.styles";

const GallerySettings = () => {
  const { slots, isLoading, error, setSlotImage, clearSlot } =
    useGalleryManagement();
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filledCount = slots.filter((s) => s.imageUrl !== null).length;

  async function handleUpload(
    slotNumber: number,
    file: File,
    previousStorageId: string | null,
  ) {
    setUploadingSlot(slotNumber);
    setActionError(null);
    try {
      await setSlotImage(slotNumber, file, previousStorageId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploadingSlot(null);
    }
  }

  if (isLoading) return <p>Loading gallery…</p>;
  if (error) return <p style={{ color: "#8B3A2A" }}>{error}</p>;

  return (
    <div>
      <p style={{ fontSize: 13, color: "#9A8880", marginBottom: 8, maxWidth: 560 }}>
        The homepage gallery always shows exactly 5 photos. There are 5 fixed
        slots below — fill in whichever are empty and replace any you want to
        swap out. The gallery section won&apos;t appear on the homepage until
        all 5 slots have an image.
      </p>
      <p style={{ fontSize: 13, color: "#5F5E5E", marginBottom: 20 }}>
        {filledCount} of 5 slots filled.
      </p>

      {actionError && (
        <p style={{ color: "#8B3A2A", fontSize: 13, marginBottom: 16 }}>
          {actionError}
        </p>
      )}

      <GallerySlotGrid>
        {slots.map((slot) => (
          <GallerySlotBox key={slot.slotNumber}>
            <span className="slot-label">Slot {slot.slotNumber}</span>
            <ImageUploadTile
              image={slot.imageUrl}
              isUploading={uploadingSlot === slot.slotNumber}
              alt={`gallery slot ${slot.slotNumber}`}
              size={140}
              onFile={(file) =>
                handleUpload(slot.slotNumber, file, slot.imageStorageId)
              }
              onRemove={() => {
                if (slot.imageStorageId) clearSlot(slot.slotNumber, slot.imageStorageId);
              }}
            />
          </GallerySlotBox>
        ))}
      </GallerySlotGrid>
    </div>
  );
};

export default GallerySettings;

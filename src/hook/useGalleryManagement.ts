// src/hook/useGalleryManagement.ts
//
// Admin hook for the 5 fixed homepage gallery slots. Mirrors
// useCategoryManagement.ts's storage-upload pattern, but scoped to
// replacing the image within an existing slot row rather than
// creating/deleting rows — the 5 slots always exist (seeded by migration),
// so "adding" a picture means uploading into an empty slot and "removing"
// just clears that slot back to empty. The slot count itself never changes.
"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface ManagedGallerySlot {
  slotNumber: number;
  imageUrl: string | null;
  imageStorageId: string | null;
  caption: string | null;
}

export function useGalleryManagement() {
  const [slots, setSlots] = useState<ManagedGallerySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("gallery_images")
      .select("slot_number, image_url, image_storage_id, caption")
      .order("slot_number", { ascending: true });

    if (fetchError) {
      console.error("[useGalleryManagement] fetch error:", fetchError.message);
      setError("Failed to load gallery images.");
      setIsLoading(false);
      return;
    }

    setSlots(
      (data ?? []).map((row) => ({
        slotNumber: row.slot_number,
        imageUrl: row.image_url,
        imageStorageId: row.image_storage_id,
        caption: row.caption,
      })),
    );
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const setSlotImage = useCallback(
    async (slotNumber: number, file: File, previousStorageId: string | null) => {
      const supabase = createClient();

      if (previousStorageId) {
        await supabase.storage.from("gallery-images").remove([previousStorageId]);
      }

      const ext = file.name.split(".").pop();
      const storagePath = `slot-${slotNumber}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery-images")
        .upload(storagePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage
        .from("gallery-images")
        .getPublicUrl(storagePath);

      const { error: updateError } = await supabase
        .from("gallery_images")
        .update({
          image_url: urlData.publicUrl,
          image_storage_id: storagePath,
        })
        .eq("slot_number", slotNumber);

      if (updateError) throw new Error(updateError.message);
      await fetchSlots();
    },
    [fetchSlots],
  );

  const clearSlot = useCallback(
    async (slotNumber: number, storageId: string) => {
      const supabase = createClient();
      await supabase.storage.from("gallery-images").remove([storageId]);

      const { error: updateError } = await supabase
        .from("gallery_images")
        .update({ image_url: null, image_storage_id: null, caption: null })
        .eq("slot_number", slotNumber);

      if (updateError) throw new Error(updateError.message);
      await fetchSlots();
    },
    [fetchSlots],
  );

  const setSlotCaption = useCallback(
    async (slotNumber: number, caption: string) => {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("gallery_images")
        .update({ caption: caption || null })
        .eq("slot_number", slotNumber);

      if (updateError) throw new Error(updateError.message);
      await fetchSlots();
    },
    [fetchSlots],
  );

  return {
    slots,
    isLoading,
    error,
    retry: fetchSlots,
    setSlotImage,
    clearSlot,
    setSlotCaption,
  };
}

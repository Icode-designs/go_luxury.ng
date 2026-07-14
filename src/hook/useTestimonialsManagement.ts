// src/hook/useTestimonialsManagement.ts
//
// Admin hook for the 5 fixed homepage testimonial slots. Mirrors
// useGalleryManagement.ts's pattern (the 5 slots always exist, seeded by
// migration — "adding" a testimonial means filling an empty slot, and
// "removing" just clears that slot back to empty/placeholder). No storage
// involved here, just plain columns, so it's simpler than the gallery hook.
"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface ManagedTestimonialSlot {
  slotNumber: number;
  quote: string | null;
  customerName: string | null;
  customerLocation: string | null;
  rating: number | null;
  photoUrl: string | null;
  photoStorageId: string | null;
}

export interface TestimonialSlotInput {
  quote: string;
  customerName: string;
  customerLocation: string;
  rating: number;
}

export function useTestimonialsManagement() {
  const [slots, setSlots] = useState<ManagedTestimonialSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("testimonials")
      .select(
        "slot_number, quote, customer_name, customer_location, rating, photo_url, photo_storage_id",
      )
      .order("slot_number", { ascending: true });

    if (fetchError) {
      console.error(
        "[useTestimonialsManagement] fetch error:",
        fetchError.message,
      );
      setError("Failed to load testimonials.");
      setIsLoading(false);
      return;
    }

    setSlots(
      (data ?? []).map((row) => ({
        slotNumber: row.slot_number,
        quote: row.quote,
        customerName: row.customer_name,
        customerLocation: row.customer_location,
        rating: row.rating,
        photoUrl: row.photo_url,
        photoStorageId: row.photo_storage_id,
      })),
    );
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const setSlotContent = useCallback(
    async (slotNumber: number, values: TestimonialSlotInput) => {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("testimonials")
        .update({
          quote: values.quote,
          customer_name: values.customerName,
          customer_location: values.customerLocation || null,
          rating: values.rating,
        })
        .eq("slot_number", slotNumber);

      if (updateError) throw new Error(updateError.message);
      await fetchSlots();
    },
    [fetchSlots],
  );

  const clearSlot = useCallback(
    async (slotNumber: number, photoStorageId: string | null) => {
      const supabase = createClient();

      if (photoStorageId) {
        await supabase.storage.from("testimonial-photos").remove([photoStorageId]);
      }

      const { error: updateError } = await supabase
        .from("testimonials")
        .update({
          quote: null,
          customer_name: null,
          customer_location: null,
          rating: null,
          photo_url: null,
          photo_storage_id: null,
        })
        .eq("slot_number", slotNumber);

      if (updateError) throw new Error(updateError.message);
      await fetchSlots();
    },
    [fetchSlots],
  );

  const setSlotPhoto = useCallback(
    async (slotNumber: number, file: File, previousStorageId: string | null) => {
      const supabase = createClient();

      if (previousStorageId) {
        await supabase.storage
          .from("testimonial-photos")
          .remove([previousStorageId]);
      }

      const ext = file.name.split(".").pop();
      const storagePath = `slot-${slotNumber}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("testimonial-photos")
        .upload(storagePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage
        .from("testimonial-photos")
        .getPublicUrl(storagePath);

      const { error: updateError } = await supabase
        .from("testimonials")
        .update({
          photo_url: urlData.publicUrl,
          photo_storage_id: storagePath,
        })
        .eq("slot_number", slotNumber);

      if (updateError) throw new Error(updateError.message);
      await fetchSlots();
    },
    [fetchSlots],
  );

  const clearSlotPhoto = useCallback(
    async (slotNumber: number, storageId: string) => {
      const supabase = createClient();
      await supabase.storage.from("testimonial-photos").remove([storageId]);

      const { error: updateError } = await supabase
        .from("testimonials")
        .update({ photo_url: null, photo_storage_id: null })
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
    setSlotContent,
    clearSlot,
    setSlotPhoto,
    clearSlotPhoto,
  };
}

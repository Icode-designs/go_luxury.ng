// src/lib/settings/getGalleryImages.ts
//
// Public read of the 5 fixed homepage gallery slots. Relies on the
// "Public can view gallery images" RLS policy. The homepage section should
// only render once all 5 slots have an image — see isGalleryComplete().
import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface GalleryImage {
  slotNumber: number;
  imageUrl: string | null;
  caption: string | null;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gallery_images")
    .select("slot_number, image_url, caption")
    .order("slot_number", { ascending: true });

  if (error) {
    console.error("[getGalleryImages] fetch error:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    slotNumber: row.slot_number,
    imageUrl: row.image_url,
    caption: row.caption,
  }));
}

export function isGalleryComplete(images: GalleryImage[]): boolean {
  return images.length === 5 && images.every((img) => img.imageUrl !== null);
}

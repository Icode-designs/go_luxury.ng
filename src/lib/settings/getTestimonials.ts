// src/lib/settings/getTestimonials.ts
//
// Public read of the 5 fixed homepage "Kind Words" testimonial slots.
// Mirrors getGalleryImages.ts's fixed-slot pattern: getTestimonials() only
// returns slots the admin has actually filled in via /admin/reviews. Real
// testimonials phase in one at a time, and the homepage section stays
// hidden entirely (see Testimonials's `testimonials.length === 0` check)
// until at least one slot is real -- no placeholder copy is ever shown to
// customers.
import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface DisplayTestimonial {
  slotNumber: number;
  quote: string;
  customerName: string;
  customerLocation: string;
  rating: number;
  /** Real customer photo, if the admin has uploaded one for this slot. Null
   * if the admin hasn't added a photo yet -- the UI falls back to a
   * monogram avatar. */
  photoUrl: string | null;
}

export async function getTestimonials(): Promise<DisplayTestimonial[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select(
      "slot_number, quote, customer_name, customer_location, rating, photo_url",
    )
    .order("slot_number", { ascending: true });

  if (error) {
    console.error("[getTestimonials] fetch error:", error.message);
    // Fail soft — no real testimonials to show, so the homepage section
    // hides itself rather than erroring.
    return [];
  }

  return (data ?? [])
    .filter((row) => row.quote !== null && row.customer_name !== null)
    .map((row) => ({
      slotNumber: row.slot_number,
      quote: row.quote!,
      customerName: row.customer_name!,
      customerLocation: row.customer_location ?? "",
      rating: row.rating ?? 5,
      photoUrl: row.photo_url ?? null,
    }));
}

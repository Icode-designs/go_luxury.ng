/**
 * lib/orders/getDefaultAddress.ts
 * Small read used to prefill the checkout form for a returning, logged-in
 * customer — their default (or most recent) saved address, if any.
 */
import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SavedAddress {
  country: string;
  stateRegion: string;
  city: string;
  postalCode: string;
  street: string;
}

export async function getDefaultAddress(
  customerId: string,
): Promise<SavedAddress | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("country, state_region, city, postal_code, street, is_default, created_at")
    .eq("customer_id", customerId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[getDefaultAddress] fetch error:", error.message);
    return null;
  }

  return {
    country: data.country,
    stateRegion: data.state_region ?? "",
    city: data.city ?? "",
    postalCode: data.postal_code ?? "",
    street: data.street,
  };
}

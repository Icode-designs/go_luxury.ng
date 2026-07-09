// src/lib/customers/getCustomerForAdmin.ts
//
// Admin single-customer detail: contact info, addresses, order history.
// Same RLS-respecting server client convention as the other admin fetchers.
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/orders/getOrdersForAdmin";

export interface AdminCustomerDetail {
  id: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  detectedCountry: string | null;
  preferredCurrency: string | null;
  createdAt: string;
  isGuest: boolean;
  addresses: {
    id: string;
    street: string;
    city: string | null;
    stateRegion: string | null;
    country: string;
    postalCode: string | null;
    isDefault: boolean;
  }[];
  orders: {
    id: string;
    status: OrderStatus;
    currency: string;
    total: number;
    createdAt: string;
  }[];
}

interface RawCustomerDetail {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  auth_user_id: string | null;
  detected_country: string | null;
  preferred_currency: string | null;
  created_at: string;
  addresses: {
    id: string;
    street: string;
    city: string | null;
    state_region: string | null;
    country: string;
    postal_code: string | null;
    is_default: boolean;
  }[];
  orders: {
    id: string;
    status: OrderStatus;
    currency: string;
    total: number;
    created_at: string;
  }[];
}

export async function getCustomerForAdmin(
  customerId: string,
): Promise<AdminCustomerDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select(
      "id, full_name, email, phone, auth_user_id, detected_country, preferred_currency, created_at, addresses ( id, street, city, state_region, country, postal_code, is_default ), orders ( id, status, currency, total, created_at )",
    )
    .eq("id", customerId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[getCustomerForAdmin] fetch error:", error.message);
    return null;
  }

  const raw = data as unknown as RawCustomerDetail;

  return {
    id: raw.id,
    fullName: raw.full_name,
    email: raw.email,
    phone: raw.phone,
    detectedCountry: raw.detected_country,
    preferredCurrency: raw.preferred_currency,
    createdAt: raw.created_at,
    isGuest: raw.auth_user_id === null,
    addresses: (raw.addresses ?? []).map((a) => ({
      id: a.id,
      street: a.street,
      city: a.city,
      stateRegion: a.state_region,
      country: a.country,
      postalCode: a.postal_code,
      isDefault: a.is_default,
    })),
    orders: (raw.orders ?? [])
      .slice()
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .map((o) => ({
        id: o.id,
        status: o.status,
        currency: o.currency,
        total: o.total,
        createdAt: o.created_at,
      })),
  };
}

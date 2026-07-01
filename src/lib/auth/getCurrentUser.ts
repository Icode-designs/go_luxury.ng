/**
 * lib/auth/getCurrentUser.ts
 *
 * THE single server-side source of truth for user identity and role.
 *
 * USAGE: Call this from any Server Component, Server Action, Route Handler,
 * or proxy handler that needs to know who the current user is or whether
 * they are an admin. Do NOT reimplement ADMINS checks anywhere else.
 *
 * SECURITY MODEL:
 * - Reads the Supabase session via @supabase/ssr (httpOnly cookie-based).
 * - Queries CUSTOMERS and ADMINS tables fresh from the DB on every call.
 * - Never trusts client-supplied data for role determination.
 * - Never memoizes across requests (admin status can be revoked; the very
 *   next request after revocation must reflect that immediately).
 *
 * NOTE: React's `cache()` memoizes within a single render pass (one request)
 * only — not across requests. This is intentional: it prevents multiple
 * getCurrentUser() calls within a single page from making redundant DB
 * queries, while still re-running on every new request.
 */
import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CustomerRow {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  auth_user_id: string | null;
}

export interface AdminRow {
  id: string;
  auth_user_id: string;
  email: string;
}

export type CurrentUser =
  | {
      authUserId: string;
      role: "admin";
      admin: AdminRow;
      customer: null;
      /** isAdmin is derived purely from the ADMINS DB row — never from the client. */
      isAdmin: true;
    }
  | {
      authUserId: string;
      role: "customer";
      admin: null;
      customer: CustomerRow | null;
      /** isAdmin is derived purely from the ADMINS DB row — never from the client. */
      isAdmin: false;
    };

// ---------------------------------------------------------------------------
// Core helper
// ---------------------------------------------------------------------------

/**
 * Returns the resolved identity for the current request, or null if there
 * is no authenticated session.
 *
 * Wrapped in React cache() so multiple calls within one render pass share
 * one DB round-trip. Cache does NOT persist across requests.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  try {
    // 1. Read the Supabase session from the httpOnly cookie.
    const supabase = await createClient();
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser();

    if (sessionError || !user) {
      return null;
    }

    const authUserId = user.id;

    // 2. Use the service-role client for privileged DB queries.
    //    This bypasses RLS for the ADMINS and CUSTOMERS lookups.
    //    The anon-key client is only used above to read the session.
    const adminClient = createAdminClient();

    // 3. Look up ADMINS row first — this is the authoritative isAdmin determination.
    //    If this row exists, the user is an admin. We do NOT query the CUSTOMERS
    //    table for admins because the roles are strictly mutually exclusive.
    const { data: admin, error: adminError } = await adminClient
      .from("admins")
      .select("id, auth_user_id, email")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (adminError) {
      console.error(
        "[getCurrentUser] ADMINS lookup error:",
        adminError.message,
      );
      // Fail safely by returning null
      return null;
    }

    if (admin) {
      // Short-circuit: User is an admin. Return immediately without querying CUSTOMERS.
      // Performance note: This reduces DB queries from 2 to 1 for admin users.
      return {
        authUserId,
        role: "admin",
        admin,
        customer: null,
        isAdmin: true,
      };
    }

    // 4. Look up CUSTOMERS row ONLY if no ADMINS row exists.
    //    (may be null — e.g. an incomplete signup).
    const { data: customer, error: customerError } = await adminClient
      .from("customers")
      .select("id, full_name, email, phone, auth_user_id")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (customerError) {
      console.error(
        "[getCurrentUser] CUSTOMERS lookup error:",
        customerError.message,
      );
      // Fail safely by returning null
      return null;
    }

    return {
      authUserId,
      role: "customer",
      admin: null,
      customer: customer ?? null,
      isAdmin: false,
    };
  } catch (err) {
    console.error("[getCurrentUser] Unexpected error:", err);
    return null;
  }
});

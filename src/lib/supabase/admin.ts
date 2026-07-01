/**
 * lib/supabase/admin.ts
 *
 * Service-role Supabase client — server-only, privileged operations.
 *
 * SECURITY: This module must NEVER be imported by any client component.
 * The service-role key bypasses Row Level Security. It is used exclusively
 * for server-side admin queries (ADMINS table lookups, CUSTOMERS upserts).
 *
 * Enforced at module level by the 'server-only' import below.
 */
import "server-only";
import { createClient } from "@supabase/supabase-js";

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error(
      "[admin.ts] NEXT_PUBLIC_SUPABASE_URL is not set. Check your .env file.",
    );
  }
  if (!serviceRoleKey) {
    throw new Error(
      "[admin.ts] SUPABASE_SERVICE_ROLE_KEY is not set. " +
        "This key is required for privileged server-side operations " +
        "(ADMINS lookup, CUSTOMERS upsert). Add it to your .env file. " +
        "It must never be exposed to the client.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      // Disable auto-refresh and session persistence for a service-role client.
      // This client is used for one-off privileged DB queries only.
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export { createAdminClient };

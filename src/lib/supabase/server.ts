// lib/supabase/server.ts — for server components/actions
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Expected when called from a Server Component (e.g. a layout
            // or page) rather than a Server Action/Route Handler — Next.js
            // forbids cookie writes there. This only happens when Supabase
            // tries to persist a refreshed auth token during a read-only
            // request. It's safe to ignore: proxy.ts refreshes the session
            // cookie on every request that passes through it, so the
            // session stays valid. Without this try/catch the write throws,
            // getCurrentUser() catches it as an "unexpected error" and
            // returns null, which looked like random logouts/redirects to
            // /login on valid sessions.
          }
        },
      },
    },
  );
}

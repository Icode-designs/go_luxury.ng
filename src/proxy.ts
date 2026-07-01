/**
 * proxy.ts  (Next.js 16 — formerly middleware.ts)
 *
 * IMPORTANT: In Next.js 16, the file is named proxy.ts (not middleware.ts)
 * and the export is a named `proxy` function (not a default export).
 * See: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 *
 * This proxy protects all /admin/* routes:
 *
 *  - No session → redirect to /login (with returnTo so user lands back
 *    on the admin page they wanted after signing in).
 *  - Valid session but NOT admin → redirect to /login (do NOT show a
 *    "permission denied" page — this avoids confirming an admin tier exists
 *    to someone who holds a non-admin account).
 *  - Valid session and IS admin → check idle timeout, then allow through.
 *
 * IDLE TIMEOUT FOR ADMIN SESSIONS:
 * Admin sessions carry access to pricing, orders, and customer data, so a
 * shorter idle timeout is enforced (ADMIN_IDLE_TIMEOUT_MS, default 30 min).
 * Tracked via a server-set httpOnly cookie (gl_admin_last_active).
 * On each allowed admin request, the cookie is refreshed.
 *
 * IMPORTANT — DO NOT REMOVE PER-ACTION RE-VERIFICATION:
 * This proxy is one layer of defense, not the only one. Every admin-mutating
 * Server Action must independently call getCurrentUser() and check isAdmin
 * before executing, because Server Actions can be invoked directly (bypassing
 * this proxy). See the data-security guide in Next.js docs.
 *
 * CSRF: Next.js Server Actions enforce same-origin checks. This proxy does
 * not need to add CSRF headers for Server Action calls.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Admin session idle timeout: 30 minutes
const ADMIN_IDLE_TIMEOUT_MS = 30 * 60 * 1000;

/**
 * Lightweight admin check for the proxy context.
 *
 * We cannot call getCurrentUser() directly here because that function uses
 * `cookies()` from next/headers (a Server Component API), whereas the proxy
 * must use `request.cookies`. We replicate the essential check:
 *  1. Read the Supabase session from the request cookies.
 *  2. If a session exists, query the ADMINS table with the service-role key.
 *
 * This mirrors the same logic as getCurrentUser() but using the proxy-
 * compatible request.cookies API. The underlying DB query is identical.
 */
async function getSessionAndRole(request: NextRequest): Promise<{
  hasSession: boolean;
  authUserId: string | null;
  isAdmin: boolean;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
    console.error(
      "[proxy] Missing Supabase env vars — failing closed (deny access).",
    );
    return { hasSession: false, authUserId: null, isAdmin: false };
  }

  // Create a proxy-compatible Supabase client using request cookies
  const response = NextResponse.next();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { hasSession: false, authUserId: null, isAdmin: false };
  }

  // Query ADMINS table using the service-role client (bypasses RLS)
  const { createClient } = await import("@supabase/supabase-js");
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: adminRow, error: adminErr } = await adminClient
    .from("admins")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (adminErr) {
    console.error("[proxy] ADMINS lookup error:", adminErr.message);
    // Fail closed — deny access on DB error
    return { hasSession: true, authUserId: user.id, isAdmin: false };
  }

  return {
    hasSession: true,
    authUserId: user.id,
    isAdmin: adminRow !== null,
  };
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // This proxy only handles /admin/* — all other routes pass through.
  // (The matcher config below is the primary filter, but this guard
  // adds clarity and safety for any matcher changes.)
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const { hasSession, isAdmin } = await getSessionAndRole(request);

  // ── No session at all ─────────────────────────────────────────────────
  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    if (searchParams.toString()) {
      // Include original query string in returnTo
      loginUrl.searchParams.set(
        "returnTo",
        `${pathname}?${searchParams.toString()}`,
      );
    }
    return NextResponse.redirect(loginUrl);
  }

  // ── Session exists but user is NOT an admin ───────────────────────────
  // Redirect to /login — NOT a "permission denied" page.
  // This avoids confirming to a non-admin account holder that an admin
  // tier exists and that the right credentials would grant access.
  if (!isAdmin) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // ── Admin session — check idle timeout ───────────────────────────────
  const lastActiveStr = request.cookies.get("gl_admin_last_active")?.value;
  const now = Date.now();

  if (lastActiveStr) {
    const lastActive = parseInt(lastActiveStr, 10);
    const idleMs = now - lastActive;

    if (!isNaN(lastActive) && idleMs > ADMIN_IDLE_TIMEOUT_MS) {
      console.info(
        `[proxy] Admin session timed out after ${Math.round(idleMs / 60000)} minutes idle.`,
      );
      // Redirect to login — session is still technically valid in Supabase
      // but we enforce stricter idle timeout for admin routes here.
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnTo", pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      // Clear the last-active cookie on timeout
      redirectResponse.cookies.delete("gl_admin_last_active");
      return redirectResponse;
    }
  }

  // ── Verified admin within idle window — allow through ────────────────
  const nextResponse = NextResponse.next();

  // Refresh the last-active timestamp on every successful admin request
  nextResponse.cookies.set("gl_admin_last_active", String(now), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: ADMIN_IDLE_TIMEOUT_MS / 1000, // in seconds
  });

  return nextResponse;
}

// Only run on /admin/* routes
export const config = {
  matcher: ["/admin/:path*"],
};

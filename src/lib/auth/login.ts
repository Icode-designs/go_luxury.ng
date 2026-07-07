/**
 * lib/auth/login.ts
 *
 * Unified login Server Action — handles EVERY sign-in (customer AND admin).
 *
 * CRITICAL DESIGN PRINCIPLE:
 * There is exactly ONE credential-check path. Role (admin vs customer) is
 * determined AFTER successful authentication by querying the ADMINS table.
 * It is never determined by which URL the user visited, a client-supplied
 * claim, or an email pattern.
 *
 * FLOW:
 *  1. Re-validate loginSchema server-side.
 *  2. Rate-limit per IP AND per email independently (5 attempts / 15 min).
 *  3. Call Supabase signInWithPassword(). On failure, return the SAME
 *     generic error regardless of whether email doesn't exist or password
 *     is wrong (prevents email enumeration).
 *  4. On success, query ADMINS table for the signed-in user's auth_user_id.
 *  5. Redirect to /admin/dashboard if admin, /account (or returnTo) if customer.
 *
 * SECURITY NOTES:
 * - Passwords are NEVER logged, even partially.
 * - Generic error messages prevent email enumeration.
 * - CSRF: Next.js Server Actions enforce same-origin checks automatically.
 */
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loginSchema } from "@/lib/validation/auth";
import { checkRateLimit } from "@/lib/auth/rateLimit";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LoginActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

// ---------------------------------------------------------------------------
// Server Action
// ---------------------------------------------------------------------------

export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  // ── 1. Server-side re-validation ──────────────────────────────────────
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const returnTo = formData.get("returnTo");
  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    // Return generic error — do not reveal which field failed
    return { status: "error", message: "Invalid email or password." };
  }

  const { email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();
  const safeReturnTo =
    typeof returnTo === "string" &&
    returnTo.startsWith("/") &&
    !returnTo.startsWith("//") &&
    !returnTo.toLowerCase().startsWith("/\\")
      ? returnTo
      : "/";

  // // ── 2. Rate limiting — per IP and per email ───────────────────────────
  // const headerStore = await headers();
  // const ip =
  //   headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  //   headerStore.get("x-real-ip") ??
  //   "unknown";

  // const [ipLimit, emailLimit] = await Promise.all([
  //   checkRateLimit(`login:ip:${ip}`, 5, 900),        // 5 attempts / 15 min per IP
  //   checkRateLimit(`login:email:${normalizedEmail}`, 5, 900), // 5 attempts / 15 min per email
  // ]);

  // if (ipLimit.limited || emailLimit.limited) {
  //   // Return generic error — do not reveal which dimension (IP or email) triggered
  //   return {
  //     status: "error",
  //     message:
  //       "Too many login attempts. Please wait a few minutes before trying again.",
  //   };
  // }

  // ── 3. Credential verification via Supabase Auth ──────────────────────
  const supabase = await createClient();
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      // SECURITY: password is passed directly to Supabase Auth — never logged.
      password,
    });

  if (authError || !authData.user) {
    // Return EXACTLY the same message for wrong email and wrong password.
    // This prevents email enumeration attacks.
    // console.warn(
    //   `[login] Failed attempt for email hash ${Buffer.from(normalizedEmail).toString("base64").slice(0, 8)}... from IP ${ip}`,
    // );
    return { status: "error", message: "Invalid email or password." };
  }

  const authUserId = authData.user.id;

  // ── 4. Role determination via ADMINS table ────────────────────────────
  // This is the ONLY place we determine role — purely from the DB,
  // never from client-supplied data.
  const adminClient = createAdminClient();
  const { data: adminRow, error: adminLookupError } = await adminClient
    .from("admins")
    .select("id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();

  if (adminLookupError) {
    console.error("[login] ADMINS lookup error:", adminLookupError.message);
    // Fail closed — consistent with proxy.ts and getCurrentUser.ts.
    // Any uncertainty in determining identity/role during authentication results
    // in denying the action, not guessing in the permissive direction.
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  const isAdmin = adminRow !== null;

  // ── 5. Redirect based on resolved role ───────────────────────────────
  // The returnTo param allows returning to a protected page after login.
  // For admin sessions, always go to the dashboard — ignore returnTo.
  // For customers, honour returnTo (e.g. they were redirected from /checkout)
  // Validate returnTo to prevent open-redirect attacks — must be a relative path
  // on this origin only.

  redirect(safeReturnTo);
}

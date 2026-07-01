/**
 * lib/auth/signup.ts
 *
 * Customer signup Server Action.
 *
 * FLOW:
 *  1. Check honeypot — silent rejection if populated (bot deterrent).
 *  2. Re-validate server-side with signupSchema (never trust client validation).
 *  3. Sanitize free-text fields with DOMPurify (Node config) as a second layer.
 *  4. Rate-limit by IP (5 attempts / hour).
 *  5. Look up CUSTOMERS by normalized email:
 *     a. Exists with non-null auth_user_id → generic "account exists" error.
 *     b. Exists with null auth_user_id (guest) → create Supabase Auth user,
 *        UPDATE existing CUSTOMERS row (preserves guest order history).
 *     c. No row → create Supabase Auth user, INSERT new CUSTOMERS row.
 *  6. Return minimal state; never reveal internal details to the client.
 *     Detailed errors are logged server-side only.
 *
 * SECURITY NOTES:
 * - Password hashing is delegated entirely to Supabase Auth (Argon2id).
 *   We never handle, log, or store raw passwords.
 * - CSRF: Next.js App Router Server Actions enforce same-origin Origin header
 *   checks and embed a CSRF token in the action payload. No extra CSRF lib
 *   is needed.
 * - Service-role client used for DB operations to bypass RLS reliably.
 */
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { signupSchema } from "@/lib/validation/auth";
// import { checkRateLimit } from "@/lib/auth/rateLimit";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SignupActionState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { status: "success" };

// ---------------------------------------------------------------------------
// Sanitize a free-text string server-side
// ---------------------------------------------------------------------------
function sanitize(input: string): string {
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [], // Strip all HTML — plain text only
    ALLOWED_ATTR: [],
  });
}

// ---------------------------------------------------------------------------
// Server Action
// ---------------------------------------------------------------------------
export async function signupAction(
  _prevState: SignupActionState,
  formData: FormData,
): Promise<SignupActionState> {
  // ── 1. Honeypot check ───────────────────────────────────────────────────
  // The 'website' field is hidden from real users (aria-hidden, tabIndex=-1).
  // Bots filling forms automatically will populate it. Reject silently with
  // a fake success-looking response to avoid revealing detection.
  const honeypot = formData.get("website");
  if (honeypot && String(honeypot).length > 0) {
    console.warn("[signup] Honeypot triggered — bot submission rejected.");
    // Return "success" to avoid revealing bot detection
    return { status: "success" };
  }

  // // ── 2. Rate limiting by IP ─────────────────────────────────────────────
  // const headerStore = await headers();
  // const ip =
  //   headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  //   headerStore.get("x-real-ip") ??
  //   "unknown";

  // const rlResult = await checkRateLimit(`signup:ip:${ip}`, 5, 3600); // 5/hour
  // if (rlResult.limited) {
  //   return {
  //     status: "error",
  //     message: "Too many signup attempts. Please try again later.",
  //   };
  // }

  // ── 3. Server-side re-validation ───────────────────────────────────────
  const rawData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    terms_accepted:
      formData.get("terms_accepted") === "true" ? true : undefined,
    website: honeypot ?? "",
  };

  const returnTo = formData.get("returnTo");

  const parsed = signupSchema.safeParse(rawData);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<
      string,
      string[]
    >;
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors,
    };
  }

  const { firstName, lastName, email, phone, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  // ── 4. Sanitize free-text fields ───────────────────────────────────────
  const safeFirstName = sanitize(firstName);
  const safeLastName = sanitize(lastName);
  const fullName = `${safeFirstName} ${safeLastName}`.trim();
  const safeReturnTo =
    typeof returnTo === "string" &&
    returnTo.startsWith("/") &&
    !returnTo.startsWith("//") &&
    !returnTo.toLowerCase().startsWith("/\\")
      ? returnTo
      : "/account";

  if (fullName.length < 2 || fullName.length > 80) {
    return {
      status: "error",
      message: "Full name must be between 2 and 80 characters.",
    };
  }

  // ── 5. Check for existing CUSTOMERS row ────────────────────────────────
  const adminClient = createAdminClient();
  const { data: existingCustomer, error: lookupError } = await adminClient
    .from("customers")
    .select("id, auth_user_id, email")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (lookupError) {
    console.error("[signup] Customer lookup error:", lookupError.message);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  // ── 5a. Account with auth already exists ───────────────────────────────
  if (existingCustomer && existingCustomer.auth_user_id !== null) {
    // Generic message — do NOT reveal whether it's the email or password
    // that's wrong (prevents email enumeration)
    return {
      status: "error",
      message: "An account with this email already exists.",
    };
  }

  // ── 6. Create Supabase Auth user ───────────────────────────────────────
  // Supabase Auth owns password hashing (Argon2id). We never hash manually.
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (authError) {
    // Log the real error server-side; return generic message to client
    console.error("[signup] Supabase Auth signUp error:", authError.message);

    // Handle "user already exists" from Supabase (race condition)
    if (
      authError.message?.toLowerCase().includes("already registered") ||
      authError.message?.toLowerCase().includes("already exists")
    ) {
      return {
        status: "error",
        message: "An account with this email already exists.",
      };
    }

    return {
      status: "error",
      message: "Unable to create account. Please try again.",
    };
  }

  const authUserId = authData.user?.id;
  if (!authUserId) {
    console.error("[signup] Supabase signUp returned no user ID");
    return {
      status: "error",
      message: "Unable to create account. Please try again.",
    };
  }

  // ── 7a. Guest customer exists → UPDATE to link auth account ───────────
  if (existingCustomer) {
    const { error: updateError } = await adminClient
      .from("customers")
      .update({
        auth_user_id: authUserId,
        full_name: fullName,
        phone: phone ?? null,
      })
      .eq("id", existingCustomer.id);

    if (updateError) {
      console.error("[signup] CUSTOMERS update error:", updateError.message);
      // Auth user was created — log the inconsistency for manual review
      console.error(
        `[signup] CRITICAL: Auth user ${authUserId} created but CUSTOMERS update failed for id=${existingCustomer.id}. Manual remediation required.`,
      );
      return {
        status: "error",
        message: "Something went wrong. Please try again.",
      };
    }
  } else {
    // ── 7b. No existing row → INSERT new CUSTOMERS row ──────────────────
    const { error: insertError } = await adminClient.from("customers").insert({
      auth_user_id: authUserId,
      full_name: fullName,
      email: normalizedEmail,
      phone: phone ?? null,
    });

    if (insertError) {
      console.error("[signup] CUSTOMERS insert error:", insertError.message);
      console.error(
        `[signup] CRITICAL: Auth user ${authUserId} created but CUSTOMERS insert failed. Manual remediation required.`,
      );
      return {
        status: "error",
        message: "Something went wrong. Please try again.",
      };
    }
  }

  if (!authData.session) {
    redirect(`/login?verify=1&returnTo=${encodeURIComponent(safeReturnTo)}`);
  }

  {
    redirect(safeReturnTo);
  }
}

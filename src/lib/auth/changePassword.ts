/**
 * lib/auth/changePassword.ts
 *
 * "Change password" Server Action, usable by any authenticated role
 * (currently wired up for customers at /customer/settings).
 *
 * SECURITY:
 * - Requires re-entering the CURRENT password, verified by calling
 *   Supabase's signInWithPassword() again — this is the standard
 *   "reauthentication" pattern for sensitive account changes, and prevents
 *   someone with a hijacked, still-open browser session (but not the
 *   password) from silently taking over the account by changing its
 *   password.
 * - Reuses the exact password-complexity rules from signup (changePasswordSchema).
 * - Never logs raw passwords.
 */
"use server";

import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { createClient } from "@/lib/supabase/server";
import { changePasswordSchema } from "@/lib/validation/auth";

export type ChangePasswordState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { status: "success" };

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  // ── 1. Require an authenticated user (any role) ─────────────────────────
  const user = await getCurrentUser();
  if (!user) {
    return { status: "error", message: "Please log in to continue." };
  }

  const email = user.role === "customer" ? user.customer?.email : user.admin.email;
  if (!email) {
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  // ── 2. Server-side re-validation ────────────────────────────────────────
  const rawData = {
    currentPassword: formData.get("currentPassword") ?? "",
    newPassword: formData.get("newPassword") ?? "",
    confirmNewPassword: formData.get("confirmNewPassword") ?? "",
  };

  const parsed = changePasswordSchema.safeParse(rawData);
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

  const { currentPassword, newPassword } = parsed.data;

  const supabase = await createClient();

  // ── 3. Reauthenticate with the current password ─────────────────────────
  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (reauthError) {
    return {
      status: "error",
      message: "Current password is incorrect.",
      fieldErrors: { currentPassword: ["Current password is incorrect."] },
    };
  }

  // ── 4. Update the password ──────────────────────────────────────────────
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    console.error("[changePassword] updateUser error:", updateError.message);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  return { status: "success" };
}

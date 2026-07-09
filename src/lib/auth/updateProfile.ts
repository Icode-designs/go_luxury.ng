/**
 * lib/auth/updateProfile.ts
 *
 * Customer "edit profile" Server Action (full name + phone). Mirrors the
 * security pattern used across this codebase's Server Actions (submitReview,
 * placeOrder, etc.):
 *  1. Require an authenticated customer — never trust a client-supplied id.
 *  2. Re-validate server-side with profileSchema.
 *  3. Sanitize free-text with DOMPurify.
 *  4. Write through the RLS-respecting server client — safe because the
 *     "Customers update their own record" policy (auth_user_id = auth.uid())
 *     already scopes this to the caller's own row.
 */
"use server";

import DOMPurify from "isomorphic-dompurify";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validation/auth";

export type UpdateProfileState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { status: "success" };

function sanitize(input: string): string {
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

export async function updateProfileAction(
  _prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  // ── 1. Require an authenticated customer ────────────────────────────────
  const user = await getCurrentUser();
  if (!user || user.role !== "customer" || !user.customer) {
    return {
      status: "error",
      message: "Please log in to update your profile.",
    };
  }

  // ── 2. Server-side re-validation ────────────────────────────────────────
  const rawData = {
    fullName: formData.get("fullName") ?? "",
    phone: formData.get("phone") ?? "",
  };

  const parsed = profileSchema.safeParse(rawData);
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

  const safeFullName = sanitize(parsed.data.fullName);
  const phone = parsed.data.phone ? parsed.data.phone.trim() : null;

  // ── 3. Update — scoped to the caller's own row via RLS ──────────────────
  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .update({ full_name: safeFullName, phone })
    .eq("id", user.customer.id);

  if (error) {
    console.error("[updateProfile] update error:", error.message);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  revalidatePath("/customer");
  revalidatePath("/customer/settings");

  return { status: "success" };
}

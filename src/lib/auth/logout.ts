/**
 * lib/auth/logout.ts
 *
 * Sign-out Server Action, shared by both the admin sidebar and the customer
 * header. Uses the SSR server client so it clears the actual httpOnly
 * session cookie (the same cookie getCurrentUser() reads) rather than only
 * clearing client-side state — a plain client-side supabase.auth.signOut()
 * call would leave the server-readable cookie behind.
 */
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

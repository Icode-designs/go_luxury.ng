/**
 * app/api/me/route.ts
 *
 * Minimal client-safe identity endpoint for UI purposes ONLY.
 *
 * ⚠️  SECURITY WARNING — READ BEFORE USING THIS ENDPOINT:
 * The data returned by this endpoint (isAdmin, customerName) is used
 * EXCLUSIVELY for UI rendering decisions — e.g. whether to show an
 * "Admin Dashboard" link in the navbar.
 *
 * This endpoint is NOT a security boundary. The real enforcement lives in:
 *   1. proxy.ts — blocks unauthenticated/non-admin access to /admin/* routes.
 *   2. Per-action re-verification — every admin Server Action independently
 *      calls getCurrentUser() and checks isAdmin before executing.
 *
 * Client code MUST NOT use the `isAdmin` flag from this endpoint to gate
 * any actual privileged operation. It exists purely so the UI can decide
 * what to render.
 *
 * Only the minimum fields needed for UI rendering are returned.
 * The full admin record, auth_user_id, and any other sensitive identifiers
 * are NEVER exposed here.
 */
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          isAdmin: false,
          customerName: null,
          // ⚠️ UI-ONLY: Do not use this flag for any security decision.
          // See file-level comment above.
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        // ⚠️ UI-ONLY: This flag is for rendering decisions only (e.g. show
        // admin nav link). The real security enforcement is in proxy.ts and
        // per-action getCurrentUser() calls — not this response.
        isAdmin: user.isAdmin,

        // Only the display name — never auth_user_id, email, or admin record
        customerName: user.customer?.full_name ?? null,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[/api/me] Error:", err);
    return NextResponse.json(
      { isAdmin: false, customerName: null },
      { status: 200 }, // Return 200 even on error — UI gracefully degrades
    );
  }
}

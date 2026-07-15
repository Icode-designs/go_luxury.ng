// src/lib/richText/sanitizeRichText.ts
//
// Shared allowlist-based sanitizer for this app's free-text and rich-text
// surfaces (Terms & Policies / blog post bodies, plus every plain-text
// free-text field across signup/profile/reviews/orders/returns — see
// stripToPlainText below). Used in two places for the rich-text case, both
// required:
//   1. Client-side, right before saving (src/hook/useSiteContentManagement.ts,
//      blogPostForm.tsx via the Server Action) -- normalizes whatever the
//      contentEditable editor produced (browsers' execCommand can emit stray
//      <div>/<font>/style attributes) down to a clean, known-safe subset.
//   2. Server-side, every time the content is read back for public display
//      (getSiteContent.ts, getBlogPostById.ts) -- this is the real security
//      boundary, since that's the HTML that ends up in dangerouslySetInnerHTML
//      on the public pages. Sanitizing again here means the public page is
//      safe even if the stored value was ever edited directly (e.g. via the
//      Supabase dashboard) rather than through the admin editor.
//
// NOTE: this used to run on isomorphic-dompurify (DOMPurify + jsdom on the
// server). jsdom's dependency chain (html-encoding-sniffer -> @exodus/bytes)
// has an ESM-in-CommonJS require() that Vercel's server bundler can't load,
// which crashed every route that imported it with FUNCTION_INVOCATION_FAILED
// (surfaced on /terms, but any of the plain-text sanitize() call sites below
// were one bundling quirk away from the same crash). sanitize-html is pure
// JS (htmlparser2-based, no DOM emulation, no jsdom), so it doesn't have this
// problem and is a better fit for a server-only sanitizer anyway.
import sanitizeHtml from "sanitize-html";

export const RICH_TEXT_ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
];

export const RICH_TEXT_ALLOWED_ATTR = ["href", "target", "rel"];

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  return sanitizeHtml(html, {
    allowedTags: RICH_TEXT_ALLOWED_TAGS,
    allowedAttributes: {
      a: RICH_TEXT_ALLOWED_ATTR,
    },
    // Belt-and-braces on top of the tag/attribute allowlist: only allow
    // plain http(s) URLs, blocking javascript: and data: schemes --
    // sanitize-html strips the href entirely if the scheme isn't allowed.
    allowedSchemes: ["http", "https"],
    // Force safe attributes on every surviving anchor so pasted markup can
    // never produce a target="_blank" link without rel="noopener noreferrer"
    // (tabnabbing).
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs.href
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {}),
        },
      }),
    },
  }).trim();
}

/**
 * Strips ALL HTML down to plain text. Used for short single-line free-text
 * fields across the app (names, addresses, review text, return details,
 * etc.) that should never contain markup — this is a second sanitization
 * layer on top of each field's Zod validation (which already rejects raw
 * HTML/javascript: via HTML_SCRIPT_PATTERN).
 */
export function stripToPlainText(input: string): string {
  return sanitizeHtml(input.trim(), {
    allowedTags: [],
    allowedAttributes: {},
  });
}

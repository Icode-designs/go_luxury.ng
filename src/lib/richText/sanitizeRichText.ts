// src/lib/richText/sanitizeRichText.ts
//
// Shared allowlist-based sanitizer for the small rich-text surfaces in this
// app (currently just Terms & Policies). Used in two places, both required:
//   1. Client-side, right before saving (src/hook/useSiteContentManagement.ts)
//      -- normalizes whatever the contentEditable editor produced (browsers'
//      execCommand can emit stray <div>/<font>/style attributes) down to a
//      clean, known-safe subset.
//   2. Server-side, every time the content is read back for public display
//      (src/lib/settings/getSiteContent.ts) -- this is the real security
//      boundary, since that's the HTML that ends up in dangerouslySetInnerHTML
//      on the public /terms page. Sanitizing again here means the public
//      page is safe even if the stored value was ever edited directly
//      (e.g. via the Supabase dashboard) rather than through this editor.
//
// isomorphic-dompurify runs the exact same DOMPurify library on both sides
// (jsdom-backed on the server), so this one module is safe to import from
// either a "use client" hook or a "server-only" data-access file.
import DOMPurify from "isomorphic-dompurify";

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

// Belt-and-braces on top of the tag/attribute allowlist: strip any <a> whose
// href isn't a plain http(s) URL (blocks javascript:, data:, etc.), and force
// safe attributes on the ones that remain so pasted markup can never produce
// a target="_blank" link without rel="noopener noreferrer" (tabnabbing).
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    const href = node.getAttribute("href") ?? "";
    if (!/^https:\/\//i.test(href) && !/^http:\/\//i.test(href)) {
      node.removeAttribute("href");
    } else {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  }
});

export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: RICH_TEXT_ALLOWED_TAGS,
    ALLOWED_ATTR: RICH_TEXT_ALLOWED_ATTR,
  }).trim();
}

import type { NextConfig } from "next";

// Security headers applied to every route. These are defense-in-depth: they
// don't replace server-side auth/validation, but they close off common
// browser-side attack vectors (clickjacking, MIME sniffing, referrer leaks).
const securityHeaders = [
  // Superseded by CSP frame-ancestors below in modern browsers, but kept
  // for older browser coverage.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Supabase is the only third-party origin the app talks to from the
    // browser today. Tighten this further (or extend it) if new
    // integrations are added — do not widen with a wildcard.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

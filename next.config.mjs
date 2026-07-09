// CSP allows 'unsafe-inline' for script-src (the GA4 inline init snippet in
// app/layout.tsx) and style-src (Framer Motion + other libraries set inline
// `style=""` attributes at runtime for animation — there is no practical way
// to avoid this without a nonce-based rewrite of every animated component).
// Everything else is scoped to 'self' plus the specific third-party origins
// actually in use (Cloudinary images are proxied through /_next/image and
// never fetched directly by the browser, so no image host needs whitelisting
// beyond 'self').
//
// 'unsafe-eval' is added ONLY in development — Next.js Fast Refresh/HMR uses
// eval() for its dev-time source maps and the app fails to hydrate at all
// without it in dev. Production builds never call eval(), so it's correctly
// omitted from the deployed CSP.
const isDev = process.env.NODE_ENV !== "production";
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://challenges.cloudflare.com https://www.google-analytics.com https://analytics.google.com",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    // The Manufacturing page was renamed to Services; keep old links/SEO alive.
    return [
      {
        source: "/manufacturing",
        destination: "/services",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

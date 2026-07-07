import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/db";
import SiteChrome from "@/components/layout/SiteChrome";
import { cn } from "@/lib/utils";
import { SITE_URL, SITE_NAME, buildOrganizationSchema } from "@/lib/seo";

/* ─────────────────────────────────────────────────────────────
   FONTS — via next/font (zero CDN link tags)
   Exact import block from design-system-spec-0A Deliverable 2A.
───────────────────────────────────────────────────────────── */
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  variable: "--font-sans",
  display: "swap",
});

/* ─────────────────────────────────────────────────────────────
   METADATA
   Title from spec; description verbatim from master plan §14 home subheading.
───────────────────────────────────────────────────────────── */
const DEFAULT_DESCRIPTION =
  "MH Global Attire manufactures customized apparel for brands, importers, wholesalers and private-label businesses, with support from product development and fabric selection to production, quality control, packing and shipment.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} | Premium B2B Apparel Manufacturing`,
  },
  description: DEFAULT_DESCRIPTION,
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetched once at the root so the navbar mega-menu and footer sitemap can
  // both use the same live category list without duplicating the query.
  const [categories, whatsappSetting] = await Promise.all([
    prisma.category.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { name: true, slug: true, heroImage: true, gsmRange: true },
    }),
    prisma.siteSetting.findUniqueOrThrow({ where: { key: "whatsapp" } }),
  ]);

  const organizationSchema = buildOrganizationSchema({ whatsapp: whatsappSetting.value });
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en"
      className={cn(cormorantGaramond.variable, inter.variable)}
    >
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        {/* Skip to main content — first focusable element for keyboard/screen-reader users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:px-4 focus:py-2 focus:bg-crimson focus:text-white focus:rounded-btn focus:font-sans focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>

        <SiteChrome categories={categories}>{children}</SiteChrome>

        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}

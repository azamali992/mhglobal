/**
 * lib/seo-metadata.ts — server-only metadata builder (Phase 6 + admin SEO tab).
 *
 * Split out from lib/seo.ts because this file queries Prisma — importing it
 * from a "use client" component (PageHero.tsx does, for buildBreadcrumbSchema
 * in lib/seo.ts) would bundle the Postgres driver into the browser build and
 * fail. Only Server Component generateMetadata() functions should import
 * from here.
 */

import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

function ogImageUrl(title: string): string {
  return absoluteUrl(`/api/og?title=${encodeURIComponent(title)}`);
}

interface BuildMetadataInput {
  /** Plain page title, without the "| MH Global Attire" suffix — the root layout's title template adds that. */
  title: string;
  description: string;
  /** Route path, e.g. "/about" or "/products/t-shirts" */
  path: string;
  /**
   * Optional social-share image. Product/category pages pass their real photo
   * (Cloudinary URL or a "/images/..." path) so shares show the product rather
   * than the generic text card. When omitted, the dynamic OG card is used.
   */
  image?: string | null;
}

/**
 * Merges canonical + Open Graph + Twitter card metadata on top of a page's
 * title/description, so every page gets consistent social/SEO metadata
 * without repeating the same boilerplate 13 times.
 *
 * Checks the PageSeo table for an admin-editable override of title/
 * description first — a row is optional, and either field can be left
 * blank, in which case the caller's code-defined default is used instead.
 * Because the dynamic OG image (app/api/og) is generated from whatever
 * title is ultimately resolved here, editing a page's title in the admin
 * panel automatically updates its social-share image too.
 */
export async function buildMetadata(input: BuildMetadataInput): Promise<Metadata> {
  const override = await prisma.pageSeo.findUnique({ where: { path: input.path } }).catch(() => null);
  const title = override?.title || input.title;
  const description = override?.description || input.description;

  const url = absoluteUrl(input.path);

  // A real product/category photo overrides the generated card. Cloudinary
  // URLs are already absolute; local "/images/..." paths are absolutized.
  // Custom photos vary in aspect ratio, so we don't assert 1200x630 on them.
  const custom = input.image
    ? input.image.startsWith("http")
      ? input.image
      : absoluteUrl(input.image)
    : null;
  const ogImages = custom
    ? [{ url: custom, alt: title }]
    : [{ url: ogImageUrl(title), width: 1200, height: 630, alt: title }];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImages[0].url],
    },
  };
}

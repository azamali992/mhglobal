/**
 * lib/seo.ts — shared SEO helpers (Phase 6).
 *
 * Client-safe on purpose: PageHero.tsx ("use client") imports
 * buildBreadcrumbSchema from here, so this file must never import
 * anything server/Node-only (Prisma, the Postgres driver, etc.) — doing so
 * would pull those into the client bundle and break the build. The one
 * function that genuinely needs a database read (buildMetadata, for the
 * admin-editable per-page SEO overrides) lives in lib/seo-metadata.ts
 * instead, which only Server Components (generateMetadata) import.
 *
 * SITE_URL: the canonical production origin. Override with NEXT_PUBLIC_SITE_URL
 * once the real domain/hosting is finalized at deploy time; falls back to the
 * known production domain, then localhost in dev.
 */

const PRODUCTION_URL = "https://www.mhglobalattire.com";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:3000");

export const SITE_NAME = "MH Global Attire";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

// ─── JSON-LD schema builders ────────────────────────────────────────────────

interface OrganizationSchemaInput {
  whatsapp: string;
}

export function buildOrganizationSchema({ whatsapp }: OrganizationSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: "Hassan Mills, New Mandi Road",
      addressLocality: "Faisalabad",
      addressRegion: "Punjab",
      postalCode: "38000",
      addressCountry: "PK",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: whatsapp,
      contactType: "sales",
      email: "info@mhglobalattire.com",
      areaServed: "Worldwide",
      availableLanguage: "English",
    },
    sameAs: [
      "https://www.instagram.com/mhglobalattire/",
      "https://www.linkedin.com/company/mh-global-attire/",
    ],
  };
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

interface ProductSchemaInput {
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  description: string | null;
  fabricOptions: string[];
  gsmRange: string | null;
  image?: string | null;
}

export function buildProductSchema(product: ProductSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    category: product.categoryName,
    url: absoluteUrl(`/products/${product.categorySlug}/${product.slug}`),
    image: product.image ? absoluteUrl(product.image) : undefined,
    material: product.fabricOptions.length > 0 ? product.fabricOptions.join(", ") : undefined,
    additionalProperty: product.gsmRange
      ? [{ "@type": "PropertyValue", name: "GSM Range", value: product.gsmRange }]
      : undefined,
    brand: { "@type": "Brand", name: SITE_NAME },
    manufacturer: { "@type": "Organization", name: SITE_NAME },
  };
}

interface ServiceSchemaInput {
  name: string;
  description: string;
  path: string;
}

export function buildServiceSchema({ name, description, path }: ServiceSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url: absoluteUrl(path),
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: "Worldwide",
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

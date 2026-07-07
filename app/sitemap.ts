import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/seo";

const STATIC_ROUTES = [
  "/",
  "/about",
  "/products",
  "/manufacturing",
  "/oem-services",
  "/quality-assurance",
  "/sustainability",
  "/why-choose-us",
  "/contact",
  "/request-a-quote",
  "/privacy-policy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await prisma.category.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: absoluteUrl(`/products/${c.slug}`),
    lastModified: c.updatedAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...categoryEntries];
}

export const dynamic = "force-dynamic";

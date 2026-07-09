/**
 * app/admin/seo/page.tsx
 * Server Component: builds the full list of public page paths (static
 * routes + live category slugs), merges in any existing PageSeo overrides,
 * and renders AdminShell + SeoClient.
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import AdminShell from "@/components/admin/admin-shell";
import SeoClient from "./seo-client";

export const metadata: Metadata = {
  title: "SEO — MH Global Attire Admin",
  robots: { index: false, follow: false },
};

const STATIC_PAGES: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/products", label: "Products (index)" },
  { path: "/services", label: "Services" },
  { path: "/oem-services", label: "OEM Services" },
  { path: "/quality-assurance", label: "Quality Assurance" },
  { path: "/sustainability", label: "Sustainability" },
  { path: "/why-choose-us", label: "Why Choose Us" },
  { path: "/contact", label: "Contact" },
  { path: "/request-a-quote", label: "Request a Quote" },
  { path: "/privacy-policy", label: "Privacy Policy" },
  { path: "/terms", label: "Terms & Conditions" },
];

export default async function SeoPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [categories, overrides, newInquiryCount] = await Promise.all([
    prisma.category.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      select: { name: true, slug: true },
    }),
    prisma.pageSeo.findMany(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
  ]);

  const pages = [
    ...STATIC_PAGES,
    ...categories.map((c) => ({ path: `/products/${c.slug}`, label: `Products / ${c.name}` })),
  ];

  const overrideByPath = Object.fromEntries(overrides.map((o) => [o.path, o]));

  const rows = pages.map((p) => ({
    path: p.path,
    label: p.label,
    title: overrideByPath[p.path]?.title ?? "",
    description: overrideByPath[p.path]?.description ?? "",
  }));

  const user = {
    name: session.user.name ?? null,
    email: session.user.email,
  };

  return (
    <AdminShell pageTitle="SEO" activePath="/admin/seo" user={user} newInquiryCount={newInquiryCount}>
      <SeoClient rows={rows} />
    </AdminShell>
  );
}

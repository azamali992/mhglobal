/**
 * app/admin/categories/page.tsx
 * Server Component wrapper: exports metadata, fetches initial categories,
 * renders AdminShell + CategoriesClient (the interactive Client Component).
 * The interactive UI is "Client Component" per spec — implemented in categories-client.tsx.
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import AdminShell from "@/components/admin/admin-shell";
import CategoriesClient from "./categories-client";

export const metadata: Metadata = {
  title: "Categories — MH Global Attire Admin",
  robots: { index: false, follow: false },
};

export default async function CategoriesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [categories, newInquiryCount] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        gsmRange: true,
        heroImage: true,
        order: true,
        published: true,
      },
    }),
    prisma.inquiry.count({ where: { status: "NEW" } }),
  ]);

  const user = {
    name: session.user.name ?? null,
    email: session.user.email,
  };

  return (
    <AdminShell
      pageTitle="Categories"
      activePath="/admin/categories"
      user={user}
      newInquiryCount={newInquiryCount}
    >
      <CategoriesClient initialCategories={categories} cloudinaryConfigured={isCloudinaryConfigured()} />
    </AdminShell>
  );
}

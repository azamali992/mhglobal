/**
 * app/admin/products/page.tsx
 * Server Component wrapper: exports metadata, fetches initial products + categories,
 * renders AdminShell + ProductsClient (the interactive Client Component).
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import AdminShell from "@/components/admin/admin-shell";
import ProductsClient from "./products-client";

export const metadata: Metadata = {
  title: "Products — MH Global Attire Admin",
  robots: { index: false, follow: false },
};

export default async function ProductsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [categories, rawProducts, newInquiryCount] = await Promise.all([
    prisma.category.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name: true },
    }),
    prisma.product.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        description: true,
        fabricOptions: true,
        gsmRange: true,
        sizes: true,
        customization: true,
        images: true,
        order: true,
        published: true,
        category: { select: { name: true } },
      },
    }),
    prisma.inquiry.count({ where: { status: "NEW" } }),
  ]);

  const products = rawProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    categoryId: p.categoryId,
    categoryName: p.category.name,
    description: p.description,
    fabricOptions: p.fabricOptions,
    gsmRange: p.gsmRange,
    sizes: p.sizes,
    customization: p.customization,
    images: p.images,
    order: p.order,
    published: p.published,
  }));

  const user = {
    name: session.user.name ?? null,
    email: session.user.email,
  };

  return (
    <AdminShell
      pageTitle="Products"
      activePath="/admin/products"
      user={user}
      newInquiryCount={newInquiryCount}
    >
      <ProductsClient initialProducts={products} categories={categories} cloudinaryConfigured={isCloudinaryConfigured()} />
    </AdminShell>
  );
}

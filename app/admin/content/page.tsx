/**
 * app/admin/content/page.tsx
 * Server Component: fetches all ContentBlock rows, renders AdminShell + ContentClient.
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import AdminShell from "@/components/admin/admin-shell";
import ContentClient from "./content-client";

export const metadata: Metadata = {
  title: "Page Content — MH Global Attire Admin",
  robots: { index: false, follow: false },
};

export default async function ContentPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [allBlocks, newInquiryCount] = await Promise.all([
    prisma.contentBlock.findMany({
      orderBy: [{ page: "asc" }, { order: "asc" }],
      select: {
        id: true,
        page: true,
        key: true,
        value: true,
        imageUrl: true,
        order: true,
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
      pageTitle="Page Content"
      activePath="/admin/content"
      user={user}
      newInquiryCount={newInquiryCount}
    >
      <ContentClient allBlocks={allBlocks} cloudinaryConfigured={isCloudinaryConfigured()} />
    </AdminShell>
  );
}

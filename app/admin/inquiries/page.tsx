/**
 * app/admin/inquiries/page.tsx
 * Server Component wrapper: exports metadata, fetches all inquiries,
 * renders AdminShell + InquiriesClient.
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import AdminShell from "@/components/admin/admin-shell";
import InquiriesClient from "./inquiries-client";

export const metadata: Metadata = {
  title: "Inquiries — MH Global Attire Admin",
  robots: { index: false, follow: false },
};

export default async function InquiriesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [inquiries, newInquiryCount] = await Promise.all([
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        company: true,
        country: true,
        email: true,
        phone: true,
        productInterest: true,
        quantity: true,
        fabric: true,
        gsm: true,
        customization: true,
        message: true,
        fileUrls: true,
        status: true,
        createdAt: true,
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
      pageTitle="Inquiries"
      activePath="/admin/inquiries"
      user={user}
      newInquiryCount={newInquiryCount}
    >
      <InquiriesClient initialInquiries={inquiries} />
    </AdminShell>
  );
}

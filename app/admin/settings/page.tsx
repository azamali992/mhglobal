/**
 * app/admin/settings/page.tsx
 * Server Component: fetches all SiteSettings, renders AdminShell + SettingsClient.
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import AdminShell from "@/components/admin/admin-shell";
import SettingsClient from "./settings-client";

export const metadata: Metadata = {
  title: "Settings — MH Global Attire Admin",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [siteSettings, newInquiryCount] = await Promise.all([
    prisma.siteSetting.findMany({ select: { key: true, value: true } }),
    prisma.inquiry.count({ where: { status: "NEW" } }),
  ]);

  const settingsMap: Record<string, string> = Object.fromEntries(
    siteSettings.map((s) => [s.key, s.value])
  );

  const user = {
    name: session.user.name ?? null,
    email: session.user.email,
  };

  return (
    <AdminShell
      pageTitle="Settings"
      activePath="/admin/settings"
      user={user}
      newInquiryCount={newInquiryCount}
    >
      <SettingsClient initialSettings={settingsMap} />
    </AdminShell>
  );
}

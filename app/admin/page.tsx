/**
 * app/admin/page.tsx — Dashboard (Phase 2A)
 * Server Component: fetches all data server-side, renders AdminShell + content.
 * Metadata is exported here (not from a Client Component child) per Next.js rules.
 * Spec Section 2.
 */

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  PlusCircleIcon,
  FolderPlusIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import AdminShell from "@/components/admin/admin-shell";
import StatCard from "@/components/admin/stat-card";
import LatestInquiries from "@/components/admin/latest-inquiries";

export const metadata: Metadata = {
  title: "Dashboard — MH Global Attire Admin",
  robots: { index: false, follow: false },
};

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const [newInquiryCount, totalInquiries, publishedProducts, latestInquiries] =
    await Promise.all([
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.inquiry.count(),
      prisma.product.count({ where: { published: true } }),
      // Select every field the drawer renders — the dashboard row opens the
      // same InquiryDrawer as the Inquiries page, so a partial select would
      // leave the buyer's details blank once opened.
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
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
    ]);

  const user = {
    name: session.user.name ?? null,
    email: session.user.email,
  };

  const hour = new Date().getHours();
  const greeting = getGreeting(hour);

  return (
    <AdminShell
      pageTitle="Dashboard"
      activePath="/admin"
      user={user}
      newInquiryCount={newInquiryCount}
    >
      <div className="max-w-5xl w-full">
        <div className="space-y-8">
          {/* Greeting */}
          <div className="mb-8">
            <p className="font-sans text-lg font-semibold text-navy">
              {greeting}, {session.user.name ?? "Admin"}
            </p>
            <p className="font-sans text-sm text-ink-muted mt-1">
              Here&apos;s what&apos;s happening with your store today.
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Inquiries Awaiting Review"
              value={newInquiryCount}
              description="require your attention"
              href="/admin/inquiries"
            />
            <StatCard
              label="Total Inquiries"
              value={totalInquiries}
              description="all time"
              href="/admin/inquiries"
            />
            <StatCard
              label="Published Products"
              value={publishedProducts}
              description="visible on website"
              href="/admin/products"
            />
          </div>

          {/* Latest inquiries panel */}
          <LatestInquiries inquiries={latestInquiries} />

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/admin/products?action=new"
              className="bg-white rounded-card shadow-card p-6 flex flex-col items-start gap-3
                         hover:shadow-[0_4px_20px_rgba(10,34,64,0.14)] transition-shadow duration-200 cursor-pointer"
            >
              <PlusCircleIcon className="h-6 w-6 text-crimson" aria-hidden="true" />
              <div>
                <p className="font-sans text-sm font-semibold text-navy">Add New Product</p>
                <p className="font-sans text-caption text-ink-muted">
                  Create a new product listing
                </p>
              </div>
            </a>
            <a
              href="/admin/categories?action=new"
              className="bg-white rounded-card shadow-card p-6 flex flex-col items-start gap-3
                         hover:shadow-[0_4px_20px_rgba(10,34,64,0.14)] transition-shadow duration-200 cursor-pointer"
            >
              <FolderPlusIcon className="h-6 w-6 text-crimson" aria-hidden="true" />
              <div>
                <p className="font-sans text-sm font-semibold text-navy">Add New Category</p>
                <p className="font-sans text-caption text-ink-muted">
                  Create a new product category
                </p>
              </div>
            </a>
            <a
              href="/admin/content"
              className="bg-white rounded-card shadow-card p-6 flex flex-col items-start gap-3
                         hover:shadow-[0_4px_20px_rgba(10,34,64,0.14)] transition-shadow duration-200 cursor-pointer"
            >
              <DocumentTextIcon className="h-6 w-6 text-crimson" aria-hidden="true" />
              <div>
                <p className="font-sans text-sm font-semibold text-navy">Edit Site Content</p>
                <p className="font-sans text-caption text-ink-muted">
                  Update page text and headings
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

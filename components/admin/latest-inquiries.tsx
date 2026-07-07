"use client";

import React, { useState } from "react";
import Badge, { statusBadgeProps } from "@/components/ui/badge";
import InquiryDrawer from "@/components/admin/inquiry-drawer";
import { updateInquiryStatusAction } from "@/app/admin/inquiries/actions";
import { useToast } from "@/components/admin/toast-notification";

type InquiryStatus = "NEW" | "REVIEWED" | "QUOTED" | "CLOSED";

export interface LatestInquiriesProps {
  inquiries: Array<{
    id: string;
    company: string | null;
    name: string;
    country: string | null;
    createdAt: Date;
    status: InquiryStatus;
  }>;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * LatestInquiries — dashboard panel showing 5 most recent inquiries.
 * Rows are clickable, opening InquiryDrawer.
 * Spec Section 2.4.
 */
export default function LatestInquiries({ inquiries: initialInquiries }: LatestInquiriesProps) {
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectedInquiry = inquiries.find((i) => i.id === selectedId) ?? null;

  // For the drawer we need the full inquiry shape; since this is a partial list
  // component, null out fields not present in LatestInquiriesProps
  const fullInquiry = selectedInquiry
    ? {
        ...selectedInquiry,
        email: "",
        phone: null,
        productInterest: null,
        quantity: null,
        fabric: null,
        gsm: null,
        customization: null,
        message: null,
        fileUrls: [] as string[],
      }
    : null;

  function handleRowClick(id: string) {
    setSelectedId(id);
    setDrawerOpen(true);
  }

  async function handleStatusChange(id: string, newStatus: InquiryStatus) {
    const prev = inquiries.find((i) => i.id === id)?.status;

    // Optimistic update
    setInquiries((curr) =>
      curr.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );

    const result = await updateInquiryStatusAction(id, newStatus);
    if (!result.success) {
      // Revert
      setInquiries((curr) =>
        curr.map((i) => (i.id === id ? { ...i, status: prev! } : i))
      );
      showToast("Could not update status — please try again.", "error");
    }
  }

  return (
    <>
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        {/* Panel header */}
        <div className="px-6 py-4 border-b border-line flex items-center justify-between">
          <h2 className="font-sans text-sm font-semibold text-navy">Latest Inquiries</h2>
          <a
            href="/admin/inquiries"
            className="font-sans text-sm text-crimson hover:text-crimson-600 transition-colors duration-150"
          >
            View all
          </a>
        </div>

        {inquiries.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-sans text-sm text-ink-muted">
              No inquiries yet — your contact form submissions will appear here.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
                  Company
                </th>
                <th className="text-left px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted hidden sm:table-cell">
                  Country
                </th>
                <th className="text-left px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted hidden md:table-cell">
                  Date Received
                </th>
                <th className="text-left px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/50">
              {inquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  onClick={() => handleRowClick(inquiry.id)}
                  className="cursor-pointer hover:bg-cream-100 transition-colors duration-150"
                >
                  <td className="px-6 py-3 font-sans text-sm text-navy">
                    {inquiry.company ?? inquiry.name}
                  </td>
                  <td className="px-6 py-3 font-sans text-sm text-navy hidden sm:table-cell">
                    {inquiry.country ?? "—"}
                  </td>
                  <td className="px-6 py-3 font-sans text-sm text-navy hidden md:table-cell">
                    {formatDate(inquiry.createdAt)}
                  </td>
                  <td className="px-6 py-3 font-sans text-sm text-navy">
                    <Badge variant={statusBadgeProps(inquiry.status).variant}>
                      {statusBadgeProps(inquiry.status).label}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <InquiryDrawer
        inquiry={fullInquiry}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </>
  );
}

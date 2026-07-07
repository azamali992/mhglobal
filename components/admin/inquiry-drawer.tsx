"use client";

import React, { useState } from "react";
import {
  EnvelopeIcon,
  DocumentIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import AdminDrawer from "@/components/admin/admin-drawer";
import AdminConfirmDialog from "@/components/admin/admin-confirm-dialog";
import Badge, { statusBadgeProps } from "@/components/ui/badge";

type InquiryStatus = "NEW" | "REVIEWED" | "QUOTED" | "CLOSED";

export interface InquiryDrawerProps {
  inquiry: {
    id: string;
    name: string;
    company: string | null;
    country: string | null;
    email: string;
    phone: string | null;
    productInterest: string | null;
    quantity: string | null;
    fabric: string | null;
    gsm: string | null;
    customization: string | null;
    message: string | null;
    fileUrls: string[];
    status: InquiryStatus;
    createdAt: Date;
  } | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: InquiryStatus) => void;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getFilename(url: string): string {
  const withoutQuery = url.split("?")[0];
  const parts = withoutQuery.split("/");
  return parts[parts.length - 1] || url;
}

function truncateFilename(filename: string, maxLen: number = 32): string {
  if (filename.length <= maxLen) return filename;
  return "..." + filename.slice(filename.length - (maxLen - 3));
}

function isImageUrl(url: string): boolean {
  const lower = url.toLowerCase().split("?")[0];
  return /\.(jpg|jpeg|png|webp|gif|svg)$/.test(lower);
}

const STATUS_BUTTONS: { value: InquiryStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "REVIEWED", label: "In Review" },
  { value: "QUOTED", label: "Quoted" },
  { value: "CLOSED", label: "Closed" },
];

interface DetailFieldProps {
  label: string;
  children: React.ReactNode;
}

function DetailField({ label, children }: DetailFieldProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="font-sans text-caption font-medium text-ink-muted uppercase tracking-[0.06em]">
        {label}
      </p>
      <div className="font-sans text-sm text-navy">{children}</div>
    </div>
  );
}

/**
 * InquiryDrawer — sliding detail panel for a single inquiry.
 * Shows all buyer fields, status segmented control, and reply button.
 * Spec Section 5.4.
 */
export default function InquiryDrawer({
  inquiry,
  open,
  onClose,
  onStatusChange,
}: InquiryDrawerProps) {
  const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<InquiryStatus | null>(null);

  if (!inquiry) return null;

  function handleStatusClick(newStatus: InquiryStatus) {
    if (newStatus === inquiry!.status) return;
    if (newStatus === "CLOSED") {
      setPendingStatus(newStatus);
      setConfirmCloseOpen(true);
    } else {
      onStatusChange(inquiry!.id, newStatus);
    }
  }

  function handleConfirmClose() {
    if (pendingStatus) {
      onStatusChange(inquiry!.id, pendingStatus);
    }
    setConfirmCloseOpen(false);
    setPendingStatus(null);
  }

  const emailSubject = encodeURIComponent("Re: Your Enquiry — MH Global Attire");
  const emailBody = encodeURIComponent(
    `Dear ${inquiry.name},\r\n\r\nThank you for your enquiry.`
  );

  const footer = (
    <a
      href={`mailto:${inquiry.email}?subject=${emailSubject}&body=${emailBody}`}
      className="inline-flex items-center justify-center gap-2 font-sans font-semibold
                 text-sm px-6 py-3 rounded-btn bg-crimson text-white
                 hover:bg-crimson-600 transition-colors duration-150
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-crimson"
    >
      <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
      Reply by Email
    </a>
  );

  return (
    <>
      <AdminDrawer
        open={open}
        onClose={onClose}
        title={inquiry.company ?? inquiry.name}
        footer={footer}
        widthClassName="md:max-w-2xl"
      >
        <div className="flex flex-col gap-6">
          {/* Header content */}
          <div>
            <h2 className="font-sans text-lg font-semibold text-navy">
              {inquiry.company ?? inquiry.name}
            </h2>
            <p className="font-sans text-caption text-ink-muted mt-0.5">
              Received {formatDate(inquiry.createdAt)}
            </p>

            {/* Status badge */}
            <div className="mt-2">
              <Badge variant={statusBadgeProps(inquiry.status).variant}>
                {statusBadgeProps(inquiry.status).label}
              </Badge>
            </div>
          </div>

          {/* Status segmented control */}
          <div className="flex flex-wrap gap-2 grid sm:grid-cols-4 grid-cols-2">
            {STATUS_BUTTONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleStatusClick(value)}
                className={
                  inquiry.status === value
                    ? "px-4 py-2 rounded-btn font-sans text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-navy/30 bg-navy text-white"
                    : "px-4 py-2 rounded-btn font-sans text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-navy/30 bg-white border border-line text-ink-muted hover:border-navy hover:text-navy"
                }
              >
                {label}
              </button>
            ))}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <DetailField label="Full Name">
              {inquiry.name}
            </DetailField>

            <DetailField label="Email Address">
              <a
                href={`mailto:${inquiry.email}`}
                className="text-crimson hover:text-crimson-600 transition-colors"
              >
                {inquiry.email}
              </a>
            </DetailField>

            <DetailField label="Phone">
              {inquiry.phone ? (
                <a
                  href={`tel:${inquiry.phone}`}
                  className="text-crimson hover:text-crimson-600 transition-colors"
                >
                  {inquiry.phone}
                </a>
              ) : (
                "—"
              )}
            </DetailField>

            <DetailField label="Company">
              {inquiry.company ?? "—"}
            </DetailField>

            <DetailField label="Country">
              {inquiry.country ?? "—"}
            </DetailField>

            <DetailField label="Product Interest">
              {inquiry.productInterest ?? "—"}
            </DetailField>

            <DetailField label="Quantity">
              {inquiry.quantity ?? "—"}
            </DetailField>

            <DetailField label="Fabric">
              {inquiry.fabric ?? "—"}
            </DetailField>

            <DetailField label="GSM">
              {inquiry.gsm ?? "—"}
            </DetailField>

            <DetailField label="Customization">
              {inquiry.customization ?? "—"}
            </DetailField>

            {/* Message — full width */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-0.5">
              <p className="font-sans text-caption font-medium text-ink-muted uppercase tracking-[0.06em]">
                Message
              </p>
              <div className="bg-cream-100 rounded-card p-4 mt-1">
                <p className="font-sans text-sm text-navy whitespace-pre-wrap">
                  {inquiry.message ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {inquiry.fileUrls.length > 0 && (
            <div>
              <h3 className="font-sans text-sm font-semibold text-navy">Reference Files</h3>
              <div className="flex flex-col gap-2 mt-2">
                {inquiry.fileUrls.map((url, i) => {
                  const filename = getFilename(url);
                  const isImg = isImageUrl(url);
                  const Icon = isImg ? PhotoIcon : DocumentIcon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-white border border-line rounded-btn"
                    >
                      <Icon className="h-5 w-5 text-ink-muted flex-shrink-0" aria-hidden="true" />
                      <span
                        className="font-sans text-sm text-navy flex-1 truncate"
                        title={filename}
                      >
                        {truncateFilename(filename, 32)}
                      </span>
                      <a
                        href={url}
                        download
                        aria-label={`Download ${filename}`}
                        className="font-sans text-caption text-crimson hover:text-crimson-600
                                   border border-crimson hover:border-crimson-600
                                   px-3 py-1 rounded-btn transition-colors duration-150 flex-shrink-0"
                      >
                        Download
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </AdminDrawer>

      {/* Confirm "Mark as Closed" dialog */}
      <AdminConfirmDialog
        open={confirmCloseOpen}
        title="Mark as Closed?"
        message="Mark this inquiry as closed? This indicates no further action is needed."
        confirmLabel="Mark as Closed"
        onConfirm={handleConfirmClose}
        onCancel={() => {
          setConfirmCloseOpen(false);
          setPendingStatus(null);
        }}
        destructive={false}
      />
    </>
  );
}

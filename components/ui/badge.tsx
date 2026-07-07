import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  variant: "crimson" | "navy" | "muted";
  children: React.ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeProps["variant"], string> = {
  crimson: "bg-crimson/10 text-crimson",
  navy: "bg-navy/10 text-navy",
  muted: "bg-cream-100 text-ink-muted",
};

/**
 * Badge primitive for status labels, tags, etc.
 * Variants: crimson (alert/new), navy (active/primary), muted (neutral/closed).
 */
export default function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-sans text-caption font-semibold px-2.5 py-0.5 rounded-badge",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── Canonical InquiryStatus → Badge mapping (used throughout admin) ─────────

type InquiryStatus = "NEW" | "REVIEWED" | "QUOTED" | "CLOSED";

interface StatusBadgeConfig {
  label: string;
  variant: BadgeProps["variant"];
}

const STATUS_CONFIG: Record<InquiryStatus, StatusBadgeConfig> = {
  NEW: { label: "New", variant: "crimson" },
  REVIEWED: { label: "In Review", variant: "navy" },
  QUOTED: { label: "Quoted", variant: "muted" },
  CLOSED: { label: "Closed", variant: "muted" },
};

export function statusBadgeProps(status: InquiryStatus): StatusBadgeConfig {
  return STATUS_CONFIG[status] ?? { label: status, variant: "muted" };
}

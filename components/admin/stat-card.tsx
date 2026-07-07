import React from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  href?: string;
}

/**
 * StatCard — server-rendered metric tile for the dashboard.
 * If `href` is provided, the card is rendered as a clickable link.
 * Spec Section 2.3.
 */
export default function StatCard({ label, value, description, href }: StatCardProps) {
  const cardContent = (
    <article className="bg-white rounded-card shadow-card p-6 flex flex-col gap-2">
      <p className="font-sans text-sm font-medium text-ink-muted">{label}</p>
      <p className="font-sans text-3xl font-bold text-navy mt-1">{value}</p>
      {description && (
        <p className="font-sans text-caption text-ink-muted">{description}</p>
      )}
    </article>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          "block rounded-card",
          "transition-shadow duration-200 hover:shadow-[0_4px_20px_rgba(10,34,64,0.14)]"
        )}
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-card shadow-card p-6 animate-pulse">
      <div className="bg-cream-100 rounded h-4 w-24 mb-3" />
      <div className="bg-cream-100 rounded h-8 w-16" />
    </div>
  );
}

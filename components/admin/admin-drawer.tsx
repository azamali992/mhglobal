"use client";

import React, { useEffect, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export interface AdminDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Default "md:max-w-xl"; pass "md:max-w-2xl" for InquiryDrawer. Must be a
   *  complete, literal Tailwind class (including the "md:" prefix) — Tailwind's
   *  JIT compiler cannot see classes built via string interpolation. */
  widthClassName?: string;
}

/**
 * AdminDrawer — right-slide panel (desktop) / bottom sheet (mobile).
 * Spec Section 8.2.
 * role="dialog", aria-modal, focus trap, Escape key closes.
 */
export default function AdminDrawer({
  open,
  onClose,
  title,
  children,
  footer,
  widthClassName = "md:max-w-xl",
}: AdminDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  // Remember what had focus when the drawer opened so we can restore it
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
    } else {
      // Restore focus to the triggering element when closed
      if (triggerRef.current && "focus" in triggerRef.current) {
        (triggerRef.current as HTMLElement).focus();
      }
    }
  }, [open]);

  // Move focus into the drawer on open
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusable[0]?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  // Escape key and focus trap
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = Array.from(
          panel.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-navy/40 z-[99] transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Panel — right-slide on desktop, bottom sheet on mobile */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={cn(
          "fixed z-modal bg-white flex flex-col shadow-card-dark",
          "motion-safe:transition-transform motion-safe:duration-200 ease-in-out",
          // Desktop: right-slide panel. md:inset-y-0 pins top:0/bottom:0 for
          // full viewport height — do not add md:top-auto/md:bottom-auto
          // here, they would win the cascade over inset-y-0 and collapse
          // the panel to its content height instead of the viewport.
          "md:inset-y-0 md:right-0 md:left-auto",
          "md:w-full",
          widthClassName,
          open ? "md:translate-x-0" : "md:translate-x-full",
          // Mobile: bottom sheet
          "inset-x-0 bottom-0 top-auto right-auto w-full max-w-none h-[90vh] rounded-t-card",
          "md:h-auto md:rounded-none",
          open ? "translate-y-0" : "translate-y-full md:translate-y-0"
        )}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-line flex items-center justify-between">
          <h2 id="drawer-title" className="font-sans text-base font-semibold text-navy">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            className="p-1.5 rounded text-ink-muted hover:text-navy hover:bg-cream-100
                       transition-colors duration-150
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-line">{footer}</div>
        )}
      </div>
    </>
  );
}

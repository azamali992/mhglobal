"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

export interface AdminConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Default true — confirm button uses crimson bg for destructive actions */
  destructive?: boolean;
}

/**
 * AdminConfirmDialog — modal confirmation dialog with focus trap.
 * Spec Section 8.3.
 * role="alertdialog", focus trapped, Escape → onCancel.
 */
export default function AdminConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  destructive = true,
}: AdminConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus the Cancel button on open (safer default than the destructive action)
  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => {
        cancelRef.current?.focus();
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [open]);

  // Escape key → cancel
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
      // Focus trap — cycle between Cancel and Confirm
      if (e.key === "Tab") {
        const focusable = [cancelRef.current, confirmRef.current].filter(Boolean) as HTMLElement[];
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
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-navy/50 z-modal flex items-center justify-center p-4"
      onClick={(e) => {
        // Close if clicking the backdrop (not the panel)
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="bg-white rounded-card shadow-card-dark p-8 max-w-sm w-full"
      >
        <h2
          id="confirm-dialog-title"
          className="font-sans text-base font-semibold text-navy mb-3"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-message"
          className="font-sans text-sm text-ink-muted mb-6"
        >
          {message}
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            ref={cancelRef}
            variant="ghost"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            ref={confirmRef}
            variant="primary"
            size="sm"
            onClick={onConfirm}
            className={cn(destructive !== false && "bg-crimson hover:bg-crimson-600")}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

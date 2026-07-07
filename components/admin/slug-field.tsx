"use client";

import React, { useEffect, useRef, useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Input from "@/components/ui/Input";

export interface SlugFieldProps {
  value: string;
  onChange: (slug: string) => void;
  /** The "name" field value — slug auto-generates from this when locked */
  autoSourceValue: string;
  /** For label association */
  fieldId: string;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric (except spaces and hyphens)
    .replace(/[\s_]+/g, "-")       // spaces/underscores → hyphens
    .replace(/-+/g, "-")           // collapse consecutive hyphens
    .replace(/^-+|-+$/g, "");      // trim leading/trailing hyphens
}

/**
 * SlugField — locked display with inline "Edit" button to unlock.
 * Auto-generates slug from `autoSourceValue` when in locked state.
 * Shows warning about broken links in unlocked state.
 * Spec Section 3.6.
 */
export default function SlugField({
  value,
  onChange,
  autoSourceValue,
  fieldId,
}: SlugFieldProps) {
  const [locked, setLocked] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from name when locked and name changes
  useEffect(() => {
    if (locked && autoSourceValue) {
      const generated = slugify(autoSourceValue);
      if (generated !== value) {
        onChange(generated);
      }
    }
    // Only run when autoSourceValue changes and field is locked
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSourceValue, locked]);

  function handleUnlock() {
    setLocked(false);
    // Move focus to input on next frame
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleBlur() {
    // Re-lock and clean up the slug value
    setLocked(true);
    onChange(slugify(value));
  }

  if (locked) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-sm font-medium text-navy">URL Slug</label>
        <div className="flex items-center gap-2 px-4 py-3 bg-cream-100 border border-line rounded-input">
          <span className="font-sans text-sm text-ink-muted flex-1 truncate">{value}</span>
          <button
            type="button"
            aria-label="Edit URL slug"
            onClick={handleUnlock}
            className="font-sans text-caption text-crimson hover:text-crimson-600 flex-shrink-0 transition-colors duration-150"
          >
            Edit
          </button>
        </div>
        <p className="font-sans text-caption text-ink-muted">
          Preview: yourdomain.com/products/{value}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Input
        ref={inputRef}
        label="URL Slug"
        id={fieldId}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
      />
      <p className="font-sans text-caption text-crimson flex items-center gap-1 mt-1">
        <ExclamationTriangleIcon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
        Changing the URL slug will break any existing links to this category.
      </p>
      <p className="font-sans text-caption text-ink-muted mt-0.5">
        Preview: yourdomain.com/products/{value}
      </p>
    </div>
  );
}

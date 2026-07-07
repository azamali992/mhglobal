"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/admin/toast-notification";
import { updatePageSeoAction } from "./actions";

interface SeoRow {
  path: string;
  label: string;
  title: string;
  description: string;
}

interface SeoClientProps {
  rows: SeoRow[];
}

const TITLE_MAX = 70;
const DESCRIPTION_MAX = 300;

function SeoRowCard({ row }: { row: SeoRow }) {
  const { showToast } = useToast();
  const [title, setTitle] = useState(row.title);
  const [description, setDescription] = useState(row.description);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    try {
      const result = await updatePageSeoAction(row.path, {
        title: title.trim() || null,
        description: description.trim() || null,
      });
      if (!result.success) throw new Error(result.error);
      setIsDirty(false);
      showToast("Saved.", "success");
    } catch {
      showToast("Could not save — please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-card shadow-card p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-sans text-sm font-semibold text-navy">{row.label}</h3>
          <p className="font-mono text-caption text-ink-muted">{row.path}</p>
        </div>
        {isDirty && (
          <Button variant="primary" size="sm" isLoading={isSaving} onClick={handleSave}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor={`seo-title-${row.path}`} className="font-sans text-sm font-medium text-navy">
              Title override
            </label>
            <span className="font-sans text-caption text-ink-muted">
              {title.length}/{TITLE_MAX}
            </span>
          </div>
          <input
            id={`seo-title-${row.path}`}
            type="text"
            value={title}
            maxLength={TITLE_MAX}
            onChange={(e) => {
              setTitle(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Leave blank to use the default title"
            className="w-full bg-white font-sans text-sm text-navy rounded-input border border-line
                       px-4 py-3 placeholder:text-ink-muted/50
                       focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-150"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor={`seo-desc-${row.path}`} className="font-sans text-sm font-medium text-navy">
              Description override
            </label>
            <span className="font-sans text-caption text-ink-muted">
              {description.length}/{DESCRIPTION_MAX}
            </span>
          </div>
          <textarea
            id={`seo-desc-${row.path}`}
            rows={3}
            value={description}
            maxLength={DESCRIPTION_MAX}
            onChange={(e) => {
              setDescription(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Leave blank to use the default description"
            className="w-full bg-white font-sans text-sm text-navy rounded-input border border-line
                       px-4 py-3 placeholder:text-ink-muted/50 resize-y
                       focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-150"
          />
        </div>
      </div>
    </div>
  );
}

export default function SeoClient({ rows }: SeoClientProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-sans text-lg font-semibold text-navy mb-1.5">Page SEO</h1>
        <p className="font-sans text-sm text-ink-muted max-w-2xl">
          Override the title and meta description search engines and social shares show for each page.
          Leave a field blank to keep using the site&apos;s default copy — the social-share preview image
          updates automatically to match whatever title is in effect.
        </p>
      </div>

      {rows.map((row) => (
        <SeoRowCard key={row.path} row={row} />
      ))}
    </div>
  );
}

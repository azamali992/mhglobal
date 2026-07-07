"use client";

import React, { useState } from "react";
import ContentBlockCard from "@/components/admin/content-block-card";
import { updateContentBlockAction } from "@/app/admin/content/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentBlock {
  id: string;
  page: string;
  key: string;
  value: string;
  imageUrl: string | null;
  order: number;
}

// ─── Pages list ──────────────────────────────────────────────────────────────

const PAGES: { label: string; value: string }[] = [
  { label: "Home", value: "home" },
  { label: "About", value: "about" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "OEM Services", value: "oem-services" },
  { label: "Quality", value: "quality" },
  { label: "Sustainability", value: "sustainability" },
  { label: "Why Choose Us", value: "why" },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface ContentClientProps {
  allBlocks: ContentBlock[];
  cloudinaryConfigured: boolean;
}

export default function ContentClient({ allBlocks, cloudinaryConfigured }: ContentClientProps) {
  const [activePage, setActivePage] = useState("home");

  const pageBlocks = allBlocks
    .filter((b) => b.page === activePage)
    .sort((a, b) => a.order - b.order);

  async function handleSave(id: string, updates: { value: string; imageUrl: string | null }) {
    const result = await updateContentBlockAction(id, updates);
    if (!result.success) {
      throw new Error(result.error);
    }
  }

  return (
    <div>
      <h1 className="font-sans text-lg font-semibold text-navy mb-6">Page Content</h1>

      {/* Mobile page selector */}
      <div className="md:hidden mb-4">
        <label htmlFor="content-page-select" className="font-sans text-sm font-medium text-navy mb-1.5 block">
          Select a page to edit
        </label>
        <div className="relative">
          <select
            id="content-page-select"
            aria-label="Select page to edit"
            value={activePage}
            onChange={(e) => setActivePage(e.target.value)}
            className="w-full bg-white font-sans text-sm text-navy rounded-input border border-line px-4 py-3
                       transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy
                       appearance-none cursor-pointer"
          >
            {PAGES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ink-muted">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column — page nav (desktop only) */}
        <div className="hidden md:block w-56 flex-shrink-0">
          <nav aria-label="Select page to edit">
            <ul className="flex flex-col gap-1">
              {PAGES.map((p) => (
                <li key={p.value}>
                  <button
                    type="button"
                    onClick={() => setActivePage(p.value)}
                    className={
                      activePage === p.value
                        ? "w-full text-left px-3 py-2 font-sans text-sm font-semibold text-navy border-l-2 border-crimson pl-3 rounded-r-btn"
                        : "w-full text-left px-3 py-2 font-sans text-sm text-ink-muted hover:text-navy rounded-btn transition-colors duration-150"
                    }
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right column — content blocks */}
        <div className="flex-1 min-w-0">
          {pageBlocks.length === 0 ? (
            <div className="bg-white rounded-card shadow-card p-12 text-center">
              <p className="font-sans text-sm text-ink-muted">No editable content found for this page.</p>
            </div>
          ) : (
            pageBlocks.map((block) => (
              <ContentBlockCard key={block.id} block={block} onSave={handleSave} cloudinaryConfigured={cloudinaryConfigured} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

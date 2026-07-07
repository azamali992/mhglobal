"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUploadZone from "@/components/admin/image-upload-zone";
import { derivedLabel } from "@/lib/content-key-labels";
import { useToast } from "@/components/admin/toast-notification";

export interface ContentBlockCardProps {
  block: {
    id: string;
    page: string;
    key: string;
    value: string;
    imageUrl: string | null;
    order: number;
  };
  onSave: (id: string, updates: { value: string; imageUrl: string | null }) => Promise<void>;
  cloudinaryConfigured: boolean;
}

/**
 * ContentBlockCard — editable card for a single ContentBlock row.
 * Manages its own dirty/saving state.
 * Save is not optimistic — spinner runs, state updates on confirmed success.
 * Spec Section 6.4.
 */
export default function ContentBlockCard({ block, onSave, cloudinaryConfigured }: ContentBlockCardProps) {
  const { showToast } = useToast();
  const [localValue, setLocalValue] = useState(block.value);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(block.imageUrl);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  function handleValueChange(next: string) {
    setLocalValue(next);
    setIsDirty(true);
  }

  function handleImageUrlChange(next: string | string[]) {
    const url = typeof next === "string" ? next : next[0] ?? null;
    setLocalImageUrl(url || null);
    setIsDirty(true);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      await onSave(block.id, {
        value: localValue,
        imageUrl: localImageUrl,
      });
      setIsDirty(false);
      showToast("Saved.", "success");
    } catch {
      showToast("Could not save — please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  // Determine field type per spec Section 6.6
  const hasImage = block.imageUrl !== null;
  const isLongText = !hasImage && block.value.length > 120;

  const TEXTAREA_CLASS =
    "w-full bg-white font-sans text-sm text-navy rounded-input border border-line " +
    "px-4 py-3 placeholder:text-ink-muted/50 resize-y " +
    "focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-150";

  return (
    <div className="bg-white rounded-card shadow-card p-6 mb-4">
      {/* Card header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans text-sm font-semibold text-navy">
          {derivedLabel(block.key)}
        </h3>
        {isDirty && (
          <Button
            variant="primary"
            size="sm"
            isLoading={isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        )}
      </div>

      {/* Edit field */}
      {hasImage ? (
        <div className="flex flex-col gap-4">
          <ImageUploadZone
            value={localImageUrl}
            onChange={handleImageUrlChange}
            label="Image"
            cloudinaryConfigured={cloudinaryConfigured}
            multiple={false}
            folder="mh-global-attire/content"
          />
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={`content-value-${block.id}`}
              className="font-sans text-sm font-medium text-navy"
            >
              Alt text / Caption
            </label>
            <input
              id={`content-value-${block.id}`}
              type="text"
              value={localValue}
              onChange={(e) => handleValueChange(e.target.value)}
              className="w-full bg-white font-sans text-sm text-navy rounded-input border border-line
                         px-4 py-3 placeholder:text-ink-muted/50
                         focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-150"
              placeholder="Alt text or caption..."
            />
          </div>
        </div>
      ) : isLongText ? (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={`content-value-${block.id}`}
            className="font-sans text-sm font-medium text-navy"
          >
            Content
          </label>
          <textarea
            id={`content-value-${block.id}`}
            rows={5}
            value={localValue}
            onChange={(e) => handleValueChange(e.target.value)}
            className={TEXTAREA_CLASS}
          />
        </div>
      ) : (
        <Input
          label="Content"
          id={`content-value-${block.id}`}
          type="text"
          value={localValue}
          onChange={(e) => handleValueChange(e.target.value)}
        />
      )}
    </div>
  );
}

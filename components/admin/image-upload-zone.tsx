"use client";

import React, { useRef, useState } from "react";
import { CloudArrowUpIcon, XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import Input from "@/components/ui/Input";
import { uploadImageAction } from "@/app/admin/upload-actions";
import { useToast } from "@/components/admin/toast-notification";

/**
 * DEVIATION FROM SPEC (documented):
 * The spec declares `value: string | null` and suggests multi-image mode
 * serialises its URL array as JSON.stringify(updatedUrls) through
 * `onChange(url: string)`. We instead use an overloaded signature:
 *   - single mode:   value: string | null,  onChange: (url: string) => void
 *   - multiple mode: value: string[],        onChange: (urls: string[]) => void
 * This avoids awkward JSON round-trips in the Product form and keeps the
 * parent's form state as a first-class string[] without re-parsing.
 * The `value` prop accepts `string | string[] | null` so TypeScript is happy
 * when the parent passes either shape.
 */
export interface ImageUploadZoneProps {
  /** Single mode: string | null. Multiple mode: string[] */
  value: string | string[] | null;
  /** Single mode calls with string; multiple mode calls with string[] */
  onChange: (urlOrUrls: string | string[]) => void;
  label: string;
  /** Computed server-side via isCloudinaryConfigured() and passed down as a prop */
  cloudinaryConfigured: boolean;
  /** default false; true for Product images (multi-image mode) */
  multiple?: boolean;
  /**
   * Cloudinary folder — must be one of the ALLOWED_FOLDERS values in
   * app/admin/upload-actions.ts. Required when cloudinaryConfigured is true.
   */
  folder?: "mh-global-attire/categories" | "mh-global-attire/products" | "mh-global-attire/content" | "mh-global-attire/certifications";
}

const MAX_IMAGES = 10;
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * ImageUploadZone — real Cloudinary upload (drag/drop + click-to-browse) once
 * cloudinaryConfigured is true; falls back to a manual URL-entry dropzone
 * otherwise. Spec Section 3.7.
 */
export default function ImageUploadZone({
  value,
  onChange,
  label,
  cloudinaryConfigured,
  multiple = false,
  folder,
}: ImageUploadZoneProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Derive initial URL list for multiple mode
  const initialUrls: string[] = multiple
    ? Array.isArray(value)
      ? (value as string[]).filter(Boolean)
      : typeof value === "string" && value
        ? [value]
        : []
    : [];

  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [pendingUrl, setPendingUrl] = useState("");
  const [extraInputs, setExtraInputs] = useState<number[]>([]);
  const [extraValues, setExtraValues] = useState<Record<number, string>>({});

  function updateUrls(next: string[]) {
    setUrls(next);
    (onChange as (urls: string[]) => void)(next);
  }

  const labelId = label.replace(/\s+/g, "-").toLowerCase();

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0 || !folder) return;
    const files = Array.from(fileList);
    const room = multiple ? MAX_IMAGES - urls.length : 1;
    const toUpload = files.slice(0, Math.max(room, 0));

    if (toUpload.length === 0) {
      showToast(`You can only add up to ${MAX_IMAGES} images.`, "error");
      return;
    }

    // Accumulate locally rather than reading the `urls` state inside the loop —
    // state updates are async, so repeated `updateUrls([...urls, x])` calls
    // within the same batch would each read the same stale `urls` value and
    // only the last upload in the batch would actually persist.
    let accumulated = [...urls];

    setUploading(true);
    for (const file of toUpload) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        showToast(`${file.name}: only JPEG, PNG, or WEBP images are allowed.`, "error");
        continue;
      }
      if (file.size > MAX_BYTES) {
        showToast(`${file.name}: image must be smaller than 5MB.`, "error");
        continue;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        const result = await uploadImageAction(formData);
        if (result.success) {
          if (multiple) {
            accumulated = [...accumulated, result.url];
            updateUrls(accumulated);
          } else {
            (onChange as (url: string) => void)(result.url);
          }
        } else {
          showToast(result.error, "error");
        }
      } catch {
        showToast("Upload failed — please try again.", "error");
      }
    }
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    void handleFiles(e.dataTransfer.files);
  }

  // ─── Not configured (Phase 2A) ────────────────────────────────────────────

  if (!cloudinaryConfigured) {
    if (multiple) {
      return (
        <div className="flex flex-col gap-3">
          <label className="font-sans text-sm font-medium text-navy">{label}</label>

          {/* Non-interactive dropzone */}
          <div className="border-2 border-dashed border-line rounded-card p-8 text-center cursor-default bg-white">
            <div className="flex flex-col items-center gap-3">
              <CloudArrowUpIcon className="h-8 w-8 text-ink-muted/40" aria-hidden="true" />
              <p className="font-sans text-sm text-ink-muted/60">
                Drag an image here or click to browse
              </p>
            </div>
          </div>

          {/* Cloudinary-not-configured notice */}
          <div className="bg-cream-100 border border-line rounded-btn px-4 py-3">
            <p className="font-sans text-caption text-ink-muted">
              Image uploads are not active yet. Enter an image URL below to use an external image for now.
            </p>
          </div>

          {/* Existing image thumbnails */}
          {urls.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mt-2">
              {urls.map((url, i) => (
                <div key={i} className="relative flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt="Product image"
                    className="h-16 w-16 object-cover rounded border border-line"
                  />
                  <button
                    type="button"
                    aria-label="Remove this image"
                    onClick={() => updateUrls(urls.filter((_, j) => j !== i))}
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-crimson text-white
                               flex items-center justify-center hover:bg-crimson-600 transition-colors"
                  >
                    <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Primary pending URL input (confirmed on blur) */}
          <Input
            label="Image URL"
            id={`${labelId}-url-primary`}
            type="url"
            placeholder="https://example.com/image.jpg"
            value={pendingUrl}
            onChange={(e) => setPendingUrl(e.target.value)}
            onBlur={() => {
              const trimmed = pendingUrl.trim();
              if (trimmed && urls.length < MAX_IMAGES) {
                updateUrls([...urls, trimmed]);
                setPendingUrl("");
              }
            }}
          />

          {/* Extra URL inputs */}
          {extraInputs.map((inputId) => (
            <div key={inputId} className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  label={`Image URL ${urls.length + extraInputs.indexOf(inputId) + 2}`}
                  id={`extra-url-${inputId}`}
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={extraValues[inputId] ?? ""}
                  onChange={(e) =>
                    setExtraValues((prev) => ({ ...prev, [inputId]: e.target.value }))
                  }
                  onBlur={() => {
                    const v = (extraValues[inputId] ?? "").trim();
                    if (v && urls.length < MAX_IMAGES) {
                      updateUrls([...urls, v]);
                      setExtraInputs((prev) => prev.filter((id) => id !== inputId));
                      setExtraValues((prev) => {
                        const next = { ...prev };
                        delete next[inputId];
                        return next;
                      });
                    }
                  }}
                />
              </div>
              <button
                type="button"
                aria-label="Remove this URL input"
                onClick={() => {
                  setExtraInputs((prev) => prev.filter((id) => id !== inputId));
                  setExtraValues((prev) => {
                    const next = { ...prev };
                    delete next[inputId];
                    return next;
                  });
                }}
                className="mb-1.5 p-1.5 rounded text-ink-muted hover:text-crimson hover:bg-crimson/10 transition-colors"
              >
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}

          {/* Add another URL button */}
          {urls.length + extraInputs.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => setExtraInputs((prev) => [...prev, Date.now()])}
              className="font-sans text-sm text-crimson hover:text-crimson-600
                         flex items-center gap-1 transition-colors duration-150 mt-2"
            >
              <PlusIcon className="h-4 w-4" aria-hidden="true" />
              Add Another Image URL
            </button>
          )}
        </div>
      );
    }

    // ── Single image mode ──────────────────────────────────────────────────────
    const singleValue = typeof value === "string" ? value : null;

    return (
      <div className="flex flex-col gap-3">
        <label className="font-sans text-sm font-medium text-navy">{label}</label>

        {/* Non-interactive dropzone */}
        <div className="border-2 border-dashed border-line rounded-card p-8 text-center cursor-default bg-white">
          <div className="flex flex-col items-center gap-3">
            <CloudArrowUpIcon className="h-8 w-8 text-ink-muted/40" aria-hidden="true" />
            <p className="font-sans text-sm text-ink-muted/60">
              Drag an image here or click to browse
            </p>
          </div>
        </div>

        {/* Cloudinary-not-configured notice */}
        <div className="bg-cream-100 border border-line rounded-btn px-4 py-3">
          <p className="font-sans text-caption text-ink-muted">
            Image uploads are not active yet. Enter an image URL below to use an external image for now.
          </p>
        </div>

        {/* URL fallback input */}
        <Input
          label="Image URL"
          id={`${labelId}-url`}
          type="url"
          placeholder="https://example.com/image.jpg"
          value={singleValue ?? ""}
          onChange={(e) => (onChange as (url: string) => void)(e.target.value)}
        />

        {/* Single image preview */}
        {singleValue && (
          <div className="mt-3 relative inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={singleValue}
              alt="Current image"
              className="h-24 w-24 object-cover rounded border border-line"
            />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => (onChange as (url: string) => void)("")}
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-crimson text-white
                         flex items-center justify-center hover:bg-crimson-600 transition-colors duration-150"
            >
              <XMarkIcon className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── Configured state — real Cloudinary upload ──────────────────────────────
  const singleValue = !multiple && typeof value === "string" ? value : null;
  const atCapacity = multiple && urls.length >= MAX_IMAGES;

  return (
    <div className="flex flex-col gap-3">
      <label className="font-sans text-sm font-medium text-navy">{label}</label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        className="sr-only"
        aria-label={label}
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {!atCapacity && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-card p-8 text-center cursor-pointer transition-colors ${
            dragActive ? "border-crimson bg-cream-100" : "border-line bg-white hover:bg-cream-100"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <CloudArrowUpIcon className="h-8 w-8 text-ink-muted/40" aria-hidden="true" />
            <p className="font-sans text-sm text-ink-muted">
              {uploading ? "Uploading…" : "Click to upload or drag and drop"}
            </p>
            <p className="font-sans text-caption text-ink-muted/60">JPEG, PNG, or WEBP — up to 5MB</p>
          </div>
        </div>
      )}

      {multiple && urls.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {urls.map((url, i) => (
            <div key={i} className="relative flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Product image"
                className="h-16 w-16 object-cover rounded border border-line"
              />
              <button
                type="button"
                aria-label="Remove this image"
                onClick={() => updateUrls(urls.filter((_, j) => j !== i))}
                className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-crimson text-white
                           flex items-center justify-center hover:bg-crimson-600 transition-colors"
              >
                <XMarkIcon className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      {!multiple && singleValue && (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={singleValue}
            alt="Current image"
            className="h-24 w-24 object-cover rounded border border-line"
          />
          <button
            type="button"
            aria-label="Remove image"
            onClick={() => (onChange as (url: string) => void)("")}
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-crimson text-white
                       flex items-center justify-center hover:bg-crimson-600 transition-colors duration-150"
          >
            <XMarkIcon className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import Script from "next/script";
import { CheckCircle2, Paperclip, X } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { SELECT_CLASS } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

interface InquiryFormProps {
  categories: { name: string; slug: string }[];
  /** Pre-selected product interest (e.g. arriving from a category page) */
  defaultProduct?: string;
}

const FIELDS = [
  "name",
  "email",
  "company",
  "country",
  "phone",
  "productInterest",
  "quantity",
  "fabric",
  "gsm",
  "customization",
  "message",
] as const;

type FieldName = (typeof FIELDS)[number];
type FormState = Record<FieldName, string>;
type FieldErrors = Partial<Record<FieldName | "formErrors", string>>;

const EMPTY: FormState = {
  name: "",
  email: "",
  company: "",
  country: "",
  phone: "",
  productInterest: "",
  quantity: "",
  fabric: "",
  gsm: "",
  customization: "",
  message: "",
};

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function InquiryForm({ categories, defaultProduct = "" }: InquiryFormProps) {
  const [values, setValues] = useState<FormState>({ ...EMPTY, productInterest: defaultProduct });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (name: FieldName, v: string) => setValues((p) => ({ ...p, [name]: v }));

  function handleFilesSelected(selected: FileList | null) {
    if (!selected) return;
    setFileError(null);
    const incoming = Array.from(selected);
    const combined = [...files, ...incoming];

    if (combined.length > MAX_FILES) {
      setFileError(`You can attach up to ${MAX_FILES} files.`);
      return;
    }
    for (const f of incoming) {
      if (!ALLOWED_FILE_TYPES.includes(f.type)) {
        setFileError("Only JPEG, PNG, WEBP, or PDF files are allowed.");
        return;
      }
      if (f.size > MAX_FILE_BYTES) {
        setFileError("Each file must be smaller than 10MB.");
        return;
      }
    }
    setFiles(combined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  }

  const canSubmit =
    status !== "submitting" && values.name.trim() !== "" && EMAIL_RE.test(values.email.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setErrors({});

    const fd = new FormData();
    for (const f of FIELDS) {
      const v = values[f].trim();
      if (v) fd.append(f, v);
    }
    fd.append("website", honeypot);
    const turnstileToken =
      turnstileContainerRef.current?.querySelector<HTMLInputElement>(
        'input[name="cf-turnstile-response"]'
      )?.value ?? "";
    fd.append("turnstileToken", turnstileToken);
    for (const file of files) fd.append("files", file);

    try {
      const res = await fetch("/api/inquiry", { method: "POST", body: fd });

      if (res.ok) {
        setStatus("success");
        setValues({ ...EMPTY });
        setFiles([]);
        return;
      }

      const data = await res.json().catch(() => null);
      const next: FieldErrors = {};
      const fe = data?.errors?.fieldErrors ?? {};
      for (const k of Object.keys(fe)) next[k as FieldName] = fe[k]?.[0];
      const form = data?.errors?.formErrors?.[0];
      if (form) next.formErrors = form;
      if (Object.keys(next).length === 0) next.formErrors = "Something went wrong. Please try again.";
      setErrors(next);
      setStatus("idle");
    } catch {
      setErrors({ formErrors: "Network error. Please try again or contact us directly." });
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-4 rounded-card border border-line bg-cream-100 p-10 text-center"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-crimson/10 text-crimson">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="font-display text-h3 text-navy">Inquiry Received</h2>
        <p className="font-sans text-body text-ink-muted max-w-md">
          Thank you — your inquiry has reached our team. We will review your requirements and respond with the next
          steps, including a suitable MOQ and quotation.
        </p>
        <Button variant="secondary" size="md" onClick={() => setStatus("idle")}>
          Submit Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-card border border-line bg-cream-100 p-6 md:p-8">
      {TURNSTILE_SITE_KEY && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
      )}

      {errors.formErrors && (
        <p role="alert" className="mb-6 rounded-input border border-crimson bg-crimson/5 px-4 py-3 font-sans text-sm text-crimson">
          {errors.formErrors}
        </p>
      )}

      {/* Honeypot — hidden from real users, left for bots to fill in */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="company_website">Company Website</label>
        <input
          id="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input id="name" label="Full Name" required value={values.name} error={errors.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
        <Input id="email" label="Email" type="email" required value={values.email} error={errors.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
        <Input id="company" label="Company" value={values.company} error={errors.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />
        <Input id="country" label="Country" value={values.country} error={errors.country} onChange={(e) => set("country", e.target.value)} autoComplete="country-name" />
        <Input id="phone" label="Phone / WhatsApp" value={values.phone} error={errors.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />

        <Select
          id="productInterest"
          label="Product Interest"
          value={values.productInterest}
          error={errors.productInterest}
          onChange={(e) => set("productInterest", e.target.value)}
        >
          <option value="">Select a category…</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.name}>
              {c.name}
            </option>
          ))}
          <option value="Other">Other / Multiple</option>
        </Select>

        <Input id="quantity" label="Estimated Quantity" placeholder="e.g. 10,000 pcs" value={values.quantity} error={errors.quantity} onChange={(e) => set("quantity", e.target.value)} />
        <Input id="fabric" label="Fabric" placeholder="e.g. 100% cotton, French terry" value={values.fabric} error={errors.fabric} onChange={(e) => set("fabric", e.target.value)} />
        <Input id="gsm" label="GSM" placeholder="e.g. 240 GSM" value={values.gsm} error={errors.gsm} onChange={(e) => set("gsm", e.target.value)} />
        <Input id="customization" label="Customization" placeholder="Printing, embroidery, labels…" value={values.customization} error={errors.customization} onChange={(e) => set("customization", e.target.value)} />
      </div>

      {/* Message textarea */}
      <div className="mt-5 flex flex-col gap-1.5">
        <label htmlFor="message" className="font-sans text-sm font-medium text-navy">
          Message / Requirements
        </label>
        <textarea
          id="message"
          rows={5}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Colours, sizes, labels, packaging, delivery timeline…"
          className={cn(SELECT_CLASS.replace("cursor-pointer", "").replace("appearance-none", ""), "resize-y")}
        />
        {errors.message && (
          <p role="alert" className="font-sans text-caption text-crimson">
            {errors.message}
          </p>
        )}
      </div>

      {/* File attachments */}
      <div className="mt-5 flex flex-col gap-1.5">
        <label htmlFor="inquiry-files" className="font-sans text-sm font-medium text-navy">
          Reference Images / Tech Pack (optional)
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 self-start rounded-input border border-dashed border-line bg-white px-4 py-3
                     font-sans text-sm text-ink-muted hover:border-navy hover:text-navy transition-colors duration-150"
        >
          <Paperclip className="h-4 w-4" aria-hidden="true" />
          Attach files (JPG, PNG, WEBP, or PDF — up to {MAX_FILES}, 10MB each)
        </button>
        <input
          ref={fileInputRef}
          id="inquiry-files"
          type="file"
          multiple
          accept={ALLOWED_FILE_TYPES.join(",")}
          onChange={(e) => handleFilesSelected(e.target.files)}
          className="hidden"
        />
        {fileError && (
          <p role="alert" className="font-sans text-caption text-crimson">
            {fileError}
          </p>
        )}
        {files.length > 0 && (
          <ul className="mt-1 flex flex-col gap-1.5">
            {files.map((f, i) => (
              <li
                key={`${f.name}-${i}`}
                className="flex items-center justify-between rounded-input border border-line bg-white px-3 py-2 font-sans text-sm text-navy"
              >
                <span className="truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label={`Remove ${f.name}`}
                  className="text-ink-muted hover:text-crimson transition-colors duration-150"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Turnstile widget — only rendered once a site key is configured */}
      {TURNSTILE_SITE_KEY && (
        <div className="mt-5" ref={turnstileContainerRef}>
          <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} />
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <Button type="submit" variant="primary" size="md" isLoading={status === "submitting"} disabled={!canSubmit}>
          {status === "submitting" ? "Sending…" : "Submit Inquiry"}
        </Button>
        <p className="font-sans text-caption text-ink-muted">
          Fields marked <span className="text-crimson">*</span> are required. We reply by email.
        </p>
      </div>
    </form>
  );
}

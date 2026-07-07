import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design System — MH Global Attire",
  robots: { index: false, follow: false },
};

/* ─────────────────────────────────────────────────────────────
   /styleguide — Design System Preview Page
   Implements design-system-spec-0A Deliverable 4 verbatim.
   Server Component — no client-side interactivity required.
───────────────────────────────────────────────────────────── */
export default function StyleguidePage() {
  return (
    <div className="bg-white min-h-screen">

      {/* ── PAGE HEADER ─────────────────────────────────────────── */}
      <section className="w-full bg-cream py-section-y">
        <div className="w-full max-w-[1280px] mx-auto px-container-x md:px-8 lg:px-12">
          <p className="font-sans text-caption text-ink-muted uppercase tracking-[0.1em] mb-3">
            Phase 0A · Design System Approval Preview · Version 1.0 · 2026-07-03
          </p>
          <h1 className="font-display text-h1 text-navy">
            MH Global Attire Design System
          </h1>
          <p className="font-sans text-body-lg text-ink-muted mt-4 max-w-xl">
            Complete token reference, typography scale, component primitives, and usage
            patterns for approval before Phase 0B build begins.
          </p>
        </div>
      </section>

      {/* ── SECTION 1 — COLOR PALETTE ───────────────────────────── */}
      <section className="w-full bg-white py-section-y">
        <div className="w-full max-w-[1280px] mx-auto px-container-x md:px-8 lg:px-12">
          <h2 className="font-display text-h3 text-navy mb-10">01 · Color Palette</h2>

          <div className="grid grid-cols-3 lg:grid-cols-9 gap-4">

            {/* 1. --navy */}
            <div>
              <div className="w-full h-[120px] rounded-card bg-navy" />
              <div className="mt-3 space-y-0.5">
                <p className="font-sans text-xs font-semibold text-navy">--navy</p>
                <p className="font-sans text-caption text-ink-muted">#0A2240</p>
                <p className="font-mono text-caption text-ink-muted/70">bg-navy</p>
              </div>
            </div>

            {/* 2. --navy-800 */}
            <div>
              <div className="w-full h-[120px] rounded-card bg-navy-800" />
              <div className="mt-3 space-y-0.5">
                <p className="font-sans text-xs font-semibold text-navy">--navy-800</p>
                <p className="font-sans text-caption text-ink-muted">#0D2A4E</p>
                <p className="font-mono text-caption text-ink-muted/70">bg-navy-800</p>
              </div>
            </div>

            {/* 3. --crimson */}
            <div>
              <div className="w-full h-[120px] rounded-card bg-crimson" />
              <div className="mt-3 space-y-0.5">
                <p className="font-sans text-xs font-semibold text-navy">--crimson</p>
                <p className="font-sans text-caption text-ink-muted">#941C1D</p>
                <p className="font-mono text-caption text-ink-muted/70">bg-crimson</p>
              </div>
            </div>

            {/* 4. --crimson-600 */}
            <div>
              <div className="w-full h-[120px] rounded-card bg-crimson-600" />
              <div className="mt-3 space-y-0.5">
                <p className="font-sans text-xs font-semibold text-navy">--crimson-600</p>
                <p className="font-sans text-caption text-ink-muted">#B02A28</p>
                <p className="font-mono text-caption text-ink-muted/70">bg-crimson-600</p>
              </div>
            </div>

            {/* 5. --cream */}
            <div>
              <div className="w-full h-[120px] rounded-card bg-cream border border-line" />
              <div className="mt-3 space-y-0.5">
                <p className="font-sans text-xs font-semibold text-navy">--cream</p>
                <p className="font-sans text-caption text-ink-muted">#EDE6D6</p>
                <p className="font-mono text-caption text-ink-muted/70">bg-cream</p>
              </div>
            </div>

            {/* 6. --cream-100 */}
            <div>
              <div className="w-full h-[120px] rounded-card bg-cream-100 border border-line" />
              <div className="mt-3 space-y-0.5">
                <p className="font-sans text-xs font-semibold text-navy">--cream-100</p>
                <p className="font-sans text-caption text-ink-muted">#F5F1E8</p>
                <p className="font-mono text-caption text-ink-muted/70">bg-cream-100</p>
              </div>
            </div>

            {/* 7. --white */}
            <div>
              <div className="w-full h-[120px] rounded-card bg-white border border-line" />
              <div className="mt-3 space-y-0.5">
                <p className="font-sans text-xs font-semibold text-navy">--white</p>
                <p className="font-sans text-caption text-ink-muted">#FFFFFF</p>
                <p className="font-mono text-caption text-ink-muted/70">bg-white</p>
              </div>
            </div>

            {/* 8. --ink-muted */}
            <div>
              <div className="w-full h-[120px] rounded-card bg-ink-muted" />
              <div className="mt-3 space-y-0.5">
                <p className="font-sans text-xs font-semibold text-navy">--ink-muted</p>
                <p className="font-sans text-caption text-ink-muted">#4A5568</p>
                <p className="font-mono text-caption text-ink-muted/70">bg-ink-muted</p>
              </div>
            </div>

            {/* 9. --line */}
            <div>
              <div className="w-full h-[120px] rounded-card bg-line border border-line/50" />
              <div className="mt-3 space-y-0.5">
                <p className="font-sans text-xs font-semibold text-navy">--line</p>
                <p className="font-sans text-caption text-ink-muted">#D8CFBC</p>
                <p className="font-mono text-caption text-ink-muted/70">bg-line</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SECTION 2 — TYPOGRAPHY SCALE ────────────────────────── */}
      <section className="w-full bg-cream py-section-y">
        <div className="w-full max-w-[1280px] mx-auto px-container-x md:px-8 lg:px-12">
          <h2 className="font-display text-h3 text-navy mb-10">02 · Typography Scale</h2>

          {/* display */}
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-4 py-6 border-b border-line">
            <div className="w-[180px] shrink-0">
              <p className="font-mono text-caption text-navy font-semibold">display</p>
              <p className="font-mono text-caption text-ink-muted/70">3.815rem / 61px</p>
              <p className="font-mono text-caption text-ink-muted/60">Cormorant Garamond</p>
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="font-display text-display text-navy whitespace-nowrap overflow-hidden text-ellipsis">
                MH Global Attire
              </p>
            </div>
          </div>

          {/* h1 */}
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-4 py-6 border-b border-line">
            <div className="w-[180px] shrink-0">
              <p className="font-mono text-caption text-navy font-semibold">h1</p>
              <p className="font-mono text-caption text-ink-muted/70">3.052rem / 49px</p>
              <p className="font-mono text-caption text-ink-muted/60">Cormorant Garamond</p>
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <h1 className="font-display text-h1 text-navy m-0">MH Global Attire</h1>
            </div>
          </div>

          {/* h2 */}
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-4 py-6 border-b border-line">
            <div className="w-[180px] shrink-0">
              <p className="font-mono text-caption text-navy font-semibold">h2</p>
              <p className="font-mono text-caption text-ink-muted/70">2.441rem / 39px</p>
              <p className="font-mono text-caption text-ink-muted/60">Cormorant Garamond</p>
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <h2 className="font-display text-h2 text-navy m-0">MH Global Attire</h2>
            </div>
          </div>

          {/* h3 */}
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-4 py-6 border-b border-line">
            <div className="w-[180px] shrink-0">
              <p className="font-mono text-caption text-navy font-semibold">h3</p>
              <p className="font-mono text-caption text-ink-muted/70">1.953rem / 31px</p>
              <p className="font-mono text-caption text-ink-muted/60">Cormorant Garamond</p>
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <h3 className="font-display text-h3 text-navy m-0">MH Global Attire</h3>
            </div>
          </div>

          {/* h4 */}
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-4 py-6 border-b border-line">
            <div className="w-[180px] shrink-0">
              <p className="font-mono text-caption text-navy font-semibold">h4</p>
              <p className="font-mono text-caption text-ink-muted/70">1.563rem / 25px</p>
              <p className="font-mono text-caption text-ink-muted/60">Cormorant Garamond</p>
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <h4 className="font-display text-h4 text-navy m-0">MH Global Attire</h4>
            </div>
          </div>

          {/* body-lg */}
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-4 py-6 border-b border-line">
            <div className="w-[180px] shrink-0">
              <p className="font-mono text-caption text-navy font-semibold">body-lg</p>
              <p className="font-mono text-caption text-ink-muted/70">1.250rem / 20px</p>
              <p className="font-mono text-caption text-ink-muted/60">Inter</p>
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="font-sans text-body-lg text-ink-muted">Premium B2B Apparel Manufacturing</p>
            </div>
          </div>

          {/* body */}
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-4 py-6 border-b border-line">
            <div className="w-[180px] shrink-0">
              <p className="font-mono text-caption text-navy font-semibold">body</p>
              <p className="font-mono text-caption text-ink-muted/70">1.000rem / 16px</p>
              <p className="font-mono text-caption text-ink-muted/60">Inter</p>
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="font-sans text-body text-ink-muted">Premium B2B Apparel Manufacturing</p>
            </div>
          </div>

          {/* caption */}
          <div className="flex flex-col lg:flex-row lg:items-baseline gap-4 py-6 border-b border-line">
            <div className="w-[180px] shrink-0">
              <p className="font-mono text-caption text-navy font-semibold">caption</p>
              <p className="font-mono text-caption text-ink-muted/70">0.800rem / 13px</p>
              <p className="font-mono text-caption text-ink-muted/60">Inter</p>
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="font-sans text-caption text-ink-muted">Premium B2B Apparel Manufacturing</p>
            </div>
          </div>

          {/* Enforcement note */}
          <p className="font-sans text-caption text-ink-muted/60 mt-8 border-l-2 border-crimson pl-4">
            Cormorant Garamond is assigned exclusively to the display and h1–h4 steps. It must
            never appear on body, body-lg, or caption text, nor on any nav link, button label,
            badge, form element, or footer text.
          </p>
        </div>
      </section>

      {/* ── SECTION 3 — BUTTONS ─────────────────────────────────── */}
      {/* Sub-section A — cream background */}
      <section className="w-full bg-cream py-section-y">
        <div className="w-full max-w-[1280px] mx-auto px-container-x md:px-8 lg:px-12">
          <h2 className="font-display text-h3 text-navy mb-10">03 · Buttons</h2>

          {/* All variants at md size on cream */}
          <p className="font-sans text-caption text-ink-muted uppercase tracking-[0.08em] mb-4">
            On cream background — all three variants at md size
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-10">
            {/* primary md */}
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide rounded-btn transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-crimson disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none bg-crimson text-white hover:bg-crimson-600 active:bg-crimson-600 text-body px-6 py-3"
            >
              Primary Action
            </button>
            {/* secondary md — cream/white-bg config */}
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide rounded-btn transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none bg-transparent border-2 border-navy text-navy hover:bg-navy hover:text-white active:bg-navy active:text-white text-body px-6 py-3"
            >
              Secondary Action
            </button>
            {/* ghost md */}
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide rounded-btn transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-crimson disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none bg-transparent text-crimson hover:bg-cream-100 active:bg-line text-body px-6 py-3"
            >
              Ghost Action
            </button>
          </div>

          {/* Size scale — primary only */}
          <p className="font-sans text-caption text-ink-muted uppercase tracking-[0.08em] mb-4">
            Size scale — primary variant
          </p>
          <div className="flex flex-wrap items-end gap-4">
            {/* primary sm */}
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide rounded-btn transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-crimson disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none bg-crimson text-white hover:bg-crimson-600 active:bg-crimson-600 text-sm px-4 py-2"
            >
              Small
            </button>
            {/* primary md */}
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide rounded-btn transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-crimson disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none bg-crimson text-white hover:bg-crimson-600 active:bg-crimson-600 text-body px-6 py-3"
            >
              Medium
            </button>
            {/* primary lg */}
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide rounded-btn transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-crimson disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none bg-crimson text-white hover:bg-crimson-600 active:bg-crimson-600 text-body-lg px-8 py-4"
            >
              Large
            </button>
          </div>
        </div>
      </section>

      {/* Sub-section B — navy background contrast verification */}
      <section className="w-full bg-navy py-12">
        <div className="w-full max-w-[1280px] mx-auto px-container-x md:px-8 lg:px-12">
          <p className="font-sans text-caption text-white/60 uppercase tracking-[0.08em] mb-4">
            On navy background — contrast verification
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* primary md */}
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide rounded-btn transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-crimson disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none bg-crimson text-white hover:bg-crimson-600 active:bg-crimson-600 text-body px-6 py-3"
            >
              Primary Action
            </button>
            {/* secondary md — navy-bg config */}
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide rounded-btn transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none bg-transparent border-2 border-white text-white hover:bg-white hover:text-navy active:bg-white active:text-navy text-body px-6 py-3"
            >
              Secondary Action
            </button>
          </div>
          <p className="font-sans text-caption text-white/50">
            Primary: white on crimson 8.6:1 · Secondary: white on transparent/navy 15.9:1
          </p>
        </div>
      </section>

      {/* ── SECTION 4 — SAMPLE CARD ─────────────────────────────── */}
      <section className="w-full bg-white py-section-y">
        <div className="w-full max-w-[1280px] mx-auto px-container-x md:px-8 lg:px-12">
          <h2 className="font-display text-h3 text-navy mb-10">04 · Sample Card</h2>

          <div className="max-w-sm">
            <article className="bg-cream-100 rounded-card border border-line shadow-card p-8">

              {/* Badge */}
              <span className="inline-flex items-center bg-navy text-white font-sans font-semibold uppercase tracking-[0.08em] text-[0.6875rem] px-3 py-1 rounded-badge mb-4">
                Woven Fabrics
              </span>

              {/* Heading */}
              <h3 className="font-display text-h4 text-navy mt-0 mb-3">
                Bulk Order Inquiry
              </h3>

              {/* Body text */}
              <p className="font-sans text-body text-ink-muted leading-[1.65] mb-6">
                Minimum order quantities vary by product category and fabric specification —
                contact us with your requirements to receive a tailored quotation. Standard
                production lead times range from 30 to 60 days from sample approval to shipment.
              </p>

              {/* Primary button */}
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide rounded-btn transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-crimson disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none bg-crimson text-white hover:bg-crimson-600 text-body px-6 py-3"
              >
                Request Quote
              </button>

            </article>
          </div>
        </div>
      </section>

      {/* ── SECTION 5 — FORM INPUTS ─────────────────────────────── */}
      <section className="w-full bg-cream py-section-y">
        <div className="w-full max-w-[1280px] mx-auto px-container-x md:px-8 lg:px-12">
          <h2 className="font-display text-h3 text-navy mb-10">05 · Form Inputs</h2>

          {/* Default state */}
          <p className="font-sans text-caption text-ink-muted uppercase tracking-[0.08em] mb-4">
            Default state
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">

            {/* Input field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sg-company-name"
                className="font-sans text-sm font-medium text-navy"
              >
                Company Name
              </label>
              <input
                id="sg-company-name"
                name="companyName"
                type="text"
                placeholder="e.g. Gildan Activewear"
                aria-invalid="false"
                className="w-full bg-white font-sans text-body text-navy rounded-input border border-line px-4 py-3 placeholder:text-ink-muted/50 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                readOnly
              />
            </div>

            {/* Select field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sg-product-category"
                className="font-sans text-sm font-medium text-navy"
              >
                Product Category
              </label>
              <div className="relative">
                <select
                  id="sg-product-category"
                  name="productCategory"
                  aria-invalid="false"
                  className="w-full appearance-none bg-white font-sans text-body text-navy rounded-input border border-line px-4 py-3 pr-10 transition-colors duration-150 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                >
                  <option value="" disabled>Select a category</option>
                  <option value="woven-shirts">Woven Shirts</option>
                  <option value="knitwear">Knitwear</option>
                  <option value="denim">Denim</option>
                  <option value="workwear">Workwear</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-4 w-4 text-navy"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Error state */}
          <p className="font-sans text-caption text-ink-muted uppercase tracking-[0.08em] mt-10 mb-4">
            Error state
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="sg-company-name-error"
                className="font-sans text-sm font-medium text-navy"
              >
                Company Name
              </label>
              <input
                id="sg-company-name-error"
                name="companyNameError"
                type="text"
                defaultValue=""
                aria-invalid="true"
                aria-describedby="sg-company-name-error-msg"
                className="w-full bg-white font-sans text-body text-navy rounded-input border border-crimson px-4 py-3 placeholder:text-ink-muted/50 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson"
                readOnly
              />
              <p
                id="sg-company-name-error-msg"
                role="alert"
                className="font-sans text-caption text-crimson"
              >
                Please enter your company name.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 6 — TOKEN REFERENCE ─────────────────────────── */}
      <section className="w-full bg-white py-section-y">
        <div className="w-full max-w-[1280px] mx-auto px-container-x md:px-8 lg:px-12">
          <h2 className="font-display text-h3 text-navy mb-10">06 · Token Reference</h2>

          <div className="space-y-12">

            {/* Sub-table 1 — Spacing */}
            <div>
              <h3 className="font-display text-h4 text-navy mb-4">Spacing</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-line">
                      <th className="text-left py-2 pr-8 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">Token</th>
                      <th className="text-left py-2 pr-8 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">CSS Variable / Tailwind Key</th>
                      <th className="text-left py-2 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">Resolved Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/50">
                    <tr>
                      <td className="py-2.5 pr-8 font-mono text-caption text-navy whitespace-nowrap">section-y</td>
                      <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">py-section-y</td>
                      <td className="py-2.5 font-mono text-caption text-ink-muted">5rem (80px) · Mobile override: py-10 = 2.5rem (40px)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-8 font-mono text-caption text-navy whitespace-nowrap">container-x</td>
                      <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">px-container-x</td>
                      <td className="py-2.5 font-mono text-caption text-ink-muted">1.5rem (24px) mobile · md:px-8 = 2rem · lg:px-12 = 3rem</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sub-table 2 — Border Radius */}
            <div>
              <h3 className="font-display text-h4 text-navy mb-4">Border Radius</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-line">
                      <th className="text-left py-2 pr-8 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">Token</th>
                      <th className="text-left py-2 pr-8 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">CSS Variable / Tailwind Key</th>
                      <th className="text-left py-2 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">Resolved Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/50">
                    <tr>
                      <td className="py-2.5 pr-8 font-mono text-caption text-navy whitespace-nowrap">card</td>
                      <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">rounded-card</td>
                      <td className="py-2.5 font-mono text-caption text-ink-muted">0.75rem (12px)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-8 font-mono text-caption text-navy whitespace-nowrap">btn</td>
                      <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">rounded-btn</td>
                      <td className="py-2.5 font-mono text-caption text-ink-muted">0.375rem (6px)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-8 font-mono text-caption text-navy whitespace-nowrap">badge</td>
                      <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">rounded-badge</td>
                      <td className="py-2.5 font-mono text-caption text-ink-muted">0.25rem (4px)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-8 font-mono text-caption text-navy whitespace-nowrap">input</td>
                      <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">rounded-input</td>
                      <td className="py-2.5 font-mono text-caption text-ink-muted">0.375rem (6px)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sub-table 3 — Box Shadow */}
            <div>
              <h3 className="font-display text-h4 text-navy mb-4">Box Shadow</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-line">
                      <th className="text-left py-2 pr-8 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">Token</th>
                      <th className="text-left py-2 pr-8 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">CSS Variable / Tailwind Key</th>
                      <th className="text-left py-2 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">Resolved Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/50">
                    <tr>
                      <td className="py-2.5 pr-8 font-mono text-caption text-navy whitespace-nowrap">card</td>
                      <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">shadow-card</td>
                      <td className="py-2.5 font-mono text-caption text-ink-muted">0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(10,34,64,0.08)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-8 font-mono text-caption text-navy whitespace-nowrap">card-dark</td>
                      <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">shadow-card-dark</td>
                      <td className="py-2.5 font-mono text-caption text-ink-muted">0 2px 8px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.35)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sub-table 4 — Z-Index */}
            <div>
              <h3 className="font-display text-h4 text-navy mb-4">Z-Index</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-line">
                      <th className="text-left py-2 pr-8 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">Token</th>
                      <th className="text-left py-2 pr-8 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">CSS Variable / Tailwind Key</th>
                      <th className="text-left py-2 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">Resolved Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/50">
                    <tr>
                      <td className="py-2.5 pr-8 font-mono text-caption text-navy whitespace-nowrap">behind</td>
                      <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">z-behind</td>
                      <td className="py-2.5 font-mono text-caption text-ink-muted">-1</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-8 font-mono text-caption text-navy whitespace-nowrap">nav</td>
                      <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">z-nav</td>
                      <td className="py-2.5 font-mono text-caption text-ink-muted">50</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-8 font-mono text-caption text-navy whitespace-nowrap">modal</td>
                      <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">z-modal</td>
                      <td className="py-2.5 font-mono text-caption text-ink-muted">100</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-8 font-mono text-caption text-navy whitespace-nowrap">tooltip</td>
                      <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">z-tooltip</td>
                      <td className="py-2.5 font-mono text-caption text-ink-muted">200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sub-table 5 — Typography Steps */}
            <div>
              <h3 className="font-display text-h4 text-navy mb-4">Typography Steps</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-line">
                      <th className="text-left py-2 pr-8 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">Step</th>
                      <th className="text-left py-2 pr-8 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">rem</th>
                      <th className="text-left py-2 pr-8 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">px</th>
                      <th className="text-left py-2 pr-8 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">Line-Height</th>
                      <th className="text-left py-2 pr-8 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">Letter-Spacing</th>
                      <th className="text-left py-2 font-sans text-caption font-semibold text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">Font Family</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/50">
                    {[
                      { step: "display", rem: "3.815rem", px: "61px", lh: "1.1", ls: "-0.02em", ff: "Cormorant Garamond" },
                      { step: "h1",      rem: "3.052rem", px: "49px", lh: "1.15", ls: "-0.02em", ff: "Cormorant Garamond" },
                      { step: "h2",      rem: "2.441rem", px: "39px", lh: "1.2", ls: "-0.015em", ff: "Cormorant Garamond" },
                      { step: "h3",      rem: "1.953rem", px: "31px", lh: "1.25", ls: "-0.01em", ff: "Cormorant Garamond" },
                      { step: "h4",      rem: "1.563rem", px: "25px", lh: "1.3", ls: "-0.01em", ff: "Cormorant Garamond" },
                      { step: "body-lg", rem: "1.250rem", px: "20px", lh: "1.6", ls: "0em", ff: "Inter" },
                      { step: "body",    rem: "1.000rem", px: "16px", lh: "1.65", ls: "0em", ff: "Inter" },
                      { step: "caption", rem: "0.800rem", px: "13px", lh: "1.5", ls: "+0.02em", ff: "Inter" },
                    ].map((row) => (
                      <tr key={row.step}>
                        <td className="py-2.5 pr-8 font-mono text-caption text-navy whitespace-nowrap">{row.step}</td>
                        <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">{row.rem}</td>
                        <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">{row.px}</td>
                        <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">{row.lh}</td>
                        <td className="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">{row.ls}</td>
                        <td className="py-2.5 font-mono text-caption text-ink-muted">{row.ff}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

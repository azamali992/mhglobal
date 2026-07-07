# MH Global Attire — Agent Prompt Pack

## Pro-level, phase-by-phase prompts for each Claude Code agent

> **Use with:** `MH-Global-Attire-Master-Build-Plan.md` (the master plan).
> **How:** `@agent-dev-orchestrator` dispatches each prompt below to the named agent at the right phase. Every prompt is already refined — but if you tweak scope, pass it through `@agent-prompt-refiner` again first.
> **Global rule injected into every agent:** *"Read the master plan §3 (brand tokens), §5 (schema), and §15 (approved copy) before writing anything. Never invent copy, colors, or certifications. Match the navy `#0A2240` / crimson `#941C1D` / cream `#EDE6D6` system exactly. Respect `prefers-reduced-motion`. Ask before introducing a dependency not in §2."*

---

## Meta-agent standing instructions

### `@agent-dev-orchestrator` — standing prompt
```
You own delivery of the MH Global Attire website per the master plan.
Responsibilities:
- Execute Phases 0–8 in order. Do NOT start a phase until the previous Phase Gate is approved by Azam.
- Before dispatching any sub-task, route its prompt through @agent-prompt-refiner.
- Assign each task to the correct specialist (see role table, master plan §0).
- After each agent returns work, integrate it, run a smoke check, and summarize what changed + what's blocked.
- Enforce the acceptance criteria listed in each phase prompt. If criteria aren't met, send it back with specific notes — don't accept partial work.
- Maintain a running CHANGES.md at repo root: date, phase, agent, files touched, decisions made.
- At each Phase Gate, produce a short review packet for Azam: what was built, screenshots/links, open questions, and the exact next-phase plan.
Never expand scope beyond the master plan without flagging it.
```

### `@agent-prompt-refiner` — standing prompt
```
For every task prompt handed to you, return a sharper version that:
- Names the target agent and its single objective for this task.
- Injects only the relevant master-plan sections (don't dump the whole plan).
- Lists explicit constraints (stack from §2, tokens from §3, schema from §5, copy from §15).
- Defines concrete deliverables (file paths, component names, routes).
- Ends with testable acceptance criteria.
- Strips ambiguity: no "make it nice" — specify what "nice" means here.
Keep it tight. A good prompt is unambiguous, bounded, and verifiable.
```

---

# PHASE 0 — Foundation

### 0A · `@agent-ui-designer` (runs `design-taste-frontend`)
```
OBJECTIVE: Define the MH Global Attire design system before any page is built.

CONTEXT: Premium B2B apparel manufacturer, Faisalabad. Palette (from logo, master plan §3):
navy #0A2240 (primary), crimson #941C1D (accent/CTA), cream #EDE6D6 (base), plus the token
scale in §3. Aesthetic: corporate, international, export-focused, premium, restrained. Reference:
Aceternity UI polish + Gildan-style corporate clarity. Run design-taste-frontend for direction.

DELIVERABLES:
1. Design tokens file (tailwind.config + globals.css): full color scale, spacing, radii, shadows,
   z-index, breakpoints.
2. Typography system: pick a high-contrast serif for display (echoing the "MH" serif) + a clean
   geometric sans for body (echoing "GLOBAL ATTIRE"). Define a 1.25 modular type scale with named
   utilities (display, h1–h4, body, caption). Load via next/font.
3. Component primitives spec (not built yet, just specified): Button (primary crimson / secondary
   navy-outline / ghost), Card, Badge, Input, Select, Section wrapper, Container, Nav, Footer.
4. A one-screen "style tile" page at /styleguide rendering tokens, type scale, buttons, and a
   sample card so Azam can approve the look.

CONSTRAINTS: Match §3 hex values exactly. WCAG AA contrast on every text/background pair.
Serif for headings only; never body. No green anywhere (old palette is dead).

ACCEPTANCE: /styleguide renders; all tokens documented; contrast passes; Azam approves the tile.
```

### 0B · `@agent-frontend-dev` (runs `emilkowalski/skill`)
```
OBJECTIVE: Scaffold the Next.js 14 app and global shell using the approved design system.

DELIVERABLES:
1. Next.js 14 (App Router) + TypeScript + Tailwind project, strict TS, ESLint + Prettier.
2. Folder structure per master plan §2 (app/, components/ui, components/sections,
   components/motion, lib/, prisma/, content/).
3. Lenis smooth-scroll React context provider wrapping the app.
4. Global layout: sticky Header (logo, nav for all 12 routes, "Request a Quote" crimson CTA,
   mobile drawer), Footer (company info from §15, quick links, socials, clickable tel/mailto/
   WhatsApp), and a floating WhatsApp button (wa.me/923213995224).
5. Build the Button/Card/Container/Section primitives from 0A.
6. Framer Motion installed; a reusable <Reveal> wrapper (whileInView stagger) and <PageTransition>.

CONSTRAINTS: No page content yet — placeholders fine. Header/footer must be responsive.
prefers-reduced-motion disables Lenis + reveals. Use next/font, no external font CDN.

ACCEPTANCE: App runs; header/footer/WhatsApp render responsively; smooth scroll works; primitives
match /styleguide; Lighthouse has no layout-shift warnings on the shell.
```
**Gate 0:** design system + shell approved.

---

# PHASE 1 — Data & backend core

### 1 · `@agent-backend-dev`
```
OBJECTIVE: Stand up the full data layer, integrations, and admin auth.

DELIVERABLES:
1. Prisma schema EXACTLY as master plan §5 (Category, Product, Inquiry+enum, ContentBlock,
   SiteSetting, AdminUser, Certification). Run migrations against managed Postgres.
2. lib/db.ts (Prisma singleton), lib/cloudinary.ts (signed uploads, f_auto/q_auto, per-entity
   folders), lib/email.ts (Nodemailer over Gmail SMTP — mirror Azam's existing MCL tooling).
3. content/seed.ts that seeds: all 10 categories + representative products (§15), every
   ContentBlock (hero headings, subheadings, section intros — verbatim §15), SiteSettings
   (phone, WhatsApp, 3 emails, social URLs), and one AdminUser (bcrypt-hashed, creds via env).
4. Auth.js (NextAuth) credentials provider: bcrypt verify, JWT session, /admin/login page,
   middleware.ts guarding /admin/**.
5. POST /api/inquiry route handler: Zod-validated, persists Inquiry, returns typed result
   (email + spam wired in Phase 4 — leave clean seams).

CONSTRAINTS: All secrets via env (.env.example committed, .env NOT). No raw SQL. Parameterized
Prisma only. Slugs unique + auto-generated. Copy in seed must match §15 word-for-word.

ACCEPTANCE: migrations apply; DB seeded; /admin/login authenticates the seeded admin; a test POST
to /api/inquiry writes a row; npm run build passes with strict TS.
```
**Gate 1:** DB seeded, admin login works, inquiry write verified.

---

# PHASE 2 — Admin CMS

### 2A · `@agent-ui-designer`
```
OBJECTIVE: Design the admin panel — clean, on-brand, usable by a non-technical owner.

DELIVERABLES: Layouts + component specs for: Dashboard (new-inquiry count, latest 5, quick links),
Categories & Products (table + create/edit form, drag-reorder, Cloudinary image upload, publish
toggle, slug field), Inquiries (filterable table + detail drawer + status control + attachment
download + mailto reply), Content (grouped by page, inline edit of headings/body/images),
Settings (phone, WhatsApp, emails, socials, footer text). Toast confirmations, optimistic UI.

CONSTRAINTS: Same brand tokens but calmer/denser than marketing pages. Mobile-usable. No raw JSON
editing exposed to the user. Zero jargon in labels.

ACCEPTANCE: Azam reviews the flows and confirms a non-coder could operate them.
```

### 2B · `@agent-backend-dev`
```
OBJECTIVE: Build the admin CMS from the approved 2A designs.

DELIVERABLES: All /admin/** routes (master plan §4) with working CRUD via Server Actions +
session guards: categories, products, inquiries (view/status), content blocks, settings.
Cloudinary upload widget wired. Drag-to-reorder persists `order`. Slug auto-gen + manual override.

CONSTRAINTS: Every mutation Zod-validated + auth-checked in middleware AND action. Optimistic UI
with server reconciliation. Edits to ContentBlock/SiteSetting must reflect on the live public site.

ACCEPTANCE: Azam can (a) add a product with images, (b) reorder categories, (c) edit the home hero
heading, (d) change the WhatsApp number, (e) mark an inquiry REVIEWED — all with no code, and see
public-site changes reflected.
```
**Gate 2:** non-technical content editing proven end-to-end.

---

# PHASE 3 — Public pages

> Loop per page: **3-design** (ui-designer) → **3-build** (frontend-dev). Do Home first as the pattern-setter, get it approved, then batch the rest.

### 3-design · `@agent-ui-designer` (runs `design-taste-frontend`)
```
OBJECTIVE: Design page: [PAGE NAME].

CONTEXT: Pull approved copy for this page from master plan §15 (verbatim). Palette + type from the
Phase 0 system. Aesthetic references + component palette from master plan §9 and §10.

DELIVERABLES: Section-by-section layout for this page: content hierarchy, which Aceternity-style
components go where (from §10), image/illustration placements (alt text drafted), responsive
behaviour (mobile/tablet/desktop), and the specific motion intent per section (what reveals, in
what order). One <h1>, logical h2/h3.

CONSTRAINTS: Restraint over decoration. Motion is accent, not noise. Sustainability page: approved
wording only, NO unverified claims. Every image needs descriptive alt (SEO).

ACCEPTANCE: Layout covers all §15 copy for the page, is responsive by design, and names its
components + motion. Azam approves before build.
```

### 3-build · `@agent-frontend-dev` (runs `emilkowalski/skill`)
```
OBJECTIVE: Build page: [PAGE NAME] from the approved 3-design.

DELIVERABLES: Fully responsive page pulling LIVE data where applicable (categories/products from
DB, editable copy from ContentBlock). Implement the specified components + reveals. Products page:
category grid → /products/[slug] detail with fabrics/GSM/sizes/customization + MOQ note + inquiry
CTA. Manufacturing: 9-stage animated process. OEM: 10-step workflow. QA: 12-point checklist reveal.

CONSTRAINTS: Real copy from §15 only (via CMS/seed). Images via Cloudinary (f_auto/q_auto, width/
height set, alt present). Dynamic-import anything heavy. prefers-reduced-motion honored. No CLS.

ACCEPTANCE: Page matches design on mobile + desktop, pulls live data, copy matches §15, no console
errors, no layout shift, Lighthouse a11y ≥ 90 for the page.
```
**Gate 3:** all 12 pages reviewed on mobile + desktop.

---

# PHASE 4 — Inquiry system + integrations

### 4A · `@agent-frontend-dev`
```
OBJECTIVE: Build the buyer inquiry form UI on /request-a-quote (and a compact variant on /contact).

DELIVERABLES: React Hook Form + Zod form with fields (master plan §8): name*, company, country*
(searchable select), email*, phone (country code), product interest (select from live categories),
quantity, fabric, GSM, customization, message, file upload (jpg/png/pdf, ≤5 files, ≤10MB each with
client preview + remove). Inline validation, disabled-until-valid submit, loading + success + error
states. Success screen offers a prefilled WhatsApp shortcut. Hidden honeypot field.

ACCEPTANCE: Validation blocks bad input; uploads preview; states all render; matches brand; a11y
labels on every field.
```

### 4B · `@agent-backend-dev`
```
OBJECTIVE: Complete the inquiry pipeline behind the form.

DELIVERABLES: Finish POST /api/inquiry: verify Cloudflare Turnstile token, honeypot check, per-IP
rate limit (5/hr), upload files to Cloudinary, persist Inquiry with fileUrls, send email
notification to info@/sales@ via lib/email.ts, send optional auto-acknowledgement to the buyer,
return typed success/error. Log failures without leaking internals.

CONSTRAINTS: Reject disallowed file types server-side (never trust client). Sanitize all inputs.
Env-based SMTP creds. Idempotent + graceful on email failure (still save the inquiry, flag it).

ACCEPTANCE: End-to-end test: submit with a PDF → row in DB with Cloudinary URL → notification email
received → buyer auto-reply received → spam/honeypot/rate-limit each block a bad attempt.
```
**Gate 4:** end-to-end inquiry proven.

---

# PHASE 5 — Motion & 3D polish

### 5 · `@agent-frontend-dev` (runs `emilkowalski/skill`)
```
OBJECTIVE: Elevate motion across the site to premium, physics-driven, never janky.

DELIVERABLES:
- Global: refined Lenis config, Framer Motion page transitions, consistent scroll-reveal timing.
- Aceternity-style components (rebuilt, not copied): Spotlight/Background Beams hero backdrop,
  Bento Grid + 3D tilt cards for categories, Sticky Scroll Reveal for capabilities, Infinite
  Moving Cards for the trust strip, Text Generate Effect for the hero headline, Moving Border on
  primary CTAs.
- ONE hero 3D moment via React Three Fiber (slow-rotating folded garment / fabric-drape plane,
  navy+crimson lighting), lazy-loaded + mobile-degraded to a static/canvas fallback.
- Spring physics on interactive hovers (sensible stiffness/damping).

CONSTRAINTS: emilkowalski/skill owns easing + timing. Dynamic-import all 3D/heavy motion. Cap DPR,
pause off-screen, never block LCP. Full prefers-reduced-motion fallbacks. If a 3D effect risks
performance, ship the canvas/SVG fallback instead.

ACCEPTANCE: Motion review passes; no jank at 60fps on mid-range mobile; LCP unchanged vs Phase 3;
reduced-motion path verified.
```
**Gate 5:** motion approved, performance intact.

---

# PHASE 6 — SEO

### 6 · `@agent-frontend-dev`
```
OBJECTIVE: Implement full on-page + technical SEO (master plan §11).

DELIVERABLES:
- Unique title + meta description per page (Metadata API, template titles).
- Open Graph + Twitter cards with a branded OG image per page.
- JSON-LD: Organization, Product (per product), Service, ContactPoint, BreadcrumbList, FAQPage
  (add an FAQ block to Home or Contact).
- next-sitemap → sitemap.xml + robots.txt. Canonical tags site-wide.
- Descriptive image filenames + alt everywhere; internal links (products↔capabilities↔OEM↔quote).
- GA4 + Google Search Console verification wired.
- Place target keywords naturally in copy/metadata (§11 list): apparel manufacturer in Pakistan,
  clothing manufacturer in Faisalabad, private-label / custom apparel / T-shirt / hoodie /
  sportswear / workwear manufacturer Pakistan, OEM clothing manufacturer, apparel exporter Pakistan.

CONSTRAINTS: Don't keyword-stuff. One h1/page. Schema must validate. Note to Azam: Google Business
Profile doesn't exist yet — flag for client action.

ACCEPTANCE: Lighthouse SEO ≥ 90; Google Rich Results test passes for Organization + Product;
sitemap/robots reachable; GA4 fires; every image has alt.
```
**Gate 6:** SEO verified.

---

# PHASE 7 — Security, QA & performance

### 7A · `@agent-cyber-analyst`
```
OBJECTIVE: Security audit + hardening (master plan §12).

DELIVERABLES: Verify/implement — HTTPS + HSTS; security headers via middleware (CSP, X-Frame-
Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy); admin auth hardening
(bcrypt, httpOnly+secure+sameSite cookies, login rate limit/lockout); Zod validation + output
escaping on all inputs; file-upload allow-list enforced server-side; inquiry + login rate limiting;
secrets only in env; npm audit clean; documented Postgres backup + restore.

DELIVERABLE FORMAT: A SECURITY.md report — each item PASS/FAIL with the fix applied.

ACCEPTANCE: Every §12 item PASS. No high/critical npm audit findings. CSP doesn't break the site.
```

### 7B · `@agent-sqa-engineer` (runs `/impeccable`)
```
OBJECTIVE: Full QA + polish pass.

DELIVERABLES: Test every page + admin flow across Chrome/Safari/Firefox + mobile/tablet/desktop.
Verify: forms, validation, uploads, email, CMS edits reflecting live, all links (tel/mailto/
WhatsApp/social), 404/empty states, keyboard nav + screen-reader labels, focus states. Run
/impeccable on each page for final polish. Tune Core Web Vitals (LCP/CLS/INP) to green.

DELIVERABLE FORMAT: QA-REPORT.md — checklist with pass/fail + repro steps for any bug, filed back
to the owning agent.

ACCEPTANCE: All flows pass; Lighthouse ≥ 90 across Performance/Accessibility/Best-Practices/SEO on
mobile; zero console errors; /impeccable polish applied to all 12 pages.
```
**Gate 7:** security + QA green.

---

# PHASE 8 — Staging, launch & handoff

### 8 · `@agent-dev-orchestrator` (coordinating)
```
OBJECTIVE: Ship and hand off.

DELIVERABLES:
1. Deploy to Vercel + managed Postgres; provide a staging review link.
2. Run ≥2 review rounds with Azam; apply reasonable revisions. DO NOT go live without approval.
3. Domain + business email setup (Google Workspace or Zoho): info@ / sales@ / ahmad@
   mhglobalattire.com. DNS, SPF/DKIM/DMARC.
4. Go live on approval.
5. Handoff package (master plan §16): repo + access, admin login, hosting/domain/email access,
   DB + files backup, brand/theme docs, dependency + license list, and a short "how to update your
   site" video + written guide (add product, edit copy, read inquiries).

ACCEPTANCE: Site live on the domain, emails deliver, admin usable by client, full handoff delivered
and acknowledged.
```
**Gate 8:** signed off & live.

---

## Quick dispatch cheat-sheet

| Phase | Agent(s) | Skill | Output |
|---|---|---|---|
| 0 | ui-designer → frontend-dev | design-taste-frontend, emilkowalski | Design system + app shell |
| 1 | backend-dev | — | Schema, seed, auth, integrations |
| 2 | ui-designer → backend-dev | — | Admin CMS |
| 3 | ui-designer → frontend-dev (per page) | both design skills | 12 public pages |
| 4 | frontend-dev + backend-dev | — | Inquiry pipeline |
| 5 | frontend-dev | emilkowalski | Motion + 3D |
| 6 | frontend-dev | — | SEO |
| 7 | cyber-analyst + sqa-engineer | /impeccable | Security + QA |
| 8 | dev-orchestrator | — | Launch + handoff |

Every prompt → refine via `@agent-prompt-refiner` → execute → integrate via `@agent-dev-orchestrator` → stop at the Gate.

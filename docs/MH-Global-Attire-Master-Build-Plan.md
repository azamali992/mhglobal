# MH Global Attire Ltd. — Website Build

## Master Orchestration Plan (for Claude Code)

> **Owner:** Azam · **Client:** MH Global Attire Ltd. (Faisalabad, Pakistan)
> **Purpose:** A single source of truth handed to `@agent-dev-orchestrator` to plan, delegate, build, audit, and ship the full B2B apparel-manufacturing website — frontend, backend, admin CMS, inquiry system, SEO, and security.
> **Reference aesthetic:** Aceternity UI (https://ui.aceternity.com/) components + Gildan-style corporate clarity. Premium, modern, clean motion, subtle 3D.

---

## 0. How to run this with your agents

Feed this whole file to `@agent-dev-orchestrator` with the instruction:
*"This is the master plan. Break it into the phases in §13, delegate each task to the named agent, run every prompt through `@agent-prompt-refiner` before execution, and stop at each Phase Gate for my approval."*

**Agent roles for this project:**

| Agent | Responsibility |
|---|---|
| `@agent-dev-orchestrator` | Owns the phase plan, sequences work, enforces gates, integrates outputs |
| `@agent-prompt-refiner` | Refines every sub-task prompt before it goes to a build agent |
| `@agent-ui-designer` | Design system, page layouts, component specs — runs **`design-taste-frontend`** |
| `@agent-frontend-dev` | Builds pages, components, motion, 3D — runs **`emilkowalski/skill`** for animation |
| `@agent-backend-dev` | Prisma schema, API routes, admin CMS, inquiry pipeline, email, auth |
| `@agent-sqa-engineer` | Functional + responsive + accessibility + performance testing — runs **`/impeccable`** |
| `@agent-cyber-analyst` | Security review: auth, input validation, spam, rate-limiting, headers, secrets |

**Skills usage:**
- `/impeccable` → final audit-and-polish pass on every page before its gate.
- `design-taste-frontend` → invoked by ui-designer at the start of each page design.
- `emilkowalski/skill` → invoked by frontend-dev for all motion refinement.

---

## 1. Goal & success criteria

Build a **premium, modern, fast, fully-responsive B2B website** whose job is to build buyer confidence and generate international apparel inquiries. **No e-commerce / payments** at launch (architected so it can be added later).

**Definition of done:**
- All 12 pages live, responsive (mobile/tablet/desktop), and populated with the real copy in §15.
- Non-technical admin can add/edit/remove categories, products, page content, contact info, and inquiries with zero code.
- Buyer inquiry form works end-to-end: validation → file upload → DB record → email notification → WhatsApp fallback.
- Lighthouse ≥ 90 on Performance, Accessibility, Best Practices, SEO (mobile).
- All SEO items in §11 implemented and verifiable.
- Security checklist in §12 passed by `@agent-cyber-analyst`.
- Full handoff package delivered (§16).

---

## 2. Tech stack (locked)

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + CSS variables for brand tokens
- **Database:** PostgreSQL via **Prisma** ORM
- **Images/media:** Cloudinary (upload, transform, auto-format/-quality, CDN)
- **Motion:** Framer Motion + **Lenis** smooth-scroll (via React context provider)
- **3D:** React Three Fiber + drei (Three.js) — used sparingly, lazy-loaded
- **Forms:** React Hook Form + Zod validation
- **Auth (admin):** Auth.js (NextAuth) credentials provider, bcrypt-hashed passwords, JWT sessions
- **Email:** Nodemailer over Gmail SMTP (matches your existing MCL tooling) OR Resend — pick one in Phase 1
- **Spam protection:** Cloudflare Turnstile (or hCaptcha) + honeypot + server-side rate limit
- **Deployment:** Vercel (frontend) + managed Postgres (Neon / Supabase / Railway)
- **SEO:** Next.js Metadata API + `next-sitemap` + JSON-LD schema
- **Analytics:** Google Analytics 4 + Google Search Console

**Repo conventions:** `app/` routes, `components/ui/` (primitives), `components/sections/` (page sections), `components/motion/` (animation wrappers), `lib/` (db, email, cloudinary, seo), `prisma/`, `content/` (seed copy). ESLint + Prettier + strict TS.

---

## 3. Brand system (extracted from the real logo)

### Color tokens
| Token | Hex | Use |
|---|---|---|
| `--navy` (primary) | `#0A2240` | Headings, nav, footer, primary surfaces, "MH" identity |
| `--navy-800` | `#0D2A4E` | Elevated navy surfaces, cards on dark |
| `--crimson` (accent) | `#941C1D` | CTAs, links, highlights, the "GLOBAL ATTIRE" banner identity |
| `--crimson-600` | `#B02A28` | Hover state for crimson |
| `--cream` (base) | `#EDE6D6` | Page background, warm neutral sections |
| `--cream-100` | `#F5F1E8` | Lighter cards on cream |
| `--white` | `#FFFFFF` | Text on navy/crimson, clean surfaces |
| `--ink-muted` | `#4A5568` | Body text on light |
| `--line` | `#D8CFBC` | Hairline borders on cream |

> Confirm these against the vector logo when the AI/EPS/SVG version is available; the values above are sampled from the JPEG.

### Typography
- **Display / headings:** an elegant high-contrast serif that echoes the logo's "MH" (e.g. **Cormorant Garamond**, **Playfair Display**, or **Fraunces**) — used for hero + section headings.
- **Body / UI:** a clean geometric/grotesk sans (e.g. **Inter**, **Geist**, or **Manrope**) — echoes the "GLOBAL ATTIRE" letterforms.
- Load via `next/font` (self-hosted, no layout shift). Set a modular type scale (e.g. 1.25 ratio).

### Logo usage
- Provide `logo-full.svg`, `logo-mono-navy.svg`, `logo-mono-white.svg`, `favicon` set, and OG image.
- Navy logo on cream/white; white logo on navy/crimson. Respect clear-space = height of the "M".

### Design language
Premium, corporate, international, export-focused. Generous whitespace, strong grid, serif/sans contrast, cream warmth offset by navy authority and crimson energy. **Restraint over decoration** — motion and 3D are accents, never noise.

---

## 4. Information architecture (routes)

**Public**
```
/                     Home
/about                About Us
/products             Products (category grid)
/products/[slug]      Category detail (e.g. /products/hoodies)
/manufacturing        Manufacturing & Capabilities
/oem-services         Private Label / OEM Services
/quality-assurance    Quality Assurance
/sustainability       Responsible Manufacturing
/why-choose-us        Why Choose Us
/contact              Contact Us
/request-a-quote      Buyer Inquiry / Quotation
/privacy-policy       Privacy Policy
/terms                Terms & Conditions
```

**Admin (protected)**
```
/admin/login
/admin                Dashboard (inquiry count, quick stats)
/admin/categories     CRUD categories
/admin/products       CRUD products
/admin/inquiries      View/manage buyer inquiries + status
/admin/content        Edit page sections (hero copy, headings, blocks)
/admin/settings       Contact info, socials, WhatsApp number, emails
```

**Global:** sticky header w/ nav + "Request a Quote" CTA; footer with company info, quick links, socials, clickable phone/email/WhatsApp. Floating WhatsApp button on all public pages.

---

## 5. Data model (Prisma schema)

```prisma
model Category {
  id           String    @id @default(cuid())
  name         String
  slug         String    @unique
  description  String?
  gsmRange     String?
  heroImage    String?          // Cloudinary URL
  order        Int       @default(0)
  published    Boolean   @default(true)
  products     Product[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Product {
  id             String   @id @default(cuid())
  name           String
  slug           String   @unique
  categoryId     String
  category       Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  description    String?
  fabricOptions  String[]        // e.g. ["100% cotton","CVC","French terry"]
  gsmRange       String?
  sizes          String?         // "XS–5XL"
  customization  String[]
  images         String[]        // Cloudinary URLs
  order          Int      @default(0)
  published      Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model Inquiry {
  id             String   @id @default(cuid())
  name           String
  company        String?
  country        String?
  email          String
  phone          String?
  productInterest String?
  quantity       String?
  fabric         String?
  gsm            String?
  customization  String?
  message        String?
  fileUrls       String[]        // uploaded refs/tech packs (Cloudinary)
  status         InquiryStatus @default(NEW)
  createdAt      DateTime @default(now())
}

enum InquiryStatus { NEW REVIEWED QUOTED CLOSED }

// Flexible CMS: key/value content blocks per page section
model ContentBlock {
  id        String  @id @default(cuid())
  page      String          // "home","about",...
  key       String          // "hero.heading","hero.subheading"
  value     String
  imageUrl  String?
  order     Int     @default(0)
  updatedAt DateTime @updatedAt
  @@unique([page, key])
}

model SiteSetting {
  id    String @id @default(cuid())
  key   String @unique       // "whatsapp","email.info","social.linkedin",...
  value String
}

model AdminUser {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  name         String?
  role         String   @default("admin")
  createdAt    DateTime @default(now())
}

// Future-ready (built now, surfaced later)
model Certification {
  id        String   @id @default(cuid())
  name      String
  issuer    String?
  imageUrl  String?
  expiresAt DateTime?
  published Boolean  @default(false)
  order     Int      @default(0)
}
```

Seed `content/seed.ts` from the copy in §15 so the site is fully populated on first run.

---

## 6. Backend & API spec

Use Next.js Route Handlers (`app/api/**`) or Server Actions. Every mutation validated with Zod.

- `POST /api/inquiry` — validate → Turnstile check → rate-limit → persist `Inquiry` → send email → return success. Handles multipart for file uploads (proxy to Cloudinary; restrict to jpg/png/pdf, ≤10MB, ≤5 files).
- **Admin (auth-guarded)** CRUD for categories, products, content blocks, settings, inquiries. Use Server Actions with session checks in middleware.
- `lib/email.ts` — inquiry notification to `info@`/`sales@` + optional auto-acknowledgement to buyer.
- `lib/cloudinary.ts` — signed uploads, folder per entity, auto f_auto/q_auto transforms.
- `lib/db.ts` — Prisma singleton.
- `middleware.ts` — protect `/admin/**`, attach security headers.

---

## 7. Admin panel / CMS spec

Non-technical, clean, on-brand admin. No raw JSON editing.

- **Dashboard:** new-inquiry count, latest 5 inquiries, quick links.
- **Categories/Products:** table + create/edit forms, drag-to-reorder, image upload (Cloudinary widget), publish toggle, slug auto-generated with manual override.
- **Inquiries:** table with filters by status/date, detail drawer, status change, download attachments, mailto reply.
- **Content:** grouped by page; edit hero headings, subheadings, section body, and swap images inline. Changes reflect on the live site.
- **Settings:** phone, WhatsApp, the three emails, social URLs, footer text.
- UX: autosave or explicit save with toast confirmation; optimistic UI; mobile-usable.

---

## 8. Buyer inquiry system

**Form fields:** name*, company, country* (searchable select), email*, phone (with country code), product interest (select from live categories), quantity, fabric, GSM, customization requirements, message, **file upload** (reference images / tech packs — jpg/png/pdf).

**Behaviour:**
- Zod validation, inline errors, disabled-until-valid submit, loading + success/error states.
- Spam: Turnstile + hidden honeypot + server rate-limit (per IP, e.g. 5/hour).
- On submit: store `Inquiry`, upload files to Cloudinary, email notification to business inbox, optional auto-reply to buyer, show success screen with WhatsApp shortcut.
- **WhatsApp:** floating button + inline CTA → `https://wa.me/923213995224?text=…` prefilled.
- Clickable `tel:`, `mailto:`, and WhatsApp links everywhere they appear.

---

## 9. Frontend — page-by-page spec

All copy is in §15 (use verbatim; it's client-approved). Each page: `@agent-ui-designer` designs → `@agent-frontend-dev` builds → `emilkowalski/skill` motion pass → `/impeccable` audit.

**Home**
- **Hero:** serif headline "Custom Apparel Manufacturing for Global Brands" + subheading; two CTAs (Request a Quote / Explore Our Products). Background = subtle Aceternity **Spotlight** or **Background Beams** in navy/cream, OR a lightweight R3F 3D element (slow-rotating folded-garment / fabric-drape) lazy-loaded. Text reveal via **Text Generate Effect**.
- Trust strip (Faisalabad origin, customization, OEM, quality, partnership) as **Infinite Moving Cards** or a static icon row.
- **Product categories** as an Aceternity **Bento Grid** / **3D Card** (tilt-on-hover) linking to categories.
- **Capabilities** teaser via **Sticky Scroll Reveal**.
- QA + Why-Choose-Us highlights; final CTA band (crimson) → Request a Quote.

**About Us** — heading + intro (§15), company history, mission, vision, core-values grid (6 values w/ icons), scroll-reveal timeline (Est. 2022 → today).

**Products** — category grid (**Card Hover Effect** / tilt), each card → `/products/[slug]`. Category detail: fabrics, GSM, sizes, customization, MOQ note ("Contact us with your product and quantity requirements…"), inquiry CTA. Data pulled live from DB.

**Manufacturing & Capabilities** — "From Product Development to Final Packing." Animated 9-stage process (requirement review → fabric prep → sampling → cutting → stitching → customization → finishing → inspection → packing) as horizontal scroll or sticky-reveal stepper.

**Private Label / OEM Services** — services list (product dev, sourcing, patterns, sampling, labels, packaging, export coordination) + the 10-step workflow (§15) as a numbered animated flow. MOQ note.

**Quality Assurance** — "Quality Controlled at Every Important Stage." 12-point QC checklist as an animated reveal list + the approved QA paragraph.

**Sustainability / Responsible Manufacturing** — approved wording only; frame initiatives as "practices we're developing." **No unverified certification claims** (per client instruction).

**Why Choose Us** — 10 differentiators as an icon/bento grid with staggered reveal; crimson CTA band.

**Contact Us** — contact message (§15), full address, clickable phone/WhatsApp/email, map embed (Faisalabad), socials, compact inquiry form or link to `/request-a-quote`.

**Request a Quote** — the full inquiry form (§8).

**Privacy Policy / Terms** — generated boilerplate tailored to a Pakistan-based B2B manufacturer collecting inquiry data; clean legal template.

---

## 10. Motion / 3D / physics system

Global: **Lenis** smooth scroll via provider; Framer Motion page transitions; scroll-triggered staggered reveals (`whileInView`); spring physics on interactive elements (`type:"spring"`, sensible stiffness/damping). Respect `prefers-reduced-motion`.

**Aceternity-inspired components to adapt** (rebuild, don't copy wholesale): Spotlight, Background Beams, Bento Grid, 3D Card Effect (tilt w/ perspective), Card Hover Effect, Sticky Scroll Reveal, Infinite Moving Cards, Text Generate Effect, Animated Tooltip, Moving Border (on CTAs).

**3D (R3F) — used once or twice, lazy-loaded, mobile-degraded:**
- Optional hero: slow-rotating 3D folded tee/hoodie or a soft fabric-drape plane with navy/crimson lighting.
- Cheap alternative if 3D budget is tight: animated SVG/canvas fabric-weave or particle field in brand colors.

**Performance rules:** dynamic-import all 3D + heavy motion; cap DPR; pause off-screen; never block LCP. Motion must feel expensive but never janky — `emilkowalski/skill` owns the easing/timing polish.

---

## 11. SEO implementation (maps to client's "Advanced SEO" list)

- **Structure/URLs:** clean semantic routes (already in §4), one `<h1>` per page, logical `h2/h3`.
- **Metadata:** unique title + meta description per page via Metadata API; template titles.
- **Open Graph + Twitter cards** with branded OG image per page.
- **Schema (JSON-LD):** `Organization`, `Product` (per product), `Service` (OEM/manufacturing), `ContactPoint`, `BreadcrumbList`, `FAQPage` (add an FAQ block).
- **Sitemap + robots:** `next-sitemap` generates `sitemap.xml` + `robots.txt`; submit in Search Console.
- **Canonical tags** on every page; prevent duplicate content.
- **Images:** Cloudinary `f_auto,q_auto`, descriptive filenames, `alt` on every image, width/height set.
- **Internal linking:** cross-link products ↔ capabilities ↔ OEM ↔ quote.
- **Technical:** mobile-first, Core Web Vitals green, fast TTFB (SSG/ISR where possible), compression, lazy-loading.
- **Tooling:** GA4 + Google Search Console verification; Google Business Profile pending (none yet — note for client).
- **Target keywords** (from data doc, place naturally in copy/metadata): apparel manufacturer in Pakistan, clothing manufacturer in Faisalabad, private-label clothing manufacturer, custom apparel manufacturer Pakistan, T-shirt/hoodie/sportswear/workwear manufacturer Pakistan, OEM clothing manufacturer, apparel exporter Pakistan.

> **Clarify for the client:** this covers **on-page + technical SEO setup at launch**. **Ongoing monthly SEO** (content, backlinks, rank tracking) is a **separate retainer** — call it out in the quote.

---

## 12. Security & technical requirements

Owned by `@agent-cyber-analyst`, verified before launch:
- **HTTPS/SSL** (Vercel auto) + HSTS.
- **Security headers** via middleware: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- **Admin auth:** bcrypt hashing, secure JWT/session cookies (httpOnly, secure, sameSite), route protection, brute-force/rate limit on login.
- **Input validation** everywhere (Zod), output escaping, parameterized Prisma (no raw SQL).
- **File uploads:** type + size allow-list, server-side verification, no executable types.
- **Spam:** Turnstile + honeypot + rate limiting on inquiry + login.
- **Secrets:** all keys in env vars, never committed; separate prod/dev.
- **Backups:** managed Postgres automated backups + documented restore.
- **Dependencies:** `npm audit` clean; pinned versions.

---

## 13. Phased build plan (with gates)

`@agent-dev-orchestrator` executes phases in order; **each gate = your approval before proceeding.** Every sub-task prompt goes through `@agent-prompt-refiner` first.

**Phase 0 — Foundation**
Repo init, stack scaffold, Tailwind + brand tokens (§3), fonts, `next/font`, Lenis provider, base layout (header/footer/WhatsApp button), ESLint/Prettier/TS strict.
→ **Gate 0:** design-system preview approved.

**Phase 1 — Data & backend core** (`@agent-backend-dev`)
Prisma schema (§5), migrations, Postgres connection, Cloudinary + email libs, seed from §15, Auth.js admin login.
→ **Gate 1:** DB seeded, admin login works, inquiry API returns success in a test.

**Phase 2 — Admin CMS** (`@agent-backend-dev` + `@agent-ui-designer`)
Full admin (§7): dashboard, categories, products, inquiries, content, settings.
→ **Gate 2:** you can add a product & edit hero copy with no code.

**Phase 3 — Public pages** (`@agent-ui-designer` → `@agent-frontend-dev`)
Build all 12 pages (§9) pulling live data, real copy from §15, responsive. Design each, then build, per page.
→ **Gate 3:** all pages reviewed on mobile + desktop.

**Phase 4 — Inquiry system + integrations** (`@agent-backend-dev` + `@agent-frontend-dev`)
Full form (§8), upload, email, WhatsApp, spam protection, success flow.
→ **Gate 4:** end-to-end inquiry test (submit → DB → email → attachment) passes.

**Phase 5 — Motion & 3D polish** (`@agent-frontend-dev` + `emilkowalski/skill`)
Aceternity components, scroll reveals, hero 3D/beams, page transitions, reduced-motion.
→ **Gate 5:** motion review; no jank; LCP unaffected.

**Phase 6 — SEO** (`@agent-frontend-dev`)
Metadata, schema, sitemap, robots, OG images, alts, internal links, GA4 + Search Console.
→ **Gate 6:** Lighthouse SEO ≥ 90; rich-results test passes.

**Phase 7 — Security + QA + performance** (`@agent-cyber-analyst` + `@agent-sqa-engineer` + `/impeccable`)
Security checklist (§12), cross-browser + responsive + a11y testing, Core Web Vitals tuning, `/impeccable` polish pass on every page.
→ **Gate 7:** all checks green; Lighthouse ≥ 90 across the board.

**Phase 8 — Staging, review, launch, handoff**
Deploy to Vercel + managed Postgres, staging review link, at least two approval rounds + revisions, domain + business email (Google Workspace / Zoho) setup, then go-live **only on your approval**. Deliver handoff package (§16).
→ **Gate 8:** signed off & live.

---

## 14. Approved content library (verbatim from the data doc)

**Company:** MH Global Attire Ltd. · Est. 2022 · Faisalabad, Punjab, Pakistan (Hassan Dall Mills, New Mandi Road — 38000). Contact: Ahmad Hassan, Founder & Managing Director · +92 321 3995224 (phone/WhatsApp). Emails: info@ / sales@ / ahmad@mhglobalattire.com. Socials: Instagram `@mhglobalattire`, LinkedIn `/company/mh-global-attire/`, Facebook (profile URL in doc). Google Business Profile: not yet — recommend creating.

**Home hero H1:** *Custom Apparel Manufacturing for Global Brands*
**Home subheading:** *MH Global Attire manufactures customized apparel for brands, importers, wholesalers and private-label businesses, with support from product development and fabric selection to production, quality control, packing and shipment.*
**CTAs:** Request a Quote · Explore Our Products

**About H1:** *Manufacturing Apparel with Quality, Flexibility and Professional Commitment*
**About intro + history + mission + vision + 6 core values** (Quality, Reliability, Transparency, Customization, Partnership, Continuous Improvement) — use full text from data doc.

**Products:** T-shirts, Polo shirts, Hoodies, Sweatshirts, Joggers, Shorts, Sportswear, Workwear, Custom apparel, Other knit/woven.
**Fabrics:** 100% cotton, cotton-poly blends, CVC/PC, single jersey, piqué, interlock, French terry, fleece, rib, polyester performance, stretch/spandex, twill, buyer-specified.
**GSM:** Tees 140–240 · Polos 180–260 · Hoodies/sweats 260–400 · Joggers/shorts 220–360 · Sportswear 140–250 · Workwear per spec.
**Sizes:** XS–5XL (subject to pattern/size chart).
**MOQ wording:** *"Please contact us with your product and quantity requirements to receive a suitable MOQ and quotation."*
**Customization:** custom fabric/GSM, Pantone matching, screen/digital/heat-transfer/sublimation printing, embroidery, woven & printed labels, care/size labels, hangtags, trims, private packaging, polybags/cartons, barcode labelling, custom patterns.

**Manufacturing H1:** *From Product Development to Final Packing* + intro (data doc).
**OEM services + 10-step workflow** (inquiry → review → confirm specs → costing → sample → approval → bulk → in-process QC → final inspection → pack/ship).
**QA H1:** *Quality Controlled at Every Important Stage* + 12-point QC list + approved QA paragraph.
**Sustainability:** approved wording only; developing-practices framing; **no unverified claims.**
**Why Choose Us:** 10 differentiators (data doc).
**Contact message:** *Tell us about your product category, quantity, fabric, GSM, colours, sizes, printing, embroidery, labels, packaging and required delivery timeline. Our team will review your inquiry and respond with the next steps.*

---

## 15. Deliverables & handoff (client-facing)

At completion the client receives: full source code + repo access, admin login, hosting + domain + email access, database + files backup, brand token / theme documentation, list of libraries used (all legally licensed), and a short **"how to update your website" video + written guide** (add product, edit copy, read inquiries). Post-launch support window: define in quote (e.g. 30 days bug-fix).

---

## 16. Assumptions & open items (confirm before Phase 1)

1. **Logo vector** — you have the JPEG; request AI/EPS/**SVG** for crisp rendering + favicon/OG generation. Palette in §3 sampled from JPEG; confirm against vector.
2. **Domain + email** — is `mhglobalattire.com` registered? Choose Google Workspace vs Zoho for the three inboxes (separate cost line).
3. **Email transport** — Gmail SMTP (your existing tooling) vs Resend.
4. **Managed Postgres host** — Neon / Supabase / Railway.
5. **Turnstile vs hCaptcha** for spam.
6. **Product photography** — none yet; launch with AI-generated garment images + professional mockups + licensed stock (per client), swap for real production photos later.
7. **Certifications/Sustainability** — no verified certs yet; build the framework, publish claims only when verified.
8. **Ongoing SEO** — confirm launch-SEO (included) vs monthly retainer (separate) with client.

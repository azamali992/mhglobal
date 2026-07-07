# MH Global Attire — Public Pages Design Specification
**Phase 3A · Version 1.0 · 2026-07-05**
**Agent:** ui-designer · Skill: design-taste-frontend
**Status:** Implementation-ready. All values lock to design-system-spec-0A and master plan §3/§10/§14.

---

## Source Documents Referenced

- `docs/MH-Global-Attire-Master-Build-Plan.md` — §3 (color tokens), §4 (routes), §9 (page specs), §10 (motion system), §14 (approved copy)
- `docs/design-system-spec-0A.md` — all component primitives, tokens, WCAG pairs
- `content/seed.ts` — all ContentBlock page/key pairs cited in Section B of each page

## Non-Negotiable Token Constraints (repeat for reference)

Nine locked color tokens. No other hex value may appear anywhere in this document:
- `navy` `#0A2240` · `navy-800` `#0D2A4E` · `crimson` `#941C1D` · `crimson-600` `#B02A28`
- `cream` `#EDE6D6` · `cream-100` `#F5F1E8` · `white` `#FFFFFF` · `ink-muted` `#4A5568` · `line` `#D8CFBC`

## Pre-verified WCAG AA Pairs (from design-system-spec-0A)

| Pair | Ratio | Use in this spec |
|---|---|---|
| White on Navy | 15.9:1 | All text on `dark` SectionWrapper |
| White on Crimson | 8.6:1 | Button labels; text inside crimson CTA panels |
| Ink-muted on Cream | 6.0:1 | Body text on `light` SectionWrapper |
| Navy on Cream-100 | 14.2:1 | Headings and body inside `default` Card variant |
| Ink-muted on White | 7.5:1 | Body text on `white` SectionWrapper |
| White on Crimson-600 | 6.6:1 | Button hover state |
| Ink-muted on Cream-100 | 6.7:1 | Body text inside `default` Card variant |
| Ink-muted on Line | 4.9:1 | `muted` Badge variant |

## Icon Library Decision Item

Pages throughout this spec require decorative icons (core values grid, differentiators, manufacturing stages, OEM services, QA checklist). The approved tech stack in master plan §2 does not name an icon library. **Decision required from orchestrator before Phase 3 build begins:** approve either `lucide-react` or inline SVG authored by the frontend-dev agent. Until confirmed, spec references "icon" as a placeholder. No icon-related npm package is assumed approved.

## Map Embed Note

The Contact page uses a Google Maps iframe embed for the Faisalabad address. This requires no npm package but the CSP `frame-src` directive (managed in `middleware.ts` per §12) must permit `maps.googleapis.com` and `www.google.com`.

---

## 1. Home (`/`)

### A. Layout & Section Breakdown

**Section 1 — Hero**
SectionWrapper variant: `dark`. Additional class on the section element: `min-h-[80vh]` to achieve hero proportions beyond the base `py-section-y`. Layout: full-bleed background effect (Spotlight atmospheric component) behind a centered single-column content group inside the Container. Content group: H1 headline, body-lg subheading, two CTA buttons (primary md + secondary md, dark-host configuration) arranged vertically centered with `gap-6`. The atmospheric Spotlight effect occupies the section background using `z-behind` (-1 z-index) so it never obscures text. Optional enhancement on desktop only (lazy-loaded, degraded on mobile): a React Three Fiber fabric-drape plane with navy/crimson lighting positioned at the right edge of the viewport, partially cropped by the section boundary, adding dimensional depth without blocking the centered content column. Purpose: establishes the brand value proposition immediately for international buyers; primary conversion entry point.

**Section 2 — Trust Strip**
SectionWrapper variant: `white`. Layout: full-viewport-width overflow-hidden strip containing Infinite Moving Cards with no Container width restriction — the cards scroll beyond the 1280px content boundary. The strip height is approximately 80px (single-line card height). Content: five trust-indicator cards scrolling left continuously. Purpose: telegraphs key credentials within the first viewport without requiring scroll; builds immediate buyer confidence.

**Section 3 — Product Categories (Bento Grid)**
SectionWrapper variant: `light`. Layout: section heading + subheading at top; below, a 4-column Bento Grid with two large cells spanning col-span-2 (T-Shirts, Hoodies — orders 0 and 2) and four medium cells spanning col-span-1 (Polo Shirts, Sweatshirts, Joggers, Shorts — orders 1, 3, 4, 5); below the grid, a centered ghost link ("Explore Our Products"). Each cell is a 3D Card with tilt-on-hover. All cells link to their respective `/products/[slug]` route. The grid shows the first six categories by DB `order` field. Purpose: editorial showcase of the primary product range; primary product discovery entry point for buyers.

**Section 4 — Manufacturing Capabilities Teaser**
SectionWrapper variant: `dark`. Layout: Sticky Scroll Reveal — 2-column split inside Container: left column (40% width, `sticky top-[4.5rem]`) holds a fixed label and the manufacturing heading; right column (60% width) scrolls through the nine manufacturing stage cards vertically. Each stage card is a `dark` Card variant with stage name. Below the nine cards, a "From Product Development to Final Packing" CTA link to `/manufacturing`. Purpose: demonstrates operational depth and professional process control to reassure international buyers considering a factory relationship.

**Section 5 — Quality and Why Highlights**
SectionWrapper variant: `white`. Layout: two groups inside the Container in a 2-column arrangement (desktop): left group (50%) shows the QA intro paragraph + two QC point badges; right group (50%) shows three of the ten differentiators as icon + text rows. Below, a hairline divider `border-line`. Purpose: surfaces quality credentials and key differentiators before the final CTA; addresses buyer objections without sending them to separate pages.

**Section 6 — Final CTA Band**
SectionWrapper variant: `dark`. Inside the Container, a full-width inner panel with `bg-crimson rounded-card` contains the CTA content: centered heading (h2), subtext (body), Request a Quote primary button (secondary variant, dark-host configuration: `border-white text-white hover:bg-white hover:text-navy` — white border/text is appropriate on crimson at 8.6:1), and a WhatsApp inline link. The crimson panel occupies the full Container width. Purpose: primary conversion section; drives the buyer to begin the inquiry process.

---

### B. Copy Source References

**Section 1 — Hero**
- H1: ContentBlock `page: "home"`, `key: "hero.heading"` — "Custom Apparel Manufacturing for Global Brands"
- Subheading: ContentBlock `page: "home"`, `key: "hero.subheading"` — "MH Global Attire manufactures customized apparel for brands..."
- Primary CTA label: ContentBlock `page: "home"`, `key: "hero.cta.primary"` — "Request a Quote"
- Secondary CTA label: ContentBlock `page: "home"`, `key: "hero.cta.secondary"` — "Explore Our Products"

**Section 2 — Trust Strip**
Five cards, each sourcing its single-line label from the `why` page differentiators:
- Card 1: ContentBlock `page: "why"`, `key: "differentiator.1"` — "Apparel manufacturing based in Faisalabad, Pakistan"
- Card 2: ContentBlock `page: "why"`, `key: "differentiator.2"` — "Customized garment manufacturing"
- Card 3: ContentBlock `page: "why"`, `key: "differentiator.3"` — "Private-label and OEM services"
- Card 4: ContentBlock `page: "why"`, `key: "differentiator.8"` — "Quality monitoring throughout production"
- Card 5: ContentBlock `page: "why"`, `key: "differentiator.10"` — "Long-term partnership approach"

**Section 3 — Product Categories**
- Section heading: §14 · "Products: T-shirts, Polo shirts, Hoodies..." (use "Our Products" or the route label from §4 "Products" as section label — no marketing heading is specified in §14 for this teaser block; developer uses the route label only)
- Each card name and GSM range badge: pulled live from the Category DB record (`name`, `gsmRange`) seeded in `content/seed.ts` `seedCategories()` block
- "Explore Our Products" ghost link text: ContentBlock `page: "home"`, `key: "hero.cta.secondary"`

**Section 4 — Manufacturing Capabilities Teaser**
- Fixed left heading: ContentBlock `page: "manufacturing"`, `key: "hero.heading"` — "From Product Development to Final Packing"
- Introductory sentence on the left panel: ContentBlock `page: "manufacturing"`, `key: "manufacturing.intro"` — "Our manufacturing process is managed through defined production stages..."
- Stage 1–9 labels: ContentBlocks `page: "manufacturing"`, `key: "stage.1"` through `key: "stage.9"`
- Link to `/manufacturing` text: ContentBlock `page: "manufacturing"`, `key: "hero.heading"` (reuse as link label)

**Section 5 — Quality and Why Highlights**
- QA intro text (left group): ContentBlock `page: "quality"`, `key: "quality.intro"` — "At MH Global Attire, quality control begins before production..."
- QC point badges shown (two of twelve): ContentBlocks `page: "quality"`, `key: "qc.point.1"` and `key: "qc.point.12"` (first and last; bookends the process visually)
- Differentiator row 1 (right group): ContentBlock `page: "why"`, `key: "differentiator.4"` — "Flexible product-development support"
- Differentiator row 2: ContentBlock `page: "why"`, `key: "differentiator.6"` — "Buyer-specific fabric, GSM, sizing and colour options"
- Differentiator row 3: ContentBlock `page: "why"`, `key: "differentiator.9"` — "Professional and responsive communication"

**Section 6 — Final CTA Band**
- Heading inside crimson panel: ContentBlock `page: "home"`, `key: "hero.heading"` — reused as the CTA banner headline (the buyer's goal mirrors the company's offer)
- Body text inside crimson panel: ContentBlock `page: "home"`, `key: "hero.subheading"` — truncated to first sentence in implementation (developer uses the full ContentBlock value; display is truncated by CSS line-clamp if needed)
- Primary button label: ContentBlock `page: "home"`, `key: "hero.cta.primary"` — "Request a Quote"
- WhatsApp link text: §14 · "WhatsApp: floating button + inline CTA → wa.me/923213995224" — display text is "Chat on WhatsApp"; phone number from SiteSettings `key: "whatsapp"`

---

### C. Imagery Direction

**Section 1 — Hero background (Spotlight host surface)**
No background image required for the primary Spotlight implementation — the `dark` SectionWrapper's navy (`#0A2240`) surface IS the backdrop. The Spotlight radial gradient uses white at 12% opacity as the light color, tracking mouse position. If an optional background image layer is added in Phase 5 (as a CSS `background-image` behind the Spotlight overlay), the required asset is: editorial aerial or ground-level view of Faisalabad's textile district or a premium organized production floor — wide landscape 16:9, cool-warm tonal balance compatible with navy overlay. Cloudinary transform: `f_auto,q_auto,c_fill,g_center,ar_16:9,w_1920`. Apply navy overlay at 75% opacity (`bg-navy/75`) as a CSS layer above the image and below the Spotlight canvas. **This asset does not exist in `/public/images/`; flag for stock or AI-generated procurement before Phase 5.**

**Optional R3F hero element (desktop-only enhancement)**
No image asset needed. The fabric-drape plane is a procedural Three.js geometry with `MeshStandardMaterial` tinted with navy (`#0A2240`) diffuse and crimson (`#941C1D`) accent light. No external texture required. Dynamic-imported at lg breakpoint; degraded to static dark navy background on mobile and tablet.

**Section 3 — Bento Grid category cards**
Each cell uses the existing category image from `/public/images/categories/`:
- T-Shirts cell (large): `/public/images/categories/t-shirts.jpg` — crop 16:9, focal point: garment center. Cloudinary: `f_auto,q_auto,c_fill,g_center,ar_16:9,w_800`. Overlay: `bg-navy/50` gradient from transparent (top) to navy at 70% (bottom) for text legibility.
- Polo Shirts cell (medium): `/public/images/categories/polo-shirts.jpg` — crop 4:3, focal point: center. Cloudinary: `f_auto,q_auto,c_fill,g_center,ar_4:3,w_600`. Same overlay.
- Hoodies cell (large): `/public/images/categories/hoodies.jpg` — crop 16:9. Cloudinary: `f_auto,q_auto,c_fill,g_center,ar_16:9,w_800`. Same overlay.
- Sweatshirts cell: `/public/images/categories/sweatshirts.jpg` — crop 4:3. Cloudinary: `f_auto,q_auto,c_fill,g_center,ar_4:3,w_600`. Same overlay.
- Joggers cell: `/public/images/categories/joggers.jpg` — crop 4:3. Same transforms.
- Shorts cell: `/public/images/categories/shorts.jpg` — crop 4:3. Same transforms.

Card text (category name + GSM badge) renders above the overlay in `text-white` for 15.9:1 contrast on the navy overlay layer.

**Section 4 — Manufacturing Capabilities Teaser**
No image in the primary Sticky Scroll Reveal layout. If a supporting accent image is desired at the bottom of the left sticky panel, use `/public/images/site/manufacturing.jpg` — crop to square 1:1, focal point: center. Cloudinary: `f_auto,q_auto,c_fill,g_center,ar_1:1,w_400,r_12`. Image sits below the stage label text on the left panel with `rounded-card` applied.

**Section 5 — Quality and Why Highlights**
No images. Icon placeholder required per the Icon Library Decision Item noted above.

**Section 6 — Final CTA Band**
No images. Typography-and-color treatment only.

---

### D. Motion & Component Assignments

**Section 1 — Hero: Text Generate Effect + Spotlight**

*Text Generate Effect (heading):*
- Component: Text Generate Effect (Aceternity-inspired, custom rebuild per §10)
- Trigger: on-load (no scroll needed; hero is above the fold)
- Behavior: H1 characters animate in sequentially, each fading from opacity 0 to 1 with a 4px upward Y translate. Character delay: 18ms per character. Spring: `type: "spring"`, stiffness 40, damping 12. Total reveal duration for a 43-character heading ≈ 0.77s.
- Reduced-motion fallback: instant render of full H1 text with no transform; opacity set to 1 immediately
- Rationale: The Text Generate Effect on the hero headline creates a sense of the brand "writing itself" into existence — appropriate for a manufacturer whose identity is built from production craft. The slow spring matches the measured, confident pace of the brand voice.

*Spotlight:*
- Component: Spotlight (Aceternity-inspired, custom rebuild per §10)
- Trigger: on-load; follows mouse/pointer movement continuously thereafter
- Behavior: Radial gradient canvas (or SVG filter) positioned at pointer coordinates. Gradient: white at 12% opacity at center, transparent at edge, radius 400px. Updates on `mousemove` via `requestAnimationFrame`. On touch devices: statically positioned at top-center of the section.
- Reduced-motion fallback: static radial gradient at top-center, no movement
- Rationale: The Spotlight creates the sense that the buyer's attention is literally illuminating the brand headline — a premium interactive quality that signals a sophisticated digital presence expected by international B2B buyers.

*Optional R3F hero element (desktop lg+ only, dynamic import):*
- Component: React Three Fiber canvas with a fabric-drape plane mesh
- Trigger: on-load, lazy-loaded via `next/dynamic` with `{ ssr: false }`
- Behavior: Slow sine-wave vertex displacement on the plane geometry (amplitude 0.1, frequency 0.5Hz), rotation 0.001 radians/frame on Y axis. DPR capped at 2. Canvas paused when `IntersectionObserver` reports the section is off-screen.
- Reduced-motion fallback: R3F canvas not mounted; static navy background only
- Rationale: A subtle 3D element at the hero edge adds dimensional luxury that static layouts cannot provide, reinforcing the "premium agency" aesthetic referenced in the client brief. Used once (§10 rule: "used once or twice").

*Subheading and CTAs — Framer Motion whileInView:*
- Trigger: on-load with 200ms delay after Text Generate Effect begins
- Behavior: Staggered fade-up. Each element (subheading, primary CTA, secondary CTA) enters with Y offset 24px → 0, opacity 0 → 1. Delay between elements: 0.12s. Spring: `type: "spring"`, stiffness 80, damping 20.
- Reduced-motion fallback: instant render, no transform

**Section 2 — Trust Strip: Infinite Moving Cards**
- Component: Infinite Moving Cards (Aceternity-inspired, custom rebuild)
- Trigger: on-load (begins scrolling as soon as the section enters the DOM)
- Behavior: CSS `animation: scroll 50s linear infinite`. Cards arranged in a duplicated row (original + clone) to create seamless loop. Scrolls left. Animation pauses on `hover` via `animation-play-state: paused`. Card content: single-line text with a small left-border accent in crimson (`border-l-2 border-crimson`). Card surface: `bg-cream-100 rounded-card shadow-card px-6 py-4`.
- Reduced-motion fallback: CSS animation disabled; cards render as a static horizontal row with `overflow-x-auto` for mobile scroll; `prefers-reduced-motion: reduce` media query sets `animation: none`
- Rationale: Infinite Moving Cards create perpetual motion that keeps the trust strip alive without demanding user interaction, reinforcing the sense of a constantly active manufacturing operation.

**Section 3 — Bento Grid: 3D Card Tilt**
- Component: 3D Card Effect (Aceternity-inspired, tilt-on-hover with perspective)
- Trigger: mouse enter/leave on each card
- Behavior: Parent wrapper has `perspective: 1000px`. On `mouseenter`, card element receives `rotateX` and `rotateY` values calculated from pointer offset within the card boundary, capped at ±8 degrees. Spring: `type: "spring"`, stiffness 200, damping 30. On `mouseleave`, card returns to `rotateX(0) rotateY(0)` with same spring. An inner highlight layer (white radial gradient at 8% opacity) tracks the pointer, creating a specular highlight effect.

*Bento Grid scroll-entry reveal:*
- Trigger: scroll into view at `amount: 0.2` (20% visible)
- Behavior: Grid cells animate in with staggered fade-up. Y offset 40px → 0, opacity 0 → 1. Delay: 0.08s per cell in reading order. Spring: `type: "spring"`, stiffness 80, damping 22.
- Reduced-motion fallback: all cards render instantly at final position; no tilt; no stagger
- Rationale: 3D card tilt makes the product category grid feel interactive and editorial — communicating that each category is a distinct manufacturing capability worth exploring, not a flat product listing.

**Section 4 — Manufacturing Teaser: Sticky Scroll Reveal**
- Component: Sticky Scroll Reveal (Aceternity-inspired, custom rebuild)
- Trigger: scroll-position driven; the right column content changes as the user scrolls through the section
- Behavior: Right column tracks `scrollYProgress` within the section's scroll range using Framer Motion `useScroll` with `target` ref. Each of the nine stage cards has an associated progress threshold. As the user scrolls, the active card transitions in with Y offset 20px → 0, opacity 0 → 1 (spring: stiffness 60, damping 18) and the exiting card transitions out with Y offset 0 → -20px, opacity 1 → 0. Left column sticky panel remains fixed with `position: sticky; top: 4.5rem` (accounts for nav height).
- Reduced-motion fallback: sticky behavior disabled; all nine stage cards rendered as a simple vertical list with `border-b border-line` dividers
- Rationale: Sticky Scroll Reveal turns the manufacturing process into a guided narrative journey, giving international buyers a structured walkthrough of the factory's capabilities without overwhelming them with information all at once.

**Section 5 — Quality and Why Highlights: Staggered Fade-Up**
- Component: Framer Motion `whileInView` staggered children
- Trigger: scroll into view at `amount: 0.25`
- Behavior: Each highlight row (left and right groups) enters with Y offset 32px → 0, opacity 0 → 1. Stagger delay: 0.1s per item. Spring: `type: "spring"`, stiffness 90, damping 22.
- Reduced-motion fallback: instant render, no transform
- Rationale: Gentle reveal on credential elements ensures buyers who scroll quickly still register each proof point individually rather than seeing them appear all at once.

**Section 6 — CTA Band: Moving Border**
- Component: Moving Border (Aceternity-inspired, on the primary CTA button only)
- Trigger: on-load after the section enters view at `amount: 0.5`
- Behavior: A gradient line (white → cream → white) travels around the perimeter of the secondary CTA button using a CSS `@keyframes` or SVG `stroke-dashoffset` animation at 3s duration, `linear infinite`. Applied only to the "Request a Quote" button. The `primary` Button variant's crimson fill is not altered — the Moving Border is an additive outer-ring effect on the secondary (white-border) button.
- Reduced-motion fallback: Moving Border animation stopped; button renders in static state
- Rationale: Moving Border on the CTA draws the eye to the conversion action with premium kinetic energy — signaling urgency without disrupting the calm editorial tone of the surrounding section.

---

### E. Responsive Behavior

**Mobile (below md: 768px) — `px-container-x` (1.5rem/24px gutters)**
- Section 1 Hero: Content column is full-width; CTA buttons stack vertically with `gap-4`; R3F canvas not mounted; Spotlight uses static centered position; `min-h-[60vh]` (reduced from 80vh)
- Section 2 Trust Strip: Infinite Moving Cards continues scrolling; card text font-size remains at body (1rem); strip height auto
- Section 3 Bento Grid: collapses to single-column stack (`grid-cols-1`); all 6 cards render as equal-height rectangles; 3D tilt disabled (touch devices cannot tilt)
- Section 4 Manufacturing Teaser: Sticky Scroll Reveal collapses to a vertical accordion list; left sticky column becomes a standard heading block above the list; no sticky behavior
- Section 5 Quality/Why Highlights: 2 groups stack vertically (`flex-col`); full width each
- Section 6 CTA Band: crimson inner panel full-width; buttons stack vertically

**Tablet (md–lg: 768px–1023px) — `md:px-8` (2rem/32px gutters)**
- Section 1 Hero: Content column centered, max-w-2xl; CTA buttons in a row (`flex-row`); R3F canvas not mounted
- Section 2 Trust Strip: unchanged
- Section 3 Bento Grid: 2-column grid (`grid-cols-2`); large cells remain col-span-2 (full width); medium cells each take one column; 3D tilt enabled at md+
- Section 4 Manufacturing Teaser: Sticky behavior restored with 2-col split; left panel at 40% of container width
- Section 5: 2 groups side by side as on desktop
- Section 6: Buttons in a row

**Desktop (lg+: 1024px+) — `lg:px-12` (3rem/48px gutters)**
- Section 3 Bento Grid: 4-column grid at full 1280px container width. Large cells (T-Shirts, Hoodies) span `col-span-2`. Four medium cells span `col-span-1`. Row heights: large cells 360px; medium cells 260px.
- Section 4: Full Sticky Scroll Reveal with 2-col split active. Left panel `sticky top-[4.5rem]` with `h-[calc(100vh-4.5rem)]` for alignment.
- Section 5: 2-col grid at `grid-cols-2 gap-16`.
- R3F fabric-drape canvas mounts at lg+ only via `dynamic import` with `ssr: false`.

---

### F. Accessibility Notes

**Contrast pairs by surface:**
- Section 1 Hero: All text is white on navy (15.9:1). CTA primary button: white on crimson (8.6:1). CTA secondary button (dark-host): white on navy/transparent (15.9:1). Both PASS AA at all text sizes.
- Section 2 Trust Strip: Card text is ink-muted on cream-100 (6.7:1). PASS.
- Section 3 Bento Grid: Card text is white on navy overlay (15.9:1). GSM badge (navy variant): white on navy (15.9:1). PASS.
- Section 4 Manufacturing Teaser: All text white on navy (15.9:1). Stage name text in dark Card variant: white (15.9:1). PASS.
- Section 5 Quality/Why Highlights: Body text is ink-muted on white (7.5:1). PASS.
- Section 6 CTA Band: Text inside crimson panel is white on crimson (8.6:1). Secondary button: white on crimson background (8.6:1). PASS.

**Focus states:**
- All Button components: `focus-visible:ring-2 focus-visible:ring-offset-2` per design-system-spec-0A §3.1. Primary button ring: `ring-crimson`. Secondary dark-host button ring: `ring-white`. Ghost button ring: `ring-crimson`.
- Bento Grid cards (if wrapped in `<a>`): `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 rounded-card`.
- Trust strip cards (non-interactive): no focus state required; they are `<div>` elements inside a scrolling container.
- WhatsApp inline link: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-btn`.

**ARIA and landmarks:**
- Section 1: `<section aria-labelledby="home-hero-heading">`. H1 carries `id="home-hero-heading"`. Spotlight canvas: `aria-hidden="true"`. R3F canvas: `aria-hidden="true"`.
- Section 2: `<section aria-label="Company credentials">`. The scrolling card container: `aria-live="off"` (live region not needed; content is decorative marquee). Add `role="marquee"` or `aria-label="Scrolling trust indicators"` on the outer strip.
- Section 3: `<section aria-labelledby="home-categories-heading">`. Each card `<a>` receives `aria-label="[Category Name] — view category"`. The 3D tilt wrapper is a `<div>` containing the `<a>`; tilt is a visual enhancement only and requires no ARIA annotation.
- Section 4: `<section aria-labelledby="home-manufacturing-heading">`. Sticky left panel heading carries the `id`. Stage cards within the scroll column: each card has `role="article"` and `aria-label="Stage [N]: [stage name]"`.
- Section 5: `<section aria-labelledby="home-highlights-heading">`. Section heading is visually hidden if no explicit heading is shown — add an `<h2 class="sr-only">Quality and Why Choose Us</h2>` for screen reader landmark navigation.
- Section 6: `<section aria-labelledby="home-cta-heading">`. WhatsApp link: `aria-label="Chat with MH Global Attire on WhatsApp"`.

---

## 2. About Us (`/about`)

### A. Layout & Section Breakdown

**Section 1 — Page Hero**
SectionWrapper variant: `dark`. Additional class: `min-h-[50vh]`. Layout: centered single column within Container; H1 heading + body-lg intro paragraph below it; no CTAs in the hero. Background: Background Beams atmospheric effect (Aceternity-inspired, distinct from the home Spotlight). Purpose: establishes company identity and sets the tone for the detailed company narrative that follows.

**Section 2 — Company Introduction and History**
SectionWrapper variant: `light`. Layout: 2-column grid at desktop (`grid-cols-[3fr_2fr] gap-16`): left column holds the about intro paragraph + the multi-paragraph company history text; right column holds an editorial image. Below the history text on mobile, the image moves to full width. Purpose: provides the company background and Faisalabad textile-industry context that builds buyer confidence in the manufacturer's credentials.

**Section 3 — Mission and Vision**
SectionWrapper variant: `white`. Layout: 2-column grid (`grid-cols-1 md:grid-cols-2 gap-8`); each column contains one `default` Card variant — left card: Mission heading (h3) + mission text; right card: Vision heading (h3) + vision text. Purpose: articulates the company's objectives in buyer-relevant language, positioning MH Global Attire as a goals-oriented partner.

**Section 4 — Core Values**
SectionWrapper variant: `light`. Layout: section heading (h2) + 3-column grid at desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`) of six `default` Card variant cards; each card: icon placeholder (top), value name as h4, value description as body text. Purpose: establishes professional standards and buyer expectations across the six named values.

**Section 5 — Company Timeline**
SectionWrapper variant: `dark`. Layout: centered section heading (h2) above a horizontal timeline strip at desktop; on mobile, the timeline becomes a vertical list. Timeline has three milestones: founding (2022), manufacturing operations established, present growth objective. Each milestone: year label (h4, white) + description (body, white/70). Connected by a horizontal line (`border-t border-cream-100/30`) between milestone markers (circular dots in crimson, 12px diameter). Purpose: narrative arc demonstrating the company's deliberate, progressive development — reassures buyers that the business is established and growing.

**Section 6 — CTA Band**
SectionWrapper variant: `dark`. Full-width crimson inner panel (same pattern as Home Section 6). Content: h2 heading + Request a Quote secondary dark-host button + WhatsApp link. Purpose: converts readers who have engaged with the company story into inquirers.

---

### B. Copy Source References

**Section 1 — Hero**
- H1: ContentBlock `page: "about"`, `key: "hero.heading"` — "Manufacturing Apparel with Quality, Flexibility..."
- Intro paragraph: ContentBlock `page: "about"`, `key: "about.intro"` — "MH Global Attire Ltd. is an apparel manufacturing..."

**Section 2 — Company Introduction and History**
- Multi-paragraph history text (all four paragraphs): ContentBlock `page: "about"`, `key: "about.history"` — "MH Global Attire Ltd. is a professional apparel manufacturing..." (the ContentBlock value uses `\n\n` separators between paragraphs; developer splits on `\n\n` and renders each as a `<p>` element)

**Section 3 — Mission and Vision**
- Mission card heading: §14 · "Mission" (implied section label — use h3 text "Our Mission" sourced from §14 label "mission")
- Mission text: ContentBlock `page: "about"`, `key: "about.mission"` — "To manufacture high-quality customized apparel..."
- Vision card heading: h3 "Our Vision" — §14 label "vision"
- Vision text: ContentBlock `page: "about"`, `key: "about.vision"` — "To develop MH Global Attire into a trusted..."

Note on section labels: §14 lists "mission" and "vision" as section identifiers. The h3 labels "Our Mission" / "Our Vision" are functional labels derived from these identifiers; they do not require ContentBlock backing as they are structural card headings. Developer confirms with orchestrator if these labels require CMS editing capability; if so, add ContentBlock records.

**Section 4 — Core Values**
- Section heading: §14 · "About H1..." (no explicit "Core Values" heading is in §14 or seed.ts — use h2 "Our Core Values" as a structural label consistent with the six values listed. Flag to orchestrator if CMS-editable heading is required.)
- Value: Quality — name from §14 key label; description: ContentBlock `page: "about"`, `key: "values.quality"` — "We focus on fabric quality, accurate measurements..."
- Value: Reliability — ContentBlock `page: "about"`, `key: "values.reliability"` — "We aim to meet agreed product requirements..."
- Value: Transparency — ContentBlock `page: "about"`, `key: "values.transparency"` — "We communicate honestly regarding specifications..."
- Value: Customization — ContentBlock `page: "about"`, `key: "values.customization"` — "We support buyer-specific designs, materials..."
- Value: Partnership — ContentBlock `page: "about"`, `key: "values.partnership"` — "We focus on developing long-term relationships..."
- Value: Continuous Improvement — ContentBlock `page: "about"`, `key: "values.continuous-improvement"` — "We continue improving our manufacturing systems..."

**Section 5 — Company Timeline**
- Timeline founding year: SiteSettings `key: "founded"` → "2022"
- Timeline milestone text: derived from ContentBlock `page: "about"`, `key: "about.history"` — developer extracts the founding objective sentence: "Established in 2022, the company was founded with the objective of providing international brands..." as milestone 1 label
- Timeline milestone 2 (manufacturing setup): derived from `about.history` — "Our manufacturing operations are supported by experienced production professionals..."
- Timeline milestone 3 (current goal): ContentBlock `page: "about"`, `key: "about.vision"` — "To develop MH Global Attire into a trusted international apparel..."

**Section 6 — CTA Band**
- Same sources as Home Section 6: ContentBlock `page: "home"`, `key: "hero.cta.primary"`, SiteSettings `key: "whatsapp"`

---

### C. Imagery Direction

**Section 1 — Hero background (Background Beams)**
No background image required. The `dark` (navy) SectionWrapper hosts the Background Beams SVG animation. Beam colors: two SVG path strokes — one in cream (`#EDE6D6`) at 6% opacity, one in crimson (`#941C1D`) at 4% opacity — animated along slow sine paths.

**Section 2 — History image (right column)**
Preferred existing asset: `/public/images/site/manufacturing.jpg`. Art direction: portrait crop (3:4 ratio), focal point centered. Cloudinary transform: `f_auto,q_auto,c_fill,g_center,ar_3:4,w_600`. Apply `rounded-card` and `shadow-card` to the `<img>` wrapper. No color overlay needed (image displays in natural color on the cream section).

If a more contextually appropriate image is desired (company exterior, team, Faisalabad context): **flag as additional asset needed** — subject: organized factory floor or exterior of Faisalabad textile facility, mood: warm professional, natural daylight, clean and ordered. Composition: portrait or square. Cloudinary: same transforms.

**Section 3 — Mission/Vision Cards**
No images. Typography and color surface only.

**Section 4 — Core Values Cards**
Icon placeholder per the Icon Library Decision Item. Each icon should be a 32×32px SVG in `text-crimson` color (the icon inherits `currentColor`). Icon subjects per value: Quality → checkmark/shield; Reliability → clock/calendar; Transparency → open-eye/layers; Customization → settings-sliders; Partnership → handshake; Continuous Improvement → arrow-loop/refresh. Final icon selection deferred to frontend-dev pending icon library approval.

**Section 5 — Timeline**
No images. Color tokens and typography only. Milestone markers: 12px circular `div` with `bg-crimson rounded-full`.

**Section 6 — CTA Band**
No images.

---

### D. Motion & Component Assignments

**Section 1 — Hero: Background Beams**
- Component: Background Beams (Aceternity-inspired, custom rebuild)
- Trigger: on-load
- Behavior: Three SVG `<path>` elements with `stroke-dasharray` and `stroke-dashoffset` animations, each on a slow independent sine trajectory. Path 1: cream at 6% opacity, 8s duration. Path 2: crimson at 4% opacity, 12s duration. Path 3: cream at 3% opacity, 16s duration. All animations `linear infinite`. Beams positioned in the background behind content (z-index: `z-behind`).
- Reduced-motion fallback: SVG renders static paths, no animation
- Rationale: Background Beams on the About hero create ambient warmth and movement that differs from the Spotlight on Home — communicating a different "chapter" of the brand story, more reflective and narrative in character.

**Section 1 — Hero text reveal:**
- Framer Motion staggered fade-up: H1 (Y 32px → 0, opacity 0 → 1, spring stiffness 60, damping 18), then intro paragraph (Y 24px → 0, 0.2s delay). Trigger: on-load.
- Reduced-motion fallback: instant render

**Section 2 — History: Scroll-triggered fade-in**
- Framer Motion `whileInView`, trigger at `amount: 0.2`
- Left column: Y 40px → 0, opacity 0 → 1, spring stiffness 80, damping 20
- Right image: X 40px → 0, opacity 0 → 1 (slides in from right), spring stiffness 80, damping 20, 0.15s delay after left column
- Reduced-motion fallback: instant render

**Section 4 — Core Values: Staggered Card Reveal**
- Framer Motion `whileInView`, trigger at `amount: 0.15`
- Each card: Y 32px → 0, opacity 0 → 1, stagger delay 0.08s per card. Spring stiffness 90, damping 22.
- Reduced-motion fallback: instant render

**Section 5 — Timeline: Scroll-triggered milestone reveal**
- Framer Motion `whileInView` on each milestone marker
- Milestone dot: scale 0 → 1, spring stiffness 200, damping 25
- Milestone text: opacity 0 → 1, Y 16px → 0, spring stiffness 80, damping 20. Stagger: 0.2s between milestones.
- Connecting line: `scaleX` 0 → 1 on the horizontal connector, `transformOrigin: "left"`, spring stiffness 40, damping 20
- Reduced-motion fallback: all elements render at final state instantly

---

### E. Responsive Behavior

**Mobile (below md: 768px)**
- Section 1 Hero: `min-h-[40vh]`; H1 at `text-h2` scale (responsive step down — the developer applies `text-h2 md:text-h1` to keep the heading legible at mobile widths without overflow); Body-lg paragraph at full width.
- Section 2: Single column stack; image moves below history text; image changes to 16:9 landscape crop (`ar_16:9`).
- Section 3: Cards stack vertically; full width each.
- Section 4: Core value cards in single column; icon above heading.
- Section 5: Timeline becomes a vertical list; milestone markers become left-aligned dots with connecting vertical line (`border-l-2 border-crimson/30`); horizontal line hidden.
- Section 6: Same as Home CTA Band mobile.

**Tablet (md–lg: 768px–1023px)**
- Section 2: 2-column grid activates; image shows at portrait 3:4.
- Section 3: 2-column grid for mission/vision cards.
- Section 4: 2-column grid (3 columns only at lg+).
- Section 5: Horizontal timeline activates at md; milestone labels wrap below the dots.

**Desktop (lg+: 1024px+)**
- Section 2: 3fr/2fr column split at full 1280px container.
- Section 4: 3-column grid; all six values in two rows of three.
- Section 5: Full horizontal timeline with connector line.

---

### F. Accessibility Notes

**Contrast pairs:**
- Section 1: White on navy (15.9:1) for all heading and body text. PASS.
- Section 2: Ink-muted on cream (6.0:1) for body/history text. Heading color (navy) on cream — ratio exceeds 14.2:1 (navy on cream-100 benchmark; cream itself is darker so ratio is higher). PASS.
- Section 3: Inside default Card (cream-100 surface): ink-muted on cream-100 (6.7:1) for body; navy on cream-100 (14.2:1) for headings. PASS.
- Section 4: Same as Section 3 for card content. PASS.
- Section 5: White on navy (15.9:1); white/70 on navy — white at 70% opacity resolves to approximately #B3B3B3 on navy; computed ratio ~5.4:1. PASS for normal text.
- Section 6: White on crimson (8.6:1). PASS.

**Focus states:**
- Section 6 CTA buttons: same as Home Section 6.
- If Timeline milestone markers are interactive links: `focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 rounded-full`.

**ARIA and landmarks:**
- Section 1: `<section aria-labelledby="about-hero-heading">`. Background Beams SVG: `aria-hidden="true"`.
- Section 2: `<section aria-labelledby="about-history-heading">`. Add visually hidden h2 "Company History" if no visible heading is above the history text columns.
- Section 3: `<section aria-labelledby="about-values-heading">` where the heading is "Mission and Vision". Both cards use `<article>` element.
- Section 4: `<section aria-labelledby="about-core-values-heading">`. Icon SVGs carry `aria-hidden="true"`. Card elements use `<article>`.
- Section 5: `<section aria-labelledby="about-timeline-heading">`. Timeline container: `role="list"`. Each milestone: `role="listitem"`. Milestone year label: within `<time datetime="2022">` for semantic date markup.
- Section 6: Same as Home Section 6.

---

## 3. Products — Category Grid and Category Detail (`/products` and `/products/[slug]`)

### A. Layout & Section Breakdown

**3.1 — Category Grid (`/products`)**

**Section 1 — Page Header**
SectionWrapper variant: `dark`. `min-h-[30vh]`. Layout: centered single column — H1 + body-lg descriptor below. Purpose: orients buyers arriving on the products listing page.

**Section 2 — Category Grid**
SectionWrapper variant: `light`. Layout: section contains a 3-column grid at desktop (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`) of ten category cards using the Card Hover Effect component. Each card: category image at top (16:9 crop, full card width, `rounded-t-card`), then below the image: GSM badge (navy variant), category name as h3, category description as body text, "View Category" link (ghost Button sm). Cards link to `/products/[slug]`. Purpose: primary product browsing surface for buyers; all ten categories visible and equally weighted.

---

**3.2 — Category Detail (`/products/[slug]`)**

**Section 1 — Category Hero**
SectionWrapper variant: `dark`. `min-h-[45vh]`. Layout: full-bleed section with the category `heroImage` as a CSS `background-image` behind a navy overlay at 65% opacity. Inside Container: GSM badge (muted variant) as an eyebrow label, H1 as the category name (pulled from DB), category description as body-lg paragraph below. Purpose: immerses the buyer in the specific product category; sets the context for the specs below.

**Section 2 — Product Specifications**
SectionWrapper variant: `white`. Layout: 2-column grid (`grid-cols-1 md:grid-cols-2 gap-12`). Left column: "Fabric Options" heading (h3) + unordered list of fabric options; "GSM Range" heading (h4) + value; "Available Sizes" heading (h4) + value. Right column: "Customization Options" heading (h3) + unordered list of customization options. Data pulled live from the Product DB record for this category. Purpose: provides the technical specification that buyers need to evaluate suitability.

**Section 3 — Products in This Category**
SectionWrapper variant: `light`. Layout: 2-column grid (`grid-cols-1 md:grid-cols-2 gap-8`) of product cards (default Card variant) pulled from DB `products` where `categoryId` matches and `published: true`. Each card: product name (h4), short description (body), fabric options as muted badges, "Request a Quote" primary button sm. Purpose: shows individual products within the category for buyers who want product-level detail.

**Section 4 — MOQ and Inquiry CTA**
SectionWrapper variant: `dark`. Layout: centered single column, narrow (`max-w-2xl`). MOQ note paragraph (body-lg, white). Request a Quote primary button (md) centered below. WhatsApp inline link. Purpose: converts category-browsing buyers into inquirers; addresses the MOQ question proactively.

---

### B. Copy Source References

**3.1 — Category Grid**

**Section 1 — Page Header**
- H1: §4 route label "Products" — use h1 text "Our Products" (structural label from the route; no marketing heading is specified in §14 or seed.ts for this page header — developer confirms with orchestrator whether a ContentBlock should be added)
- Body descriptor: §14 · "Products: T-shirts, Polo shirts, Hoodies, Sweatshirts..." (use as a brief intro describing the range — developer uses the category names from DB, not a ContentBlock; the descriptive body line about the product range is not a separate ContentBlock in seed.ts. Flag to orchestrator.)

**Section 2 — Category Grid**
- Each card name: `Category.name` from DB (seeded in `seedCategories()` in `content/seed.ts`)
- Each card GSM badge: `Category.gsmRange` from DB
- Each card description: `Category.description` from DB
- "View Category" link text: §14 · route label (functional label; no ContentBlock)

**3.2 — Category Detail**

**Section 1 — Category Hero**
- GSM badge text: `Category.gsmRange` from DB
- H1: `Category.name` from DB
- Body descriptor: `Category.description` from DB

**Section 2 — Product Specifications**
- Fabric options list: `Product.fabricOptions` array from DB
- GSM range: `Product.gsmRange` from DB
- Sizes: `Product.sizes` from DB (`"XS–5XL"` — seeded in `seedProducts()`)
- Customization options: `Product.customization` array from DB

**Section 3 — Products in This Category**
- Product name: `Product.name` from DB
- Description: `Product.description` from DB (includes MOQ note embedded at end)
- Fabric option badges: `Product.fabricOptions` array from DB

**Section 4 — MOQ and CTA**
- MOQ paragraph: §14 · "Please contact us with your product and quantity requirements to receive a suitable MOQ and quotation." — also embedded in `Product.description` via the `MOQ_NOTE` constant in `content/seed.ts`
- "Request a Quote" button label: ContentBlock `page: "home"`, `key: "hero.cta.primary"`
- WhatsApp: SiteSettings `key: "whatsapp"`

---

### C. Imagery Direction

**3.1 — Category Grid**
Each card image uses the existing `/public/images/categories/[slug].jpg` file matching the category slug. All ten files exist in `/public/images/categories/`. Art direction for grid cards: 16:9 landscape crop, focal point at center of the primary garment subject. Cloudinary transform: `f_auto,q_auto,c_fill,g_center,ar_16:9,w_600`. Image renders as the card's top image block with `rounded-t-card overflow-hidden`. No overlay on the grid card image — the image is decorative context; text appears below the image on a cream-100 card surface.

**3.2 — Category Detail Section 1 — Hero**
Uses `Category.heroImage` from DB (which is the same `/public/images/categories/[slug].jpg` path). For the hero treatment, apply a wider crop: 21:9 for cinematic feel. Cloudinary transform: `f_auto,q_auto,c_fill,g_center,ar_21:9,w_1920`. Apply CSS overlay `bg-navy/65` as an absolute-positioned layer above the image. Text renders above the overlay.

Additional imagery flag for Product Detail: currently each product has only the category heroImage as its product image. Individual product photography does not exist. As noted in `content/seed.ts` comments: "Temporary placeholder — replace with real product photography in Phase 3." Flag to client/orchestrator: real garment photography or high-quality AI-generated product mockups are required per §16 item 6 of the master plan before final launch. Until then, the category heroImage serves as placeholder.

---

### D. Motion & Component Assignments

**3.1 Category Grid — Card Hover Effect**
- Component: Card Hover Effect (Aceternity-inspired, custom rebuild)
- Trigger: mouse enter/leave on each category card
- Behavior: On `mouseenter`, the card's image block scales from `scale(1)` to `scale(1.04)` with `overflow-hidden` containing the scale; a crimson accent gradient appears at the card's bottom edge (gradient from transparent to `crimson` at 8% opacity). On `mouseleave`, reverses. Spring: `type: "spring"`, stiffness 160, damping 28. The "View Category" ghost button transitions from `text-crimson opacity-0` to `opacity-100` on hover.
- Grid scroll reveal: `whileInView`, trigger at `amount: 0.1`, stagger 0.06s per card, Y 24px → 0, opacity 0 → 1, spring stiffness 80, damping 22.
- Reduced-motion fallback: no scale, no opacity transition on hover; cards render in final state; ghost button always visible
- Rationale: Card Hover Effect creates a premium gallery-browsing experience that communicates product richness — buyers feel they are "discovering" categories rather than reading a flat list.

**3.2 Category Detail — Scroll-triggered spec reveal**
- Sections 2 and 3: `whileInView` staggered fade-up. List items in spec columns stagger at 0.05s per item. Spring stiffness 90, damping 22. Trigger at `amount: 0.2`.
- Section 4 MOQ: `whileInView` fade-in at `amount: 0.5`, opacity 0 → 1, Y 20px → 0, spring stiffness 80, damping 20.
- Reduced-motion fallback: instant render for all

---

### E. Responsive Behavior

**3.1 Category Grid:**
- Mobile: `grid-cols-1` — single column, cards full width
- Tablet (md): `grid-cols-2` — two columns
- Desktop (lg): `grid-cols-3` — three columns; all ten cards visible in four rows (3+3+3+1)
- The "View Category" ghost button on cards is always visible on mobile (no hover state on touch); the Card Hover Effect image scale is disabled on touch devices via touch detection

**3.2 Category Detail:**
- Section 1 Hero: `min-h-[30vh]` on mobile; `min-h-[45vh]` on desktop. H1 font responsive step-down: `text-h2 md:text-h1`.
- Section 2 Specs: Single column on mobile (specs stack vertically); 2-column at md.
- Section 3 Products: Single column on mobile; 2-column at md.
- Section 4 CTA: Full-width on mobile; centered `max-w-2xl` on desktop.
- `px-container-x` on mobile; `md:px-8`; `lg:px-12` on desktop for all sections.

---

### F. Accessibility Notes

**3.1 — Category Grid:**
- Section 1: White on navy (15.9:1). PASS.
- Section 2 Cards: Category name (h3) — navy on cream-100 (14.2:1). Description body — ink-muted on cream-100 (6.7:1). GSM badge navy variant — white on navy (15.9:1). PASS all.
- Each card `<a>` wrapper: `aria-label="[Category Name] — view product category"`. Avoids ambiguous "View Category" link text in isolation for screen readers.
- Card grid: `<section aria-labelledby="products-grid-heading">`. Grid container: `role="list"`. Each card: `role="listitem"`.
- "View Category" ghost button within card: `tabindex="-1"` if the whole card `<a>` is the focus target (to avoid double-tabbing). Developer chooses card-level `<a>` as the primary interactive element; ghost button is decorative.

**3.2 — Category Detail:**
- Section 1 Hero: White on navy overlay (15.9:1). GSM badge (muted variant): ink-muted on line (4.9:1). PASS.
- Section 2 Specs: Ink-muted on white (7.5:1) for body/list. H3/H4 — navy on white — ratio > 14:1. PASS.
- Section 3 Products: Inside default Card — same as Section 2 of 3.1. PASS.
- Section 4: White on navy (15.9:1). PASS.
- Fabric badges (`muted` variant) within product cards: ink-muted on line (4.9:1). PASS.
- Spec lists use `<ul>` with `<li>` for fabric options and customization options.
- Section landmark for each: `<section aria-labelledby="[section-id]">` with respective h2/h3 carrying the `id`.
- "Request a Quote" button in product cards: `aria-label="Request a quote for [Product Name]"` to distinguish identical button labels across multiple cards for screen readers.

---

## 4. Manufacturing & Capabilities (`/manufacturing`)

### A. Layout & Section Breakdown

**Section 1 — Page Hero**
SectionWrapper variant: `dark`. `min-h-[45vh]`. Layout: centered single column — H1 + body-lg intro paragraph. Background: static dark navy — no atmospheric component (save motion budget for the 9-stage reveal below). Purpose: frames the manufacturing scope; "From Product Development to Final Packing" as the organizing promise.

**Section 2 — Process Introduction**
SectionWrapper variant: `light`. Layout: 2-column grid (`grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16`): left column contains the manufacturing intro paragraph; right column contains a supporting image (`/public/images/site/manufacturing.jpg`). Purpose: provides written context for the process before the visual stage reveal.

**Section 3 — Nine-Stage Process (Sticky Scroll Reveal)**
SectionWrapper variant: `white`. Layout: full Sticky Scroll Reveal. Left column (35%, `sticky top-[4.5rem]`): stage counter ("Stage N of 9"), stage name as h3 in crimson, a brief stage label. Right column (65%): nine stage content panels, each containing the stage name as h2 (in navy), a stage icon placeholder (64px), and an expanded description note. The stage names come from DB; descriptions are derived from the manufacturing intro ContentBlock context. As user scrolls, the right column cycles through stage panels while the left column updates to show the current stage number and name. Purpose: turns the nine-stage process into a guided buyer walkthrough; the premier content section of this page.

**Section 4 — Supply Chain Context**
SectionWrapper variant: `light`. Layout: centered, max-w-3xl — a brief paragraph about Faisalabad's textile supply chain. Purpose: adds geographic and industry context supporting the manufacturing quality claim.

**Section 5 — CTA**
SectionWrapper variant: `dark`. Full-width crimson inner panel. Request a Quote secondary dark-host button. Purpose: converts buyers who have reviewed the manufacturing process into inquirers.

---

### B. Copy Source References

**Section 1 — Hero**
- H1: ContentBlock `page: "manufacturing"`, `key: "hero.heading"` — "From Product Development to Final Packing"
- Intro paragraph: ContentBlock `page: "manufacturing"`, `key: "manufacturing.intro"` — "Our manufacturing process is managed through defined production stages..."

**Section 2 — Process Introduction**
- Body text: ContentBlock `page: "manufacturing"`, `key: "manufacturing.intro"` (same ContentBlock reused at expanded display — developer renders the full paragraph here with more typographic space than in the hero)

**Section 3 — Nine-Stage Process**
- Stage names (all nine): ContentBlocks `page: "manufacturing"`, `key: "stage.1"` through `key: "stage.9"` — "Requirement Review", "Fabric Preparation", "Sampling", "Cutting", "Stitching", "Customization", "Finishing", "Inspection", "Packing"
- Stage descriptions: the nine stage names are the only ContentBlock data available. Developer derives brief descriptive sentences from the manufacturing intro wording ("requirement review, fabric preparation, sampling, cutting, stitching, customization, finishing, inspection and packing" — enumerated in `manufacturing.intro`). No additional marketing copy may be invented. Stage panels show the stage name prominently as h2; description text is omitted if no verbatim source exists. **Flag to orchestrator:** individual stage descriptions are not in seed.ts — orchestrator may request the client provide one sentence per stage, which would then be added as ContentBlock records `page: "manufacturing"`, `key: "stage.N.description"`.

**Section 4 — Supply Chain Context**
- Paragraph text: ContentBlock `page: "about"`, `key: "about.history"` — third sentence: "Our manufacturing operations are supported by experienced production professionals, quality-control procedures and access to Faisalabad's strong textile supply chain." Developer extracts this sentence from the history block. This is the only source text in the approved library that describes the supply chain context.

**Section 5 — CTA**
- Same sources as Home Section 6.

---

### C. Imagery Direction

**Section 1 — Hero**
No background image. Static dark navy SectionWrapper.

**Section 2 — Process Introduction image**
Use `/public/images/site/manufacturing.jpg`. Art direction: landscape 4:3, focal point: center of production activity. Cloudinary transform: `f_auto,q_auto,c_fill,g_center,ar_4:3,w_800`. Apply `rounded-card shadow-card` to image wrapper. No overlay.

**Section 3 — Nine-Stage Process panels**
No photography per panel — each stage card uses the stage name as text + icon placeholder (32×32px SVG). If the orchestrator approves individual stage photography (closeup of cutting table, stitching machine, etc.), flag as additional assets needed: nine editorial closeup images of each production stage — subject: professional garment manufacturing equipment/process in organized clean environment, mood: technical and precise, composition: tight overhead or 3/4 angle, each 4:3 crop. Cloudinary: `f_auto,q_auto,c_fill,g_center,ar_4:3,w_600`. These do not exist in `/public/images/`; procurement required.

**Sections 4, 5 — No images.**

---

### D. Motion & Component Assignments

**Section 1 — Hero text stagger:**
- Framer Motion on-load: H1 text fade-up (Y 32px → 0, opacity 0 → 1, spring stiffness 60, damping 18). Intro paragraph follows with 0.2s delay.
- Reduced-motion fallback: instant render.

**Section 3 — Sticky Scroll Reveal (primary motion feature):**
- Component: Sticky Scroll Reveal (Aceternity-inspired, custom rebuild)
- Trigger: scroll-position driven via Framer Motion `useScroll` with the Section 3 scroll container as `target`
- Behavior: `scrollYProgress` is divided into nine equal thresholds. Each panel becomes "active" when its threshold is crossed. Active panel: opacity 1, Y 0; inactive panel above: opacity 0, Y -30px; inactive panel below: opacity 0, Y 30px. Transition: spring stiffness 50, damping 16. Left sticky column counter updates reactively. Total scroll distance for this section: `9 × 100vh` to give approximately one viewport of scroll per stage.
- Animated Tooltip on stage names in the left sticky label: on hover of the stage label in the left panel, a tooltip (Aceternity-inspired Animated Tooltip component) appears with the stage number and a brief label. Tooltip: `bg-navy-800 text-white text-caption rounded-badge py-1 px-3 shadow-card-dark`. Positioned above the label. Spring: stiffness 200, damping 30. Z-index: `z-tooltip` (200).
- Reduced-motion fallback: sticky behavior disabled; all nine stages render as a flat numbered list with `border-b border-line` dividers; no panel transitions; no tooltip animation (tooltip still displays on focus/hover as a plain `title` attribute or visible span)
- Rationale: Nine-stage Sticky Scroll Reveal is the editorial centerpiece of the manufacturing page — it gives international buyers the sense of walking through a professional factory floor, stage by stage, without requiring them to navigate between pages. The scroll-driven reveal matches the sequential nature of the process itself.

**Sections 2, 4, 5 — Scroll-triggered fade-up:**
- Standard `whileInView`, Y 32px → 0, opacity 0 → 1, spring stiffness 80, damping 22. Trigger at `amount: 0.2`.
- Reduced-motion fallback: instant render.

---

### E. Responsive Behavior

**Mobile:**
- Section 1: `min-h-[35vh]`. H1 responsive step: `text-h2 md:text-h1`.
- Section 2: Single column; image moves below the intro text, full-width 16:9 crop.
- Section 3 Sticky Scroll Reveal: Collapses to a vertical numbered list. Sticky behavior disabled. Each stage renders as a `border-b border-line` row with stage number (caption, ink-muted), stage name (h4, navy), in a single column. `py-6` per row.
- Section 4: Full width, `px-container-x`.
- Section 5: CTA band buttons stack vertically.

**Tablet (md–lg):**
- Section 2: 2-column at md+ with image on right; standard 2-col grid.
- Section 3: Sticky Scroll Reveal activates at md+. Left column: 35%, right: 65%.

**Desktop (lg+):**
- Section 3: Full sticky with `h-[900vh]` section height (100vh × 9 stages). Left panel: `sticky top-[4.5rem] h-[calc(100vh-4.5rem)]`.
- Section 2: `lg:grid-cols-[3fr_2fr]` wide text / narrow image.

---

### F. Accessibility Notes

**Contrast pairs:**
- Section 1: White on navy (15.9:1). PASS.
- Section 2: Ink-muted on cream (6.0:1) for body. PASS.
- Section 3 stage panels: Navy h2 on white (ratio > 14:1). Ink-muted descriptions on white (7.5:1). Crimson stage label on left panel — white on navy (15.9:1 — the left panel is on the `dark` sticky background). PASS all.
- Section 4: Ink-muted on cream (6.0:1). PASS.
- Section 5: White on crimson (8.6:1). PASS.

**Focus states:**
- Sticky scroll: no keyboard-interactive elements inside the stage panels beyond the final CTA link. Keyboard users navigate the page normally; the stage panels are content regions, not interactive controls.
- Animated Tooltip on stage names: tooltip trigger element (`<button>` or `<span tabindex="0">`) receives `focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2`. Tooltip content is accessible on focus as well as hover.

**ARIA:**
- Section 1: `<section aria-labelledby="mfg-hero-heading">`.
- Section 3: `<section aria-labelledby="mfg-process-heading">`. Sticky scroll container: `role="region" aria-label="Nine-stage manufacturing process"`. Each stage panel: `role="article" aria-label="Stage [N]: [stage name]"`. Left counter: `aria-live="polite" aria-atomic="true"` so screen readers announce stage changes as user scrolls.
- Section 3 Tooltip: `role="tooltip" id="stage-N-tooltip"`. Trigger element: `aria-describedby="stage-N-tooltip"`.

---

## 5. Private Label / OEM Services (`/oem-services`)

### A. Layout & Section Breakdown

**Section 1 — Page Hero**
SectionWrapper variant: `dark`. `min-h-[40vh]`. Layout: centered single column — H1 + body intro (derived from §14). Purpose: establishes Private Label and OEM as the primary commercial offering for international buyers.

**Section 2 — Services Offered**
SectionWrapper variant: `light`. Layout: section heading (h2) above a 4-column grid at desktop (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`) of 19 service tiles. Each tile: a `default` Card variant with `p-6` (overriding the default `p-8` for tighter grid), icon placeholder (24px), service name as h4. Purpose: comprehensive capability listing; gives buyers confidence that every private-label requirement can be fulfilled.

**Section 3 — Ten-Step Workflow**
SectionWrapper variant: `white`. Layout: centered, max-w-3xl. Section heading (h2) above a vertical numbered flow: ten steps arranged as a vertical list with connecting line on the left (`border-l-2 border-crimson/30`). Each step: step number as a crimson circle badge (navy text inside), step label as h4, step description as body. Purpose: gives buyers a clear picture of the process journey from inquiry to shipment, reducing purchase hesitation.

**Section 4 — MOQ Note**
SectionWrapper variant: `light`. Layout: centered, max-w-xl — single paragraph (body-lg) + a ghost link to `/contact`. Purpose: directly addresses the MOQ question with the approved wording; encourages buyers to make contact.

**Section 5 — CTA**
SectionWrapper variant: `dark`. Full-width crimson inner panel. Request a Quote button (secondary dark-host) + WhatsApp link. Purpose: primary conversion for OEM service buyers.

---

### B. Copy Source References

**Section 1 — Hero**
- H1: ContentBlock `page: "oem-services"`, `key: "hero.heading"` — "Private Label and OEM Services"
- Intro body: §14 · "OEM services + 10-step workflow" — developer uses the service listing lead-in from §14: "services list (product dev, sourcing, patterns, sampling, labels, packaging, export coordination)." The hero intro sentence: no dedicated ContentBlock exists; developer uses the H1 as the sole hero text or adds a brief structural descriptor using the category of services. **Flag to orchestrator:** a body intro sentence for the OEM hero is not in seed.ts; confirm whether a ContentBlock `page: "oem-services"`, `key: "hero.subheading"` should be added.

**Section 2 — Services**
- Service 1–19 names: ContentBlocks `page: "oem-services"`, `key: "service.1"` through `key: "service.19"` — "Product development", "Fabric sourcing", "Pattern development", "Sample development", "Custom sizing", "Custom colours", "Printing", "Embroidery", "Custom labels", "Care labels", "Size labels", "Hangtags", "Custom trims", "Private packaging", "Barcode labelling", "Bulk production", "Quality inspection", "Export packing", "Shipment coordination"

**Section 3 — Workflow**
- Step 1–10: ContentBlocks `page: "oem-services"`, `key: "workflow.step.1"` through `key: "workflow.step.10"` — "Inquiry — Buyer submits inquiry...", "Review — Product requirements are reviewed", etc. (full values in seed.ts)
- Step display format: the ContentBlock value uses " — " as a separator between the short label and the description. Developer splits on " — " to show: short label as h4, description as body text.

**Section 4 — MOQ Note**
- MOQ paragraph: ContentBlock `page: "oem-services"`, `key: "oem.moq"` — "Confirmed according to product category, fabric, colour, design and customization."
- Note: §14 also states "MOQ wording: 'Please contact us with your product and quantity requirements to receive a suitable MOQ and quotation.'" — developer may combine both: the §14 contact-us preamble + the oem.moq ContentBlock as supporting detail.

**Section 5 — CTA**
- Same sources as Home Section 6.

---

### C. Imagery Direction

**Section 1 — Hero**
No background image. Static dark navy SectionWrapper. Consider adding a subtle Moving Border animation on the hero H1 as an accent (no new image asset required).

**Section 2 — Service tiles**
No images per tile. Icon placeholder per Icon Library Decision Item. Icon subject per service: product-dev → pencil/ruler; fabric-sourcing → layers/fabric; pattern-dev → grid; sample-dev → prototype/flask; custom-sizing → ruler/resize; colours → palette; printing → print/stamp; embroidery → needle; labels → tag; care-labels → heart/wash; size-labels → text-size; hangtags → bookmark; trims → scissors; packaging → box; barcode → barcode-scan; bulk-production → factory; quality-inspection → check-shield; export-packing → package; shipment → truck/globe.

**Section 3 — Workflow**
No images. Crimson circle badges with Inter number labels.

**Sections 4, 5 — No images.**

Additional asset flag for this page: an editorial flat-lay image of finished garments with private labels and custom packaging (hangtags, polybag, carton) would strengthen Section 2 or serve as a hero background. Subject: neat arrangement of finished branded garments — hoodies/tees with custom labels visible, professional flat-lay on cream/white surface. Mood: organized, premium, product-focused. Cloudinary: `f_auto,q_auto,c_fill,g_center,ar_16:9,w_1200`. **This asset does not exist in `/public/images/`; flag for procurement.**

---

### D. Motion & Component Assignments

**Section 1 — Hero text stagger:**
- Same as Manufacturing Section 1. On-load, H1 fade-up, spring stiffness 60, damping 18.
- Reduced-motion fallback: instant render.

**Section 2 — Service tiles: Staggered Card Reveal**
- Framer Motion `whileInView`, trigger at `amount: 0.1`
- Stagger 0.05s per tile (19 tiles — keep stagger short to avoid very long total delay). Y 20px → 0, opacity 0 → 1. Spring stiffness 90, damping 22.
- Reduced-motion fallback: instant render.

**Section 3 — Workflow: Animated numbered flow**
- Framer Motion `whileInView`, trigger at `amount: 0.1`
- Each step enters with: circle badge scale 0 → 1 (spring stiffness 200, damping 25), then step label fades in (Y 16px → 0, opacity 0 → 1, spring stiffness 80, damping 20, 0.1s delay after badge). Stagger 0.12s between steps.
- Connecting left border line: `scaleY` 0 → 1 as the section enters, `transformOrigin: "top"`, spring stiffness 30, damping 20.
- Moving Border on the CTA in Section 5: applied to the "Request a Quote" secondary dark-host button. Same behavior as Home Section 6.
- Reduced-motion fallback: all elements at final position; no scale; no stagger; connecting line visible at full height.
- Rationale: The animated workflow reveal makes each step of the OEM process feel like a deliberate reveal of expertise — appropriate for a page whose purpose is to reduce buyer risk by making the process transparent.

---

### E. Responsive Behavior

**Mobile:**
- Section 1: `min-h-[30vh]`. H1 step-down: `text-h2 md:text-h1`.
- Section 2: `grid-cols-2` on mobile (19 tiles in compact 2-col); tile cards reduce padding to `p-4`.
- Section 3: Single-column vertical flow; step numbers and labels at full width.
- Section 4: Full-width paragraph; `px-container-x`.

**Tablet (md–lg):**
- Section 2: `grid-cols-3`.
- Section 3: `max-w-3xl` centered applies.

**Desktop (lg+):**
- Section 2: `grid-cols-4` — 19 tiles across 5 rows (4+4+4+4+3).
- Section 3: `max-w-3xl` centered within full-width white section.

---

### F. Accessibility Notes

**Contrast pairs:**
- Section 1: White on navy (15.9:1). PASS.
- Section 2 tiles (default Card, cream-100 surface): h4 navy on cream-100 (14.2:1). PASS.
- Section 3 workflow: navy h4 on white (>14:1). Ink-muted body on white (7.5:1). Crimson circle badge: use white number text on crimson (8.6:1). PASS.
- Section 4: Ink-muted on cream (6.0:1). PASS.
- Section 5: White on crimson (8.6:1). PASS.

**Focus states:**
- Section 3 workflow steps are non-interactive content items — no focus state required unless each step links somewhere.
- Section 4 ghost link to `/contact`: `focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 rounded-btn`.

**ARIA:**
- Section 1: `<section aria-labelledby="oem-hero-heading">`.
- Section 2: `<section aria-labelledby="oem-services-heading">`. Grid: `role="list"`. Each tile: `role="listitem"`. Icon SVGs: `aria-hidden="true"`.
- Section 3: `<section aria-labelledby="oem-workflow-heading">`. Workflow list: `<ol>` with `<li>` per step (ordered list is semantically correct for a sequential process). Step heading: `<h4>`. Step number badge: `aria-hidden="true"` (number is conveyed by `<ol>` order). Left connecting line: decorative, `aria-hidden="true"`.
- Section 4: `<section aria-label="MOQ information">`.

---

## 6. Quality Assurance (`/quality-assurance`)

### A. Layout & Section Breakdown

**Section 1 — Page Hero**
SectionWrapper variant: `dark`. `min-h-[40vh]`. Layout: centered single column — H1 + body-lg QA intro paragraph. The H1 and intro together form the complete QA positioning statement; no separate hero image. Purpose: establishes the quality promise authoritatively before the detailed checklist.

**Section 2 — QA Introduction and Image**
SectionWrapper variant: `white`. Layout: 2-column grid (`grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16`): left column renders the quality.intro ContentBlock as a formatted paragraph with a left border accent (`border-l-4 border-crimson pl-6`); right column shows the quality-control site image. Purpose: reinforces the QA narrative with visual evidence; the crimson left border elevates the paragraph to a pull-quote treatment.

**Section 3 — Twelve-Point QC Checklist**
SectionWrapper variant: `light`. Layout: section heading (h2) above a 2-column grid (`grid-cols-1 md:grid-cols-2 gap-4`) of twelve checklist item cards. Each item card: a `default` Card variant with `p-6`, a crimson checkmark icon (24px) on the left, QC point text as body-lg on the right. Purpose: the primary evidentiary content of the page; demonstrates systematic quality control to buyers who require assurance of consistent product quality.

**Section 4 — CTA**
SectionWrapper variant: `dark`. Full-width crimson inner panel. Request a Quote secondary dark-host button. Purpose: converts quality-convinced buyers into inquirers.

---

### B. Copy Source References

**Section 1 — Hero**
- H1: ContentBlock `page: "quality"`, `key: "hero.heading"` — "Quality Controlled at Every Important Stage"
- Body intro: ContentBlock `page: "quality"`, `key: "quality.intro"` — "At MH Global Attire, quality control begins before production..."

**Section 2 — QA Introduction**
- Pull-quote paragraph: ContentBlock `page: "quality"`, `key: "quality.intro"` (same ContentBlock, rendered as the styled pull-quote)

**Section 3 — Checklist**
- QC points 1–12: ContentBlocks `page: "quality"`, `key: "qc.point.1"` through `key: "qc.point.12"` — "Buyer specification review", "Fabric and trim inspection", "Colour and GSM verification", "Sample approval", "Pre-production meeting", "Cutting inspection", "Inline stitching inspection", "Measurement checks", "Printing and embroidery inspection", "Finishing inspection", "Final appearance inspection", "Packing and quantity verification"

**Section 4 — CTA**
- Same sources as Home Section 6.

---

### C. Imagery Direction

**Section 1 — Hero**
No background image. Static dark navy.

**Section 2 — QA image**
Use `/public/images/site/quality-control.jpg`. Art direction: portrait 3:4, focal point: center, emphasizing the inspection/measurement activity visible in the image. Cloudinary: `f_auto,q_auto,c_fill,g_center,ar_3:4,w_600`. Apply `rounded-card shadow-card` to the image wrapper. No overlay — natural color on white section.

**Section 3 — Checklist cards**
Checkmark icon: simple SVG checkmark in `text-crimson`. No photography needed. The crimson checkmark carries visual weight alongside the text.

**Section 4 — CTA**
No images.

---

### D. Motion & Component Assignments

**Section 1 — Hero text:**
- On-load fade-up. H1: Y 32px → 0, opacity 0 → 1, spring stiffness 60, damping 18. Intro: Y 20px → 0, 0.2s delay. Reduced-motion: instant render.

**Section 2 — Pull-quote and image:**
- `whileInView`, trigger `amount: 0.3`. Left column: opacity 0 → 1, X -20px → 0. Right image: opacity 0 → 1, X 20px → 0. Spring stiffness 80, damping 20, 0.1s delay on image. Reduced-motion: instant render.

**Section 3 — Checklist: Staggered Animated Reveal List**
- Component: Framer Motion `whileInView` staggered reveal (custom pattern; this is the "animated reveal list" referenced in §9)
- Trigger: scroll into view at `amount: 0.1`
- Behavior: Each of the twelve checklist cards animates in sequentially. Card entry: checkmark icon scales from 0 → 1 (spring stiffness 300, damping 25), simultaneously the card slides in from X -16px → 0 and opacity 0 → 1 (spring stiffness 90, damping 22). Stagger: 0.06s per card in reading order (top-left, top-right, second-left, second-right, etc. — reading column by column).
- Reduced-motion fallback: all cards render instantly; no scale; no slide
- Rationale: The staggered checklist reveal makes each quality checkpoint feel like a deliberate disclosure — turning a simple list into a quality-assurance ceremony that builds buyer trust progressively rather than presenting a wall of text.

---

### E. Responsive Behavior

**Mobile:**
- Section 1: `min-h-[30vh]`. H1 step-down: `text-h2 md:text-h1`.
- Section 2: Single column; image below pull-quote; image switches to 16:9 landscape crop.
- Section 3: Single-column checklist (`grid-cols-1`); twelve cards stacked vertically.

**Tablet (md–lg):**
- Section 3: `grid-cols-2` activates at md.

**Desktop (lg+):**
- Section 2: `lg:grid-cols-[3fr_2fr]`. Image at portrait 3:4.

---

### F. Accessibility Notes

**Contrast pairs:**
- Section 1: White on navy (15.9:1). PASS.
- Section 2: Ink-muted on white (7.5:1) for pull-quote body. Crimson left border is decorative. PASS.
- Section 3 checklist cards (cream-100 surface): body-lg — ink-muted on cream-100 (6.7:1). PASS. Crimson checkmark icon: decorative, `aria-hidden="true"`.
- Section 4: White on crimson (8.6:1). PASS.

**ARIA:**
- Section 1: `<section aria-labelledby="qa-hero-heading">`.
- Section 2: `<section aria-labelledby="qa-intro-heading">`. Pull-quote paragraph: optionally `role="note"` if the developer uses a `<blockquote>` element; otherwise plain `<p>` is correct.
- Section 3: `<section aria-labelledby="qa-checklist-heading">`. Checklist grid: `role="list"`. Each card: `role="listitem"`. Checkmark SVGs: `aria-hidden="true"`. Card elements: `<div>` (not `<article>` since each checklist item is not an independent content entity).

---

## 7. Sustainability — Responsible Manufacturing (`/sustainability`)

### A. Layout & Section Breakdown

**Section 1 — Page Hero**
SectionWrapper variant: `dark`. `min-h-[40vh]`. Layout: centered single column — H1 + body (sustainability body ContentBlock). Purpose: establishes the responsible manufacturing framing immediately; "developing" language is present in the ContentBlock itself.

**Section 2 — Approach Statement**
SectionWrapper variant: `white`. Layout: centered narrow column (`max-w-2xl`) — the sustainability body paragraph rendered with generous line height and a top-aligned crimson rule (`border-t-2 border-crimson pt-8`). Purpose: gives the core responsible-manufacturing statement editorial prominence as a standalone commitment statement, separate from the hero density.

**Section 3 — Practices in Development**
SectionWrapper variant: `light`. Layout: section heading (h2) + body intro above an icon grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`). Eight `default` Card variant cards, each: icon placeholder (32px), initiative label as h4 (no description text beyond the label — descriptions are not in seed.ts). Below each card, a `muted` Badge variant with text "In Development" to reinforce the forward-looking framing. Purpose: transparently communicates eight practices the company is developing without making verified claims.

**Section 4 — CTA**
SectionWrapper variant: `dark`. Crimson inner panel. Request a Quote button + WhatsApp link. Purpose: positions sustainability-aligned buyers to begin the inquiry process.

**CRITICAL CONSTRAINT — Sustainability page:** No certification, verified audit, formal program membership, or claim of achieved status is displayed anywhere on this page. The Certification model in Prisma has `published: false` for all records — no certification data is rendered. Every practice is framed as "in development" using the `muted` Badge variant. The sustainability body ContentBlock itself uses "committed to developing" framing (seed.ts value confirmed). No deviation from this framing is permitted.

---

### B. Copy Source References

**Section 1 — Hero**
- H1: ContentBlock `page: "sustainability"`, `key: "hero.heading"` — "Sustainability and Responsible Manufacturing"
- Body paragraph: ContentBlock `page: "sustainability"`, `key: "sustainability.body"` — "MH Global Attire is committed to developing responsible manufacturing practices..."

**Section 2 — Approach Statement**
- Same ContentBlock: `page: "sustainability"`, `key: "sustainability.body"` (rendered with elevated typographic treatment in this section)

**Section 3 — Practices in Development**
- Section heading: "Practices We Are Developing" — this heading does not exist in seed.ts. Flag to orchestrator: confirm whether this structural heading requires a ContentBlock entry. If not, it is a structural label and the orchestrator confirms it is permissible as a functional heading (not marketing copy).
- Initiative labels 1–8: ContentBlocks `page: "sustainability"`, `key: "initiative.1"` through `key: "initiative.8"` — "Fabric waste separation", "Responsible material utilization", "Energy-saving practices", "Safe and organized working conditions", "Worker training", "Quality and safety awareness", "Responsible chemical handling", "Recycled or certified materials upon buyer request"
- "In Development" badge label: functional status label; not marketing copy. Not in seed.ts — permitted as a structural UI label.

**Section 4 — CTA**
- Same sources as Home Section 6.

---

### C. Imagery Direction

**Section 1 — Hero**
No background image. Static dark navy SectionWrapper.

**Section 2 — Approach Statement**
No image. Typography-only treatment with crimson top rule.

**Section 3 — Practices grid**
Icon placeholder per Icon Library Decision Item. Icon subjects per initiative: fabric waste → recycle; material utilization → leaf/layers; energy-saving → zap/lightning; working conditions → shield-check; worker training → graduation-cap; quality/safety → badge-check; chemical handling → flask; recycled materials → recycle/star. All icons in `text-crimson` (24px).

No photography for sustainability initiatives — no imagery should imply achieved environmental status that does not exist. The icon-based grid is the appropriate treatment: illustrative, not evidential.

**Section 4 — CTA**
No images.

---

### D. Motion & Component Assignments

**Section 1 — Hero:**
- On-load fade-up. Standard spring stiffness 60, damping 18.
- Reduced-motion: instant render.

**Section 2 — Approach Statement:**
- `whileInView`, trigger `amount: 0.4`. Fade-up Y 24px → 0, opacity 0 → 1, spring stiffness 70, damping 20.
- Reduced-motion: instant render.

**Section 3 — Practices Grid: Staggered Card Reveal**
- `whileInView`, trigger `amount: 0.1`
- Stagger 0.07s per card. Y 24px → 0, opacity 0 → 1, spring stiffness 90, damping 22.
- `muted` Badge ("In Development") fades in 0.15s after its parent card. Opacity 0 → 1 only (no Y offset — subtle secondary reveal).
- Reduced-motion: instant render for all cards and badges.
- Rationale: Gentle, unhurried reveals on the sustainability cards match the considered, developing-practices tone — not urgent or sales-aggressive, but deliberate and transparent.

---

### E. Responsive Behavior

**Mobile:**
- Section 1: `min-h-[30vh]`.
- Section 2: Full width; `px-container-x`; centered text.
- Section 3: `grid-cols-1` on mobile; `grid-cols-2` at sm; `grid-cols-4` at lg.

**Tablet (md–lg):**
- Section 3: `grid-cols-2`.

**Desktop (lg+):**
- Section 3: `grid-cols-4` — eight cards in two rows of four.

---

### F. Accessibility Notes

**Contrast pairs:**
- Section 1: White on navy (15.9:1). PASS.
- Section 2: Ink-muted on white (7.5:1). Crimson top rule: decorative. PASS.
- Section 3 cards (cream-100): ink-muted on cream-100 (6.7:1) for h4; `muted` badge — ink-muted on line (4.9:1). PASS.
- Section 4: White on crimson (8.6:1). PASS.

**ARIA:**
- Section 1: `<section aria-labelledby="sustainability-hero-heading">`.
- Section 3: `<section aria-labelledby="sustainability-practices-heading">`. Grid: `role="list"`. Each card: `role="listitem"`. `muted` badges are non-interactive `<span>` — no focus state required. Icon SVGs: `aria-hidden="true"`.
- No `role` or ARIA attribute should imply certification status. The "In Development" badge label is plain text; no need for `aria-label` beyond the visible text.

---

## 8. Why Choose Us (`/why-choose-us`)

### A. Layout & Section Breakdown

**Section 1 — Page Hero**
SectionWrapper variant: `dark`. `min-h-[40vh]`. Layout: centered single column — H1 + brief intro body text. Purpose: buyer-centric framing of the value proposition; "focused on your requirements" positions the manufacturer as a service partner.

**Section 2 — Ten Differentiators (Bento Grid)**
SectionWrapper variant: `light`. Layout: section heading (h2) above a Bento Grid in a 4-column CSS grid at desktop. Grid pattern: two large cells (`col-span-2 row-span-2`) for differentiators 1 and 2 (foundation of the brand: Faisalabad location + customization), and eight standard cells (`col-span-1`) for differentiators 3–10. Each cell is a `default` Card variant with icon placeholder (32px, `text-crimson`), differentiator text as h4, and sufficient body padding. The two large cells use `text-h3` for their differentiator text (larger because they have more vertical space). Purpose: comprehensive visual proof of the ten differentiators; Bento Grid layout creates editorial hierarchy that emphasizes the most foundational differentiators.

**Section 3 — CTA Band**
SectionWrapper variant: `dark`. Full-width crimson inner panel. H2 heading + body text + Request a Quote button (secondary dark-host) + WhatsApp link. Purpose: the natural conversion point for a buyer who has read through all ten reasons to choose MH Global Attire.

---

### B. Copy Source References

**Section 1 — Hero**
- H1: ContentBlock `page: "why"`, `key: "hero.heading"` — "A Manufacturing Partner Focused on Your Requirements"
- Body intro: no dedicated intro ContentBlock exists in seed.ts for the why page. Flag to orchestrator. Developer may use the H1 as the sole hero text, or use ContentBlock `page: "about"`, `key: "about.intro"` as contextual body text if the orchestrator confirms this is appropriate reuse.

**Section 2 — Differentiators**
- Differentiator 1: ContentBlock `page: "why"`, `key: "differentiator.1"` — "Apparel manufacturing based in Faisalabad, Pakistan" (large cell)
- Differentiator 2: ContentBlock `page: "why"`, `key: "differentiator.2"` — "Customized garment manufacturing" (large cell)
- Differentiators 3–10: ContentBlocks `page: "why"`, `key: "differentiator.3"` through `key: "differentiator.10"` (standard cells)

**Section 3 — CTA Band**
- H2 inside crimson panel: ContentBlock `page: "why"`, `key: "hero.heading"` — reused as the CTA band headline
- Button: ContentBlock `page: "home"`, `key: "hero.cta.primary"`
- WhatsApp: SiteSettings `key: "whatsapp"`

---

### C. Imagery Direction

**Sections 1, 3 — No images.** Dark navy SectionWrapper is the surface.

**Section 2 — Bento Grid cards**
No photography per cell. Icon-based grid (Icon Library Decision Item applies). Icons must visually differentiate each differentiator category — see icon subjects below:
- Differentiator 1 (Faisalabad location): map-pin or globe-with-pin icon
- Differentiator 2 (customized manufacturing): settings-2 or pencil-ruler
- Differentiator 3 (private label/OEM): tag or stamp
- Differentiator 4 (flexible product dev): lightbulb or zap
- Differentiator 5 (supply chain access): link or network
- Differentiator 6 (fabric/GSM/colour options): palette or swatches
- Differentiator 7 (printing/embroidery/labels): printer or layers
- Differentiator 8 (quality monitoring): shield-check or eye
- Differentiator 9 (professional communication): message-circle or headset
- Differentiator 10 (partnership approach): handshake or users

Large cells (differentiators 1 and 2): icon renders at 48px. Standard cells: 32px. All in `text-crimson`.

---

### D. Motion & Component Assignments

**Section 1 — Hero:**
- On-load fade-up. Standard spring stiffness 60, damping 18. Reduced-motion: instant render.

**Section 2 — Bento Grid: Staggered Reveal**
- Component: Framer Motion `whileInView` staggered children (same Bento Grid pattern as Home Section 3 but all ten cells)
- Trigger: `amount: 0.1`
- Behavior: Cells reveal in reading order (left to right, top to bottom). Y 32px → 0, opacity 0 → 1, stagger 0.07s per cell. Spring stiffness 90, damping 22. Large cells (differentiators 1 and 2) have no special timing — they follow the standard stagger order.
- 3D Card tilt-on-hover: applied to all ten Bento cells, identical to Home Section 3 (perspective 1000px, ±8 degrees, spring stiffness 200, damping 30).
- Reduced-motion fallback: instant render; no tilt.
- Rationale: The Bento Grid's deliberate left-to-right, top-to-bottom stagger mirrors the process of reading a list of reasons — each differentiator lands individually rather than as a simultaneous wall of content.

**Section 3 — CTA Band:**
- Moving Border on the primary button, same as Home Section 6.
- `whileInView` fade-in on the entire crimson panel: opacity 0 → 1, Y 24px → 0, spring stiffness 70, damping 20, trigger `amount: 0.5`.
- Reduced-motion: instant render.

---

### E. Responsive Behavior

**Mobile:**
- Section 1: `min-h-[30vh]`. H1 step-down.
- Section 2: `grid-cols-1` — all ten cells in a single column stack; large cells no longer span 2 cols (all equal width).

**Tablet (md–lg):**
- Section 2: `grid-cols-2` — large cells span `col-span-2` (full width); standard cells fill 1 col each; 4 rows of 2.

**Desktop (lg+):**
- Section 2: `grid-cols-4`. Large cells: `col-span-2 row-span-2`. Standard cells: `col-span-1`. Total grid: large cells occupy first two rows left and right positions; standard cells fill the remaining grid slots. Developer verifies the cell order produces a visually balanced layout.

---

### F. Accessibility Notes

**Contrast pairs:**
- Section 1: White on navy (15.9:1). PASS.
- Section 2 (cream-100 card surfaces): h4 navy on cream-100 (14.2:1); body ink-muted on cream-100 (6.7:1). Large cells use `text-h3` — same navy color, same ratio. PASS.
- Section 3: White on crimson (8.6:1). PASS.

**ARIA:**
- Section 1: `<section aria-labelledby="why-hero-heading">`.
- Section 2: `<section aria-labelledby="why-differentiators-heading">`. Grid: `role="list"`. Each cell: `role="listitem"`. Bento cells are non-interactive by default (they convey information, not navigation); if cells link to supporting pages, add `<a>` wrappers with descriptive `aria-label`. Icon SVGs: `aria-hidden="true"`.
- Section 3: Same CTA ARIA as Home Section 6. `<section aria-labelledby="why-cta-heading">`.

---

## 9. Contact Us (`/contact`)

### A. Layout & Section Breakdown

**Section 1 — Page Header and Contact Message**
SectionWrapper variant: `dark`. `min-h-[35vh]`. Layout: centered single column — H1 ("Contact Us" from §4 route label) + the contact message body paragraph below. Purpose: welcomes buyer inquiry with direct and instructive opening copy; frames what information the buyer should bring to the conversation.

**Section 2 — Contact Details and Map**
SectionWrapper variant: `white`. Layout: 2-column grid at desktop (`grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12`). Left column: stacked contact info blocks — company name (h3), full address, phone/WhatsApp (clickable `tel:` link + `wa.me` link), three email addresses (clickable `mailto:` links), social links (Instagram, LinkedIn, Facebook). Right column: Google Maps iframe embed for the Faisalabad address. Purpose: provides all actionable contact methods in one place; the map embed adds geographic trust and professionalism.

**Section 3 — Alternative Contact Path**
SectionWrapper variant: `light`. Layout: centered, max-w-xl — a brief paragraph inviting buyers to use the full inquiry form, with a primary Button (md) linking to `/request-a-quote`. Purpose: secondary conversion path for buyers who prefer a structured form over direct contact.

**Section 4 — CTA**
SectionWrapper variant: `dark`. Crimson inner panel. Request a Quote secondary dark-host button. WhatsApp link. Purpose: reinforces the primary conversion action at the bottom of the contact page.

---

### B. Copy Source References

**Section 1 — Header**
- H1: §4 route label "Contact Us" — functional page heading; no ContentBlock exists
- Contact message paragraph: ContentBlock `page: "home"`, `key: "contact.message"` — "Tell us about your product category, quantity, fabric, GSM, colours, sizes, printing, embroidery, labels, packaging and required delivery timeline. Our team will review your inquiry and respond with the next steps."

Note: this ContentBlock is stored under `page: "home"` in seed.ts. The developer queries it by its `[page, key]` unique index: `{ page: "home", key: "contact.message" }`. The same record is displayed on the Contact page. Flag to orchestrator: if the admin needs to edit the contact message independently from any home-page use, add a separate ContentBlock `page: "contact"`, `key: "contact.message"` with the same initial value.

**Section 2 — Contact Details**
All contact detail values come from SiteSettings (seeded in `seedSiteSettings()` in `content/seed.ts`):
- Company name: §14 · "MH Global Attire Ltd."
- Founder: SiteSettings `key: "founder"` → "Ahmad Hassan"
- Address: SiteSettings `key: "address"` → "Hassan Dall Mills, New Mandi Road, Faisalabad, Punjab, Pakistan — 38000"
- Phone/WhatsApp: SiteSettings `key: "phone"` → "+92 321 3995224"; `key: "whatsapp"` → "+92 321 3995224"
- Email (info): SiteSettings `key: "email.info"` → "info@mhglobalattire.com"
- Email (sales): SiteSettings `key: "email.sales"` → "sales@mhglobalattire.com"
- Email (ahmad): SiteSettings `key: "email.ahmad"` → "ahmad@mhglobalattire.com"
- Instagram URL: SiteSettings `key: "social.instagram"` → "https://www.instagram.com/mhglobalattire/"
- LinkedIn URL: SiteSettings `key: "social.linkedin"` → "https://www.linkedin.com/company/mh-global-attire/"
- Facebook URL: SiteSettings `key: "social.facebook"` → "#" (not yet set — display conditionally)

**Section 3 — Alternative Contact Path**
- Paragraph lead text: ContentBlock `page: "home"`, `key: "contact.message"` — first sentence only, or a structural label "Prefer to submit a detailed inquiry?" — flag to orchestrator whether this label requires a ContentBlock.
- Button label: ContentBlock `page: "home"`, `key: "hero.cta.primary"` — "Request a Quote"

**Section 4 — CTA**
- Same sources as Home Section 6.

---

### C. Imagery Direction

**Section 1 — No images.** Dark navy SectionWrapper.

**Section 2 — Map embed**
Google Maps iframe for: "Hassan Dall Mills, New Mandi Road, Faisalabad, Punjab, Pakistan 38000". The iframe renders in the right column. Aspect ratio: 4:3. Apply `rounded-card shadow-card overflow-hidden` to the iframe wrapper `<div>`. The iframe itself receives `loading="lazy"` attribute. No Cloudinary transform needed (external embed).

No additional photography needed for the contact page.

**Sections 3, 4 — No images.**

---

### D. Motion & Component Assignments

**Section 1 — Header text:**
- On-load fade-up. H1 Y 32px → 0, opacity 0 → 1, spring stiffness 60, damping 18. Message paragraph: Y 20px → 0, 0.15s delay. Reduced-motion: instant render.

**Section 2 — Contact details and map:**
- `whileInView`, trigger `amount: 0.2`. Left column: X -24px → 0, opacity 0 → 1. Right map column: X 24px → 0, opacity 0 → 1, 0.1s delay. Spring stiffness 80, damping 20. Reduced-motion: instant render.

**Section 3 — Alternative CTA:**
- `whileInView` Y 20px → 0, opacity 0 → 1, trigger `amount: 0.4`. Reduced-motion: instant render.

**Sections 4 — Moving Border on CTA button:**
- Same as Home Section 6. Reduced-motion: static button.

No Aceternity-specific components on the contact page — the content is functional and direct; heavy motion would undermine the accessibility and urgency of a contact page.

---

### E. Responsive Behavior

**Mobile:**
- Section 1: `min-h-[25vh]`. H1 at `text-h2`.
- Section 2: Single column; map embed below contact details; map aspect ratio changes to 16:9 at full container width; `px-container-x`.
- Section 3: Full-width button.

**Tablet (md–lg):**
- Section 2: 2-column layout activates at lg (not md — the contact details + map need enough width).

**Desktop (lg+):**
- Section 2: `lg:grid-cols-[2fr_3fr]` — contact details narrower, map wider.

---

### F. Accessibility Notes

**Contrast pairs:**
- Section 1: White on navy (15.9:1). PASS.
- Section 2: Ink-muted on white (7.5:1) for contact details body. H3 (navy on white) > 14:1. PASS.
- Section 3: Ink-muted on cream (6.0:1). Primary button: white on crimson (8.6:1). PASS.
- Section 4: White on crimson (8.6:1). PASS.

**Interactive element focus states:**
- Phone link (`tel:`): `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson rounded-sm`.
- Email links (`mailto:`): same ring spec.
- WhatsApp link: same ring spec.
- Social links: same ring spec plus `aria-label="MH Global Attire on [Platform]"` per design-system-spec-0A §3.9.
- Map iframe: the iframe itself is keyboard-accessible per the browser's native implementation; wrap in `<div>` with `title="Location map for MH Global Attire, Faisalabad"` on the iframe element.

**ARIA:**
- Section 1: `<section aria-labelledby="contact-hero-heading">`.
- Section 2: `<section aria-labelledby="contact-details-heading">`. Contact details: use `<address>` element semantically for the company name, address, phone, and email block. Social links grouped in `<nav aria-label="Social media links">`.
- Section 3: `<section aria-label="Submit an inquiry form">`.
- Google Maps iframe: `<iframe title="Map showing MH Global Attire location in Faisalabad, Pakistan" ...>`.
- Phone link: `<a href="tel:+923213995224" aria-label="Call +92 321 3995224">`.
- WhatsApp link: `<a href="https://wa.me/923213995224?text=..." aria-label="Chat on WhatsApp with MH Global Attire">`.
- Email links: `<a href="mailto:info@mhglobalattire.com" aria-label="Email info@mhglobalattire.com">`.

---

## 10. Request a Quote (`/request-a-quote`)

### A. Layout & Section Breakdown

**Section 1 — Page Header**
SectionWrapper variant: `dark`. `min-h-[30vh]`. Layout: centered single column — H1 + brief context sentence. Purpose: orients the buyer before the detailed form; reassures them the form leads to a human response.

**Section 2 — Inquiry Form**
SectionWrapper variant: `white`. Layout: single column, centered `max-w-3xl`. The form uses all component primitives from design-system-spec-0A §3.4 (Input) and §3.5 (Select). Fields organized in a two-column grid at tablet+ (`grid-cols-1 md:grid-cols-2 gap-6`) for paired fields, with full-width fields for longer inputs. Field grouping: personal details row (name + company), location row (country + email), communication row (phone spanning full width), product details row (product interest select + quantity), specification row (fabric + GSM), customization requirements (full-width text area), message (full-width text area), file upload (full-width), honeypot (visually hidden), Turnstile widget (full-width). Submit button: primary Button md ("Send Inquiry"), disabled until form is valid; loading state with `aria-busy="true"` during submission. Below the form: a Turnstile or hCaptcha widget (per §8/§12 — awaiting orchestrator selection). Success state: the form is replaced by a success message with a WhatsApp shortcut. Error state: inline field errors using the error Input variant. Purpose: the primary inquiry conversion surface; captures all buyer specification data needed for a meaningful quotation response.

---

### B. Copy Source References

**Section 1 — Header**
- H1: ContentBlock `page: "home"`, `key: "hero.cta.primary"` — "Request a Quote" (reuse the CTA text as the page H1; it is the clearest possible statement of the page's purpose and traces to an approved ContentBlock)
- Context sentence: ContentBlock `page: "home"`, `key: "contact.message"` — "Tell us about your product category, quantity, fabric, GSM, colours, sizes, printing, embroidery, labels, packaging and required delivery timeline. Our team will review your inquiry and respond with the next steps."

**Section 2 — Form**
- Field labels: functional UI labels (Name, Company, Country, Email, Phone, Product Interest, Quantity, Fabric, GSM, Customization Requirements, Message) — these are structural UI copy, not marketing copy; no ContentBlock required. Developer authors them as standard form labels.
- Product Interest select options: `Category.name` values from DB (live query of published categories). Matches §8 spec: "product interest (select from live categories)."
- Country field: searchable select populated by a standard country list (ISO 3166 — no additional npm package required if implemented as a static JSON array in the codebase; flag to orchestrator if a country-picker library is preferred).
- File upload label: §8 · "file upload (reference images / tech packs — jpg/png/pdf)"
- MOQ note displayed below form: §14 · "Please contact us with your product and quantity requirements to receive a suitable MOQ and quotation." — embedded in the form's helper text beneath the Quantity field.
- Submit button label: "Send Inquiry" — functional label; no ContentBlock. Developer confirms with orchestrator.
- Success message: §14 · "WhatsApp: floating button + inline CTA → wa.me/923213995224?text=…" — success screen shows a WhatsApp shortcut link; WhatsApp number from SiteSettings `key: "whatsapp"`.

---

### C. Imagery Direction

**Section 1 — No images.** Dark navy.

**Section 2 — No images.** Form is the entire content surface. White SectionWrapper provides the clean background appropriate for a form.

No additional assets needed for this page.

---

### D. Motion & Component Assignments

**Section 1 — Header:**
- On-load fade-up. Same spring parameters as prior page heroes. Reduced-motion: instant render.

**Section 2 — Form:**
- `whileInView` on the form wrapper: fade-in Y 24px → 0, opacity 0 → 1, spring stiffness 70, damping 20, trigger `amount: 0.1`.
- Individual fields do not animate separately — the form is a functional tool, not a showcase; animating each field would impede usability.
- Input focus state: the native CSS ring transition from design-system-spec-0A §3.4 (`transition-colors duration-150`) handles field focus feedback — no Framer Motion needed.
- Success state transition: on successful submission, the form fades out (opacity 1 → 0, 300ms) and the success message fades in (opacity 0 → 1, 300ms, with Y 16px → 0). Spring stiffness 80, damping 20.
- Reduced-motion fallback: no form entry animation; instant success state swap.

**No Aceternity-specific components on this page.** The form is the conversion endpoint; adding decorative motion would distract from the task. The Moving Border CTA from the wider site is the buyer's path to this page — this page prioritizes form completion over visual spectacle.

---

### E. Responsive Behavior

**Mobile:**
- Section 1: `min-h-[25vh]`.
- Section 2: All form fields collapse to single column (`grid-cols-1`). Full-width inputs and selects. `px-container-x` gutters.
- Submit button: full width on mobile.
- Country searchable select: opens a native `<select>` on mobile (custom search interface requires interaction design refinement flagged for Phase 4).

**Tablet (md–lg):**
- Section 2: `md:grid-cols-2` activates for paired fields.

**Desktop (lg+):**
- `max-w-3xl` center-alignment; form is comfortable at this width without stretching inputs.

---

### F. Accessibility Notes

**Contrast pairs:**
- Section 1: White on navy (15.9:1). PASS.
- Section 2 form: All label text — navy on white (>14:1). All input text (navy on white) — >14:1. Placeholder text — ink-muted at 50% opacity on white: computed ~#A7B1BC on white = approximately 3.0:1 — note this is at the lower bound for large text (3:1) but below the 4.5:1 threshold for normal text. This is a known Tailwind pattern (`placeholder:text-ink-muted/50`). Developer should use `placeholder:text-ink-muted/60` instead to improve to ~3.5:1, or accept that placeholder text is supplementary and not the primary label (which passes at full ink-muted contrast). The `<label>` element provides full-contrast field identification. PASS for labels; placeholder is supplementary.
- Error state: crimson border — visual indicator; error message text in crimson on white: crimson (`#941C1D`) on white (`#FFFFFF`) = approximately 6.0:1. PASS.

**ARIA — full form compliance per design-system-spec-0A §3.4 and §3.5:**
- Every `<input>` and `<select>` paired with `<label for="...">` via explicit `id` association.
- Required fields: `required` HTML attribute + `aria-required="true"` + visual asterisk `<span aria-hidden="true">*</span>` in label.
- Error fields: `aria-invalid="true"` + `aria-describedby="[field-id]-error"` on input; error message `<p id="[field-id]-error" role="alert">`.
- File upload: `<input type="file" accept=".jpg,.jpeg,.png,.pdf" multiple aria-label="Upload reference images or tech packs (jpg, png, pdf, max 10MB each, up to 5 files)">`.
- Honeypot field: `aria-hidden="true"` on wrapper; `tabindex="-1"` on the field itself; visually hidden with `class="sr-only"` or absolute off-screen positioning.
- Turnstile/hCaptcha widget: the vendor's widget includes its own ARIA. Wrap in `<div role="group" aria-label="Human verification">`.
- Submit button: `type="submit"`. Loading state: `aria-busy="true"` + `disabled` attribute.
- Form element: `<form aria-labelledby="quote-form-heading" novalidate>` — `novalidate` disables browser native validation in favor of React Hook Form's Zod-validated inline errors.
- Success message region: `role="alert" aria-live="assertive"` so screen readers announce the success state immediately after form submission.
- Section 1: `<section aria-labelledby="quote-hero-heading">`.
- Section 2: `<section aria-labelledby="quote-form-heading">`.

---

## 11. Privacy Policy (`/privacy-policy`) and Terms & Conditions (`/terms`)

Both pages share a single layout template. Differences are noted at the end of each lettered section.

### A. Layout & Section Breakdown

**Template Section 1 — Page Header**
SectionWrapper variant: `dark`. `min-h-[20vh]`. Layout: centered single column — H1 (page title) + caption text showing the effective date (e.g., "Effective: [Date]"). Purpose: immediately identifies the legal document type; minimal visual weight appropriate for utility pages.

**Template Section 2 — Legal Content**
SectionWrapper variant: `white`. Layout: single narrow column (`max-w-2xl mx-auto`). Content: structured legal text using the site's typographic hierarchy — section headings as h2 (Cormorant Garamond, navy), sub-headings as h3, body as body text (Inter, ink-muted), numbered lists as `<ol>`, bulleted lists as `<ul>`. No motion, no decorative components. A sticky "Table of Contents" sidebar is not required at launch — single-scroll layout is appropriate given the document length. Purpose: presents the legal document in a clean, readable, accessible format consistent with the overall site design language.

**Differences between pages:**
- Privacy Policy: H1 = "Privacy Policy"; content covers data collection (inquiry form), data use, data retention, third-party processors (Cloudinary, Gmail SMTP/Resend, Vercel, Neon/Supabase/Railway), buyer rights, contact for data requests.
- Terms & Conditions: H1 = "Terms & Conditions"; content covers use of the website, intellectual property, limitation of liability, governing law (Pakistan), inquiry process terms, no e-commerce (informational site only).
- Effective date: Both pages show an effective date — developer inserts the launch date at build time or uses a SiteSettings record (flag to orchestrator: consider adding SiteSettings `key: "privacy-policy.effective-date"` and `key: "terms.effective-date"` for admin editability).

---

### B. Copy Source References

**Legal content for both pages:**
Per §9 of the master plan: "Generated boilerplate tailored to a Pakistan-based B2B manufacturer collecting inquiry data; clean legal template." The copy for Privacy Policy and Terms & Conditions is generated boilerplate — it does not trace to specific ContentBlock keys or verbatim §14 copy (§14 does not provide draft legal text). The design spec governs structure and typography only for these pages.

**Company details appearing within the legal text** (e.g., "This website is operated by MH Global Attire Ltd.") must source from SiteSettings:
- Company name: §14 · "MH Global Attire Ltd."
- Address: SiteSettings `key: "address"`
- Contact email for data inquiries: SiteSettings `key: "email.info"`
- Founding year (for "established" references): SiteSettings `key: "founded"`

All other legal body text is authored boilerplate by the development team per §9 guidance, tailored for a Pakistan-registered B2B manufacturer that collects contact and inquiry data via web forms and stores it in a managed PostgreSQL database.

---

### C. Imagery Direction

**Both pages — No images.** Legal content pages are typography-only. White SectionWrapper surface provides maximum readability. No decorative imagery, no Cloudinary assets needed.

---

### D. Motion & Component Assignments

**Both pages — No motion components.** Legal pages are utility documents. Adding scroll reveals or spring animations would undermine document accessibility and readability. The only transition is the global Lenis smooth scroll (active on all public pages) — this is acceptable.

Framer Motion page-entry transition (shared globally across all pages): a single full-page fade-in (opacity 0 → 1, 200ms linear) applied at the page wrapper level is acceptable. This is a global page-transition pattern, not a per-section animation decision, and it applies equally to legal pages.

Reduced-motion fallback: no page transition animation.

---

### E. Responsive Behavior

**Both pages — Mobile:**
- Section 1: `min-h-[15vh]`. H1 at `text-h3 md:text-h2` (legal page titles need less prominence than product pages).
- Section 2: Full width at `px-container-x`. `max-w-2xl` constraint centers on larger screens. Body text at 1rem (`text-body`) — no step-down on mobile; legal text requires full legibility.
- Line length remains comfortable on mobile within `max-w-2xl` because `px-container-x` (24px) gutters keep actual text width under 400px on small phones.

**Both pages — Tablet (md+):**
- Section 2: `max-w-2xl` with `md:px-8` creates comfortable centered column.

**Both pages — Desktop (lg+):**
- `max-w-2xl` centered in the white section; ample white space on either side reinforces the editorial quality of the legal text.

---

### F. Accessibility Notes

**Contrast pairs:**
- Section 1: White on navy (15.9:1). PASS.
- Section 2 Legal content: Ink-muted on white (7.5:1) for body. H2/H3 — navy on white (>14:1). PASS.

**Focus states:**
- Any hyperlinks within the legal text (e.g., "contact us at info@mhglobalattire.com"): `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson rounded-sm`. Email links: `<a href="mailto:info@mhglobalattire.com">` with the standard link focus ring.

**ARIA:**
- Both pages: `<main>` element wraps the two sections; legal pages do not require `<nav>` regions beyond the global Nav component.
- Section 1: `<section aria-labelledby="legal-page-heading">`. H1 carries the `id`.
- Section 2: `<section aria-labelledby="legal-content-heading">` if an h2 "Document Content" is present; otherwise `aria-label="Legal document content"`.
- `<ol>` and `<ul>` lists within the legal text do not require additional ARIA — native list semantics are sufficient.
- **Privacy Policy page:** Add `<meta name="robots" content="noindex, nofollow">` or export `{ robots: { index: false } }` in the page's Next.js Metadata. Legal pages should not be indexed. Developer implements this via the Metadata API for both pages.
- **Terms page:** Same robots noindex treatment.

**Differences between the two pages (F section):**
- Privacy Policy: the data-subject rights section may reference the right to contact `info@mhglobalattire.com` — that email link must have the standard `aria-label="Email us about your data rights at info@mhglobalattire.com"` for screen reader clarity.
- Terms & Conditions: no page-specific ARIA differences beyond the H1 id change (`id="terms-heading"` vs `id="privacy-heading"`).

---

## Global Component Notes Applicable to All Pages

**Floating WhatsApp Button**
Present on all 12 public pages. Position: `fixed bottom-6 right-6 z-modal` (z-index 100 — above content, below tooltips). Button: circular, 56px diameter, `bg-crimson hover:bg-crimson-600` rounded-full, white WhatsApp SVG icon (24px) centered. Link: `href="https://wa.me/923213995224?text=Hello%2C%20I%20am%20interested%20in%20your%20apparel%20manufacturing%20services"` — phone number from SiteSettings `key: "whatsapp"`. ARIA: `aria-label="Chat with MH Global Attire on WhatsApp"`. Focus ring: `focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-crimson`. On the Request a Quote page, the button may optionally be hidden to reduce visual competition with the primary form CTA (orchestrator decision).

**Page Body Offset**
All pages carry `pt-[4.5rem]` on the `<main>` element or the first SectionWrapper to prevent content from appearing behind the fixed 72px Nav, per design-system-spec-0A §3.8.

**Lenis Smooth Scroll**
Active globally on all public pages via the React context provider. No per-page configuration needed. `prefers-reduced-motion: reduce` disables Lenis smooth scroll and falls back to native browser scroll behavior.

**Global Page Transition**
Framer Motion wraps the page `<main>` content with `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` at 200ms linear ease. Applied consistently across all pages. `prefers-reduced-motion` fallback: `initial={{ opacity: 1 }}` (no transition). This is a global layout-level concern, not repeated in each page's Section D.

**Nav active link**
On every page, the Nav component marks the current route's link with `text-crimson` and `aria-current="page"` per design-system-spec-0A §3.8.

---

*End of document — MH Global Attire Public Pages Design Specification Phase 3A*

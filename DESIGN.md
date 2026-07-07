---
name: MH Global Attire
description: Editorial B2B manufacturing site for a custom apparel exporter — navy, crimson, cream, and confident serif/sans typography.
colors:
  navy: "#0A2240"
  navy-800: "#0D2A4E"
  crimson: "#941C1D"
  crimson-600: "#B02A28"
  cream: "#EDE6D6"
  cream-100: "#F5F1E8"
  white: "#FFFFFF"
  ink-muted: "#4A5568"
  line: "#D8CFBC"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "3.815rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  h1:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "3.052rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "2.441rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  h3:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "1.953rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  h4:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "1.563rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body-lg:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  caption:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.02em"
rounded:
  card: "0.75rem"
  btn: "0.375rem"
  badge: "0.25rem"
  input: "0.375rem"
spacing:
  section-y: "5rem"
  container-x: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.crimson}"
    textColor: "{colors.white}"
    rounded: "{rounded.btn}"
    padding: "0.75rem 1.75rem"
  button-primary-hover:
    backgroundColor: "{colors.crimson-600}"
  button-secondary-dark-host:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.btn}"
  button-secondary-cream-host:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    rounded: "{rounded.btn}"
---

# Design System: MH Global Attire

## 1. Overview

**Creative North Star: "The Manufacturer's Ledger"**

MH Global Attire's site reads like the print materials of an established, precise manufacturing house that happens to have an exceptional in-house designer: navy and crimson on cream, a serif display face for authority, a clean sans workhorse for every working detail (labels, specs, nav, forms). The mood is confident and unhurried — an international buyer should feel they've landed on the site of a manufacturer that has done this a very long time, not a startup trying to look established. Density is editorial-generous: large type, wide margins, one clear idea per section, never a cramped feature-grid.

This system explicitly rejects the generic manufacturer-template look (cramped stock-photo hero, feature-icon grids, drop-shadow-everything) and the generic SaaS-landing-page look (gradient-text headlines, hero-metric stat blocks, a tiny uppercase tracked eyebrow above every section, 01/02/03 numbering slapped on non-sequential content). Where a real sequence exists — the OEM 10-step workflow, the 9-stage manufacturing process — numbering is earned and used; nowhere else.

**Key Characteristics:**
- Navy-and-cream editorial base with crimson used sparingly as the single decisive accent
- Serif display type reserved strictly for headings (h1–h4); sans for every UI/body surface
- Motion is spring-physics-driven and purposeful (Aceternity-inspired reveals), never decorative filler, always with a static `prefers-reduced-motion` equivalent
- Flat-first surfaces; shadow used only as a soft ambient cue, not for drama

## 2. Colors

Warm, restrained, and confident: two ink colors (navy, crimson) doing all the identity work, laid over warm neutrals, with sparing tonal variants for depth on dark surfaces.

### Primary
- **Deep Ledger Navy** (`#0A2240`): the dominant dark surface — hero/CTA section backgrounds, footer, admin sidebar, primary text on light backgrounds. This is the "authority" color.
- **Ledger Navy Deep** (`#0D2A4E`): one step darker/richer than navy — used for hover/active states on navy surfaces and to give dark-on-dark sections (nested panels within a navy section) a subtle layer of depth.

### Secondary
- **Signature Crimson** (`#941C1D`): the single decisive accent — primary CTA buttons, active nav underline, crimson rule accents, the sustainability/CTA band fill. Used sparingly; when crimson appears, it should be the only crimson thing in view.
- **Crimson Deep** (`#B02A28`): hover/active state for crimson elements — always paired with crimson, never used standalone as a base color.

### Neutral
- **Warm Ledger Cream** (`#EDE6D6`): primary light-section background — the paper the navy ink sits on.
- **Cream Paper** (`#F5F1E8`): a slightly lighter, cooler cream used for subsections nested within a cream section (badges, alternating rows) to create depth without a hard border.
- **Pure White** (`#FFFFFF`): card/panel backgrounds, form fields, and the "white" SectionWrapper variant — the cleanest surface in the system, reserved for content that needs maximum contrast (product photography panels, data tables).
- **Ink Muted** (`#4A5568`): body text and secondary copy on light backgrounds — never pure black, always this warm-leaning gray so cream/white surfaces stay soft.
- **Ledger Line** (`#D8CFBC`): all hairline borders, dividers, and disabled states — a warm neutral that recedes rather than competes with content.

### Named Rules
**The One Accent Rule.** Crimson is the only saturated color in the system. If a section needs two accents, the second "accent" is navy at full ink strength, not a second hue — introducing a second saturated color anywhere is a rejection of this system, full stop.

## 3. Typography

**Display Font:** Cormorant Garamond (with Georgia, serif fallback)
**Body Font:** Inter (with system-ui, sans-serif fallback)

**Character:** A high-contrast pairing on purpose — Cormorant Garamond's high-contrast serif strokes read as editorial authority at large sizes, while Inter stays completely out of the way for every working UI surface (labels, specs, buttons, nav, forms, data). The two fonts never compete because they never appear at the same job: display face is headings only, full stop.

### Hierarchy
- **Display** (700, 3.815rem / 61px, line-height 1.1, letter-spacing -0.02em): reserved for the single largest headline on a page (typically the Home hero H1 only).
- **H1** (700, 3.052rem / 49px, line-height 1.15): page-level headline, one per page.
- **H2** (700, 2.441rem / 39px, line-height 1.2): section headings.
- **H3** (700, 1.953rem / 31px, line-height 1.25): sub-section headings, card group titles.
- **H4** (700, 1.563rem / 25px, line-height 1.3): card-level headings (product names, stage labels).
- **Body-lg** (400, 1.25rem / 20px, line-height 1.6): hero subheadings, lead paragraphs — capped at ~70ch.
- **Body** (400, 1rem / 16px, line-height 1.65): all standard prose — capped at 65–75ch.
- **Caption** (400, 0.8rem / 12.8px, line-height 1.5, letter-spacing 0.02em): metadata, timestamps, helper text, badge labels.

### Named Rules
**The Display-Is-Headings-Only Rule.** Cormorant Garamond (`font-display`) appears exclusively on h1–h4 and the display step. It must never appear on a button label, badge, nav link, form label, input, caption, or any other UI control — no exceptions, even for "just one stylistic flourish."

## 4. Elevation

Flat by default. This system conveys depth through color layering (navy → navy-800 → crimson) and generous whitespace, not shadow. Shadow appears only as a soft ambient cue under a small number of raised surfaces (cards, modals) — never as a dramatic drop-shadow effect, never on flat page sections.

### Shadow Vocabulary
- **card** (`0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(10,34,64,0.08)`): the default resting shadow for any card/panel on a light surface — soft and barely-there, a lift cue rather than a design statement.
- **card-dark** (`0 2px 8px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.35)`): the equivalent resting shadow for a card/panel placed on a dark (navy) surface, where the light shadow recipe would be invisible.

### Named Rules
**The Ambient-Not-Dramatic Rule.** If a shadow is noticeable before the content it's supporting, it's too strong — soften it. Shadows exist to separate a card from its background, never to be the visual event.

## 5. Components

### Buttons
- **Shape:** rounded corners at 0.375rem (`rounded-btn`) — a small, confident radius, never pill-shaped, never sharp.
- **Primary:** crimson (`#941C1D`) background, white text, padding ~0.75rem/1.75rem; hover deepens to crimson-600 (`#B02A28`). This is the "Request a Quote" button everywhere it appears.
- **Secondary (dark-host):** transparent background, white border and text — used on navy/crimson surfaces so it reads clearly against a dark backdrop.
- **Secondary (cream-host):** transparent background, navy border and text — used on cream/white surfaces. Never mix contexts: a cream-host secondary button on a dark surface is invisible and prohibited.
- **Ghost:** no border, text-only, used for tertiary actions ("Explore Our Products" next to a primary CTA).
- **Hover/Focus:** color-only transitions (150–200ms), plus a visible `focus-visible` ring in the surface's ink color — never remove focus outlines.

### Cards
- **Corner Style:** 0.75rem radius (`rounded-card`) — noticeably softer than buttons, giving cards a calmer, more restful presence.
- **Background:** white on light/cream sections; navy-800 on dark sections.
- **Shadow Strategy:** `card` shadow on light-hosted cards, `card-dark` on dark-hosted cards (see Elevation).
- **Border:** none by default; a hairline `line` (`#D8CFBC`) border only when a card sits directly against a same-color background with no shadow separation.
- **Internal Padding:** generous — minimum 1.5rem, typically 2rem+, never cramped.

### Badges
- **Style:** 0.25rem radius (`rounded-badge`), caption-scale uppercase text with 0.08em tracking, low-saturation background (`line` or navy/10%) — badges inform, they never shout.

### Inputs / Fields
- **Style:** 0.375rem radius (`rounded-input`), white background, `line`-colored border at rest.
- **Focus:** border shifts to navy or crimson (context-dependent) with a visible focus ring — never a bare color-only focus cue.
- **Error:** crimson border plus a crimson-on-white error message beneath the field, never color-alone.

### Navigation
- Sticky, white or navy background depending on scroll/page context, Inter for every link, active route indicated by an underline/color change (`aria-current="page"`) rather than a background pill. Mobile collapses to a slide-in drawer from the same navy family, never a generic hamburger-overlay-on-white.

### Section Wrapper (signature layout primitive)
Every page section commits to exactly one of three hosts — `light` (cream), `dark` (navy), `white` — and every component inside inherits the correct color-context variant automatically (e.g., a secondary button always knows whether it's on a dark or cream host). This is the mechanism that prevents the single most common failure mode in this system: a component styled for the wrong background.

## 6. Do's and Don'ts

### Do:
- **Do** keep crimson to a single decisive appearance per section — one CTA, one rule, one accent moment.
- **Do** use Cormorant Garamond exclusively for h1–h4 and the display step; Inter everywhere else, no exceptions.
- **Do** give every animated element a `prefers-reduced-motion` static equivalent that preserves full information and layout, not just "animation removed."
- **Do** reserve numbered sequences (1, 2, 3…) for content that is a genuine, ordered sequence — the OEM workflow, the manufacturing stages.
- **Do** keep shadows soft and ambient (`card` / `card-dark` only); depth comes from navy/crimson/cream layering, not drop-shadow drama.

### Don't:
- **Don't** use gradient text (`background-clip: text` with a gradient) — this system uses solid ink colors only; emphasis comes from weight and size.
- **Don't** add a tiny uppercase tracked "eyebrow" label above every section — this is the generic SaaS-landing-page tell this system explicitly rejects.
- **Don't** slap 01/02/03 numbering on sections that aren't a real sequence — numbering is earned, not decorative scaffolding.
- **Don't** use `border-left`/`border-right` as a colored accent stripe on cards or list items — use full borders, background tints, or nothing.
- **Don't** apply a cream-host secondary button (navy border/text) on a navy or crimson surface, or vice versa — always match the button variant to its SectionWrapper host.
- **Don't** invent marketing copy, statistics, client counts, or certifications — every word must trace to the approved content library or seeded CMS content. The Sustainability page in particular must never claim an achieved/verified certification — "developing practices" framing only.

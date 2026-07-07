# MH Global Attire — Design System Specification
**Phase 0A · Version 1.0 · 2026-07-03**
**Agent:** ui-designer · Skill: design-taste-frontend
**Status:** Implementation-ready. Every value is locked. Frontend-dev implements verbatim.

---

## WCAG AA CONTRAST RATIOS — REQUIRED VERIFICATION

All five pairs calculated against WCAG 2.1 relative luminance formula.
Normal text threshold: 4.5:1. Large text threshold: 3.0:1.

| Pair | Foreground | Background | Ratio | AA Normal | AA Large |
|---|---|---|---|---|---|
| White on Navy | #FFFFFF | #0A2240 | **15.9:1** | PASS | PASS |
| White on Crimson | #FFFFFF | #941C1D | **8.6:1** | PASS | PASS |
| Ink-muted on Cream | #4A5568 | #EDE6D6 | **6.0:1** | PASS | PASS |
| Navy on Cream-100 | #0A2240 | #F5F1E8 | **14.2:1** | PASS | PASS |
| Ink-muted on White | #4A5568 | #FFFFFF | **7.5:1** | PASS | PASS |

Additional verified pairs used in components:
- White on Crimson-600 (#B02A28): **6.6:1** PASS
- Ink-muted on Cream-100 (#F5F1E8): **6.7:1** PASS
- Ink-muted on Line (#D8CFBC): **4.9:1** PASS (badge muted variant — qualifies as large text due to uppercase + tracking, so 3:1 threshold applies; 4.9:1 exceeds even normal-text threshold)

---

## TYPEFACE SELECTION

**Display/Heading serif: Cormorant Garamond**
Rationale: The "MH" monogram in the logo uses an extreme thick/thin stroke contrast with ultra-hairline serifs and narrow, aristocratic capital proportions. Cormorant Garamond is the only candidate that replicates this exact visual signature, reinforcing logo coherence throughout all headings and confirming the premium, heritage-manufacturer register expected by international export buyers.

**Body/UI geometric sans: Inter**
Rationale: The "GLOBAL ATTIRE" banner lettering uses evenly-spaced, neutral geometric capitals with no humanist variation. Inter's clean geometric construction, comprehensive weight range (400–700), and exceptional screen legibility at all sizes from caption to large display make it the definitive choice for all UI surfaces where the display serif is prohibited.

---

## DELIVERABLE 1 — TAILWIND CONFIG EXTENSION

Place the following as the value of `theme.extend` inside `tailwind.config.ts`.
The file must import `type Config from 'tailwindcss'` and export a Config-typed object.

```typescript
extend: {
  colors: {
    navy:           '#0A2240',
    'navy-800':     '#0D2A4E',
    crimson:        '#941C1D',
    'crimson-600':  '#B02A28',
    cream:          '#EDE6D6',
    'cream-100':    '#F5F1E8',
    white:          '#FFFFFF',
    'ink-muted':    '#4A5568',
    line:           '#D8CFBC',
  },

  fontFamily: {
    display: ['var(--font-display)', 'Georgia', 'serif'],
    sans:    ['var(--font-sans)',    'system-ui', 'sans-serif'],
  },

  fontSize: {
    'display': ['3.815rem', { lineHeight: '1.1',  letterSpacing: '-0.02em',  fontWeight: '700' }],
    'h1':      ['3.052rem', { lineHeight: '1.15', letterSpacing: '-0.02em',  fontWeight: '700' }],
    'h2':      ['2.441rem', { lineHeight: '1.2',  letterSpacing: '-0.015em', fontWeight: '700' }],
    'h3':      ['1.953rem', { lineHeight: '1.25', letterSpacing: '-0.01em',  fontWeight: '700' }],
    'h4':      ['1.563rem', { lineHeight: '1.3',  letterSpacing: '-0.01em',  fontWeight: '700' }],
    'body-lg': ['1.250rem', { lineHeight: '1.6',  letterSpacing: '0em',      fontWeight: '400' }],
    'body':    ['1.000rem', { lineHeight: '1.65', letterSpacing: '0em',      fontWeight: '400' }],
    'caption': ['0.800rem', { lineHeight: '1.5',  letterSpacing: '0.02em',   fontWeight: '400' }],
  },

  spacing: {
    'section-y':   '5rem',
    'container-x': '1.5rem',
  },

  borderRadius: {
    card:  '0.75rem',
    btn:   '0.375rem',
    badge: '0.25rem',
    input: '0.375rem',
  },

  boxShadow: {
    card:        '0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(10, 34, 64, 0.08)',
    'card-dark': '0 2px 8px rgba(0, 0, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.35)',
  },

  zIndex: {
    behind:  '-1',
    nav:     '50',
    modal:   '100',
    tooltip: '200',
  },

  screens: {
    sm:    '640px',
    md:    '768px',
    lg:    '1024px',
    xl:    '1280px',
    '2xl': '1536px',
  },
},
```

**Notes:**
- `screens` values match Tailwind v3 defaults exactly. Confirmed here so they are not altered without a documented reason.
- `fontFamily.sans` overrides Tailwind's default `font-sans` utility. This is intentional — `font-sans` resolves to Inter everywhere.
- `white: '#FFFFFF'` duplicates Tailwind's built-in default. Included so all 9 brand tokens appear in the config and the styleguide reference table.
- `fontSize` custom steps coexist with Tailwind defaults (xs, sm, base, lg, xl, 2xl etc.). No conflicts.

---

## DELIVERABLE 2 — GLOBAL CSS & TYPOGRAPHY SYSTEM

### 2A. next/font Import Block (place at top of `app/layout.tsx`)

```typescript
import { Cormorant_Garamond, Inter } from 'next/font/google'

const cormorantGaramond = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300', '400', '600', '700'],
  style:    ['normal', 'italic'],
  variable: '--font-display',
  display:  'swap',
})

const inter = Inter({
  subsets:  ['latin'],
  weight:   ['400', '500', '600', '700'],
  style:    ['normal'],
  variable: '--font-sans',
  display:  'swap',
})
```

The `<html>` element in the layout's return must carry both variable class names:

```typescript
<html lang="en" className={`${cormorantGaramond.variable} ${inter.variable}`}>
```

This injects `--font-display` and `--font-sans` as CSS custom properties on `<html>`, available globally. The Tailwind `fontFamily.display` and `fontFamily.sans` entries reference these exact variable names.

**Weight rationale:**
- Cormorant Garamond 300: display hero step only — extreme hairline elegance
- Cormorant Garamond 400/600/700: headings h1–h4 at normal, semibold, bold
- Inter 400/500/600/700: body text, UI labels, nav links, buttons, badges, captions, form elements

### 2B. Type Scale — 1.25 Modular Ratio, Base 16px

Scale formula: each step = previous step × 1.25. Base = 16px. Values calculated to 3 decimal places.

| Step | rem | px | Line-Height | Font-Weight | Letter-Spacing | Font Family |
|---|---|---|---|---|---|---|
| `display` | 3.815rem | 61.035px | 1.1 | 700 | -0.02em | Cormorant Garamond |
| `h1` | 3.052rem | 48.828px | 1.15 | 700 | -0.02em | Cormorant Garamond |
| `h2` | 2.441rem | 39.063px | 1.2 | 700 | -0.015em | Cormorant Garamond |
| `h3` | 1.953rem | 31.250px | 1.25 | 700 | -0.01em | Cormorant Garamond |
| `h4` | 1.563rem | 25.000px | 1.3 | 700 | -0.01em | Cormorant Garamond |
| `body-lg` | 1.250rem | 20.000px | 1.6 | 400 | 0em | Inter |
| `body` | 1.000rem | 16.000px | 1.65 | 400 | 0em | Inter |
| `caption` | 0.800rem | 12.800px | 1.5 | 400 | +0.02em | Inter |

**Enforcement rule — ABSOLUTE:** `font-display` (Cormorant Garamond via `var(--font-display)`) is assigned exclusively to the `display`, `h1`, `h2`, `h3`, `h4` steps and to the `<h1>`–`<h4>` HTML elements. It must never appear on: body text, body-lg text, caption text, nav links, button labels, badge labels, form labels, form inputs, select elements, footer text, table cells, breadcrumbs, tab labels, or any UI control of any kind.

### 2C. Complete `app/globals.css` Content

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ─────────────────────────────────────────────────────────────
   ROOT TOKENS
   All 9 brand color tokens as CSS custom properties.
   Hex values are locked. Match master plan §3 exactly.
───────────────────────────────────────────────────────────── */
:root {
  --navy:          #0A2240;
  --navy-800:      #0D2A4E;
  --crimson:       #941C1D;
  --crimson-600:   #B02A28;
  --cream:         #EDE6D6;
  --cream-100:     #F5F1E8;
  --white:         #FFFFFF;
  --ink-muted:     #4A5568;
  --line:          #D8CFBC;

  /* Font stack fallbacks — overridden at runtime by
     next/font CSS variables injected on <html>          */
  --font-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --font-sans:    'Inter', system-ui, -apple-system, sans-serif;
}

/* ─────────────────────────────────────────────────────────────
   BASE LAYER
───────────────────────────────────────────────────────────── */
@layer base {
  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  body {
    background-color: var(--cream);
    color: var(--ink-muted);
    font-family: var(--font-sans), system-ui, sans-serif;
    font-size: 1rem;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1,
  h2,
  h3,
  h4 {
    font-family: var(--font-display), Georgia, serif;
    font-weight: 700;
    color: var(--navy);
  }

  /* h5 and h6 use the sans stack — below the heading serif threshold */
  h5,
  h6 {
    font-family: var(--font-sans), system-ui, sans-serif;
    font-weight: 600;
    color: var(--navy);
  }

  a {
    color: var(--crimson);
    text-decoration: none;
    transition: color 150ms ease;
  }

  a:hover {
    color: var(--crimson-600);
  }

  ::selection {
    background-color: var(--crimson);
    color: var(--white);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  img,
  video {
    max-width: 100%;
    height: auto;
    display: block;
  }
}
```

---

## DELIVERABLE 3 — COMPONENT PRIMITIVE SPECIFICATIONS

All class names reference Tailwind keys from Deliverable 1 exactly. State transitions use `transition-colors duration-150 ease-in-out` unless noted. Specs are written so the developer copies class strings verbatim with no design judgment required.

---

### 3.1 Button

**Default HTML element:** `<button type="button">`. Use `type="submit"` when inside a `<form>`.

**Base class string — applied to ALL variants and ALL sizes:**
```
inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide
rounded-btn transition-colors duration-150 ease-in-out
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
```

**Variant class strings — append to base:**

| Variant | Context | Default | Hover | Active | Focus Ring |
|---|---|---|---|---|---|
| `primary` | any | `bg-crimson text-white` | `hover:bg-crimson-600` | `active:bg-crimson-600` | `focus-visible:ring-crimson` |
| `secondary` | on cream/white bg | `bg-transparent border-2 border-navy text-navy` | `hover:bg-navy hover:text-white` | `active:bg-navy active:text-white` | `focus-visible:ring-navy` |
| `secondary` | on navy bg | `bg-transparent border-2 border-white text-white` | `hover:bg-white hover:text-navy` | `active:bg-white active:text-navy` | `focus-visible:ring-white` |
| `ghost` | on cream/white bg | `bg-transparent text-crimson` | `hover:bg-cream-100` | `active:bg-line` | `focus-visible:ring-crimson` |

The `secondary` variant has two context configurations. Developer selects based on the host SectionWrapper variant: use `border-navy text-navy` on `light` or `white` SectionWrapper; use `border-white text-white` on `dark` SectionWrapper.

**Size variant class strings — append to base + variant:**

| Size | Classes | Resolved font | Resolved padding |
|---|---|---|---|
| `sm` | `text-sm px-4 py-2` | 0.875rem | 1rem × 0.5rem |
| `md` | `text-body px-6 py-3` | 1.000rem | 1.5rem × 0.75rem |
| `lg` | `text-body-lg px-8 py-4` | 1.250rem | 2rem × 1rem |

`text-body` and `text-body-lg` reference the custom fontSize tokens from Deliverable 1. Button labels always render in Inter (font-sans). Cormorant Garamond must never appear on button text.

**All states:**

| State | Visual behavior |
|---|---|
| Default | As defined per variant above |
| Hover | Color shift per variant above |
| Focus-visible | 2px ring, 2px offset, ring color per variant |
| Active | Darkened state per variant above |
| Disabled | `opacity-50`, `cursor-not-allowed`, all interactions suspended via `pointer-events-none` |
| Loading | Implementer adds spinner icon inside button, sets `aria-busy="true"`, applies `disabled` attribute; button label text remains visible |

**Aria requirements:**
- Use `disabled` HTML attribute (not `aria-disabled` alone) when disabled
- Add `aria-busy="true"` in loading state
- Add `aria-label="[description]"` if button contains no visible text (icon-only)
- No `role` override needed — native `<button>` carries implicit `role="button"`

**Keyboard:** Tab to focus. Enter or Space to activate. Preserved by native `<button>` element.

---

### 3.2 Card

**Default HTML element:** `<article>` when card represents a content entity; `<div>` when purely a layout container.

**Variant: `default` (cream-100 surface on cream page)**

Full class string:
```
bg-cream-100 rounded-card border border-line shadow-card p-8
```

Resolved values:
- Background: `#F5F1E8`
- Border: 1px solid `#D8CFBC`
- Shadow: `0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(10,34,64,0.08)`
- Radius: `0.75rem`
- Padding: `2rem` all sides

Heading color inside: inherits global `color: var(--navy)` from `@layer base` — no override needed.
Body text inside: inherits global `color: var(--ink-muted)` — no override needed.

If the card is interactive/clickable, add: `cursor-pointer transition-shadow duration-200 hover:shadow-[0_4px_20px_rgba(10,34,64,0.14)]`

**Variant: `dark` (navy-800 surface on navy page)**

Full class string:
```
bg-navy-800 rounded-card shadow-card-dark p-8
text-white
[&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white
```

Resolved values:
- Background: `#0D2A4E`
- No border (shadow provides elevation separation from navy page bg)
- Shadow: `0 2px 8px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.35)`
- Radius: `0.75rem`
- Padding: `2rem` all sides

`text-white` on the card root cascades to all children. The `[&_h*]:text-white` arbitrary variants override the global `color: var(--navy)` from `@layer base` — required, or headings would be invisible. For de-emphasised body text inside dark cards, add `text-white/70` to the specific paragraph element.

**Aria requirements:** If the entire card is clickable as a unit, prefer wrapping only the heading in an `<a>` element and keeping the card non-interactive (avoids nested interactive element issues). If the whole card must be clickable, wrap in `<a>` or add `role="link" tabIndex={0}` with an `onKeyDown` Enter handler.

---

### 3.3 Badge

**Default HTML element:** `<span>`

**Base class string — applied to ALL variants:**
```
inline-flex items-center font-sans font-semibold uppercase tracking-[0.08em]
text-[0.6875rem] px-3 py-1 rounded-badge
```

`text-[0.6875rem]` = 11px. At this size with uppercase and 0.08em tracking the text qualifies as visually large under WCAG 2.1 (bold uppercase > 14px bold or 18px normal threshold is the formal rule; the muted variant's 4.9:1 ratio clears the standard normal-text 4.5:1 threshold regardless). Font is always Inter — Cormorant Garamond is forbidden on badges.

**Variant class strings — append to base:**

| Variant | BG | Text | Addition |
|---|---|---|---|
| `navy` | `#0A2240` | `#FFFFFF` | `bg-navy text-white` |
| `crimson` | `#941C1D` | `#FFFFFF` | `bg-crimson text-white` |
| `muted` | `#D8CFBC` | `#4A5568` | `bg-line text-ink-muted` |

**States:** Badges are non-interactive by default — no hover or focus states. If used as a filter toggle, replace `<span>` with `<button>` and add `hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1` with `aria-pressed="true|false"`.

---

### 3.4 Input

**Default HTML element:** `<input>` always paired with `<label>` via explicit `for`/`id` association. Error messages use `<p>` with `role="alert"`.

**Wrapper:** `<div class="flex flex-col gap-1.5">`

**Label class string:**
```
font-sans text-sm font-medium text-navy
```

**Input class string — rest state:**
```
w-full bg-white font-sans text-body text-navy rounded-input
border border-line px-4 py-3
placeholder:text-ink-muted/50
transition-colors duration-150 ease-in-out
focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy
```

**Additional classes for error state** (append when `aria-invalid="true"`):
```
border-crimson focus:ring-crimson/20 focus:border-crimson
```

**All states:**

| State | Border | Focus Ring | Text |
|---|---|---|---|
| Rest | `border-line` (#D8CFBC) | none | `text-navy` |
| Focused | `border-navy` (#0A2240) | 2px `ring-navy/20` | `text-navy` |
| Error | `border-crimson` (#941C1D) | 2px `ring-crimson/20` | `text-navy` |
| Error + Focused | `border-crimson` | 2px `ring-crimson/20` | `text-navy` |
| Disabled | `border-line opacity-50 cursor-not-allowed bg-cream` | none | `text-ink-muted` |

**Error message element class string:**
```
font-sans text-caption text-crimson
```

**Aria requirements:**
- `<label for="field-id">Label Text</label>`
- `<input id="field-id" name="fieldName" aria-invalid="false">` (switch to `"true"` on error)
- `aria-describedby="field-id-error"` on the input when error is present
- `<p id="field-id-error" role="alert">Error message here</p>`
- `required` HTML attribute for required fields; pair with `aria-required="true"` on the input and a visual asterisk `<span aria-hidden="true">*</span>` in the label

---

### 3.5 Select

**Default HTML element:** `<select>` inside a relative-positioned wrapper div.

**Outer wrapper class string:**
```
relative
```

**Select element class string — rest state:**
```
w-full appearance-none bg-white font-sans text-body text-navy rounded-input
border border-line px-4 py-3 pr-10
transition-colors duration-150 ease-in-out cursor-pointer
focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy
```

**Additional classes for error state** (append when `aria-invalid="true"`):
```
border-crimson focus:ring-crimson/20 focus:border-crimson
```

State behavior for rest / focused / error / error+focused / disabled is identical to Input (Section 3.4). Apply the same state class logic.

**Chevron wrapper — positioned absolutely inside the outer wrapper:**
```
pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3
```

**Chevron SVG — render inside the chevron wrapper:**
```html
<svg
  class="h-4 w-4 text-navy"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="currentColor"
  aria-hidden="true">
  <path
    fill-rule="evenodd"
    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 
       111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
    clip-rule="evenodd" />
</svg>
```

`text-navy` sets `currentColor` to `#0A2240`. The chevron is non-interactive (`pointer-events-none`) and decorative (`aria-hidden="true"`).

**Label class string:** Identical to Input: `font-sans text-sm font-medium text-navy`

**Wrapper for label + select pair:** `<div class="flex flex-col gap-1.5">`

**Aria requirements:**
- `<label for="select-id">Label Text</label>`
- `<select id="select-id" name="fieldName" aria-invalid="false">`
- First option: `<option value="" disabled selected>Select an option</option>` as placeholder
- `aria-describedby="select-id-error"` when error present
- `required` + `aria-required="true"` for required selects

---

### 3.6 SectionWrapper

**Default HTML element:** `<section>`

Full-viewport-width horizontal strip. Always a direct child of the page. A Container (3.7) is placed inside when content needs max-width constraint.

**Variant class strings:**

| Variant | Full class string |
|---|---|
| `light` | `w-full bg-cream py-section-y` |
| `dark` | `w-full bg-navy py-section-y text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white` |
| `white` | `w-full bg-white py-section-y` |

**Vertical padding:** `py-section-y` = `padding-top: 5rem; padding-bottom: 5rem` (80px each).
On mobile, developer applies `py-10 md:py-section-y` for responsive reduction:
- `py-10` = 2.5rem (40px) on mobile
- `py-section-y` = 5rem (80px) at md and above

**Dark variant heading override — critical:** The arbitrary variants `[&_h1]:text-white` through `[&_h4]:text-white` are mandatory on the dark variant. Without them, the global `color: var(--navy)` from `@layer base` makes all headings invisible on the navy background.

**Aria requirements:** Each section must have `aria-labelledby="[heading-id]"` or `aria-label="[descriptive name]"` for screen reader landmark navigation.

---

### 3.7 Container

**Default HTML element:** `<div>`

**Full class string:**
```
w-full max-w-[1280px] mx-auto px-container-x md:px-8 lg:px-12
```

Resolved gutter values:
- `px-container-x` = 1.5rem (24px) — mobile
- `md:px-8` = 2rem (32px) — tablet
- `lg:px-12` = 3rem (48px) — desktop

Max content width: 1280px. `mx-auto` centers within the full-width SectionWrapper.

The Container is always the first and only direct child of a SectionWrapper. All page content nests inside the Container.

No aria requirements. It is a layout wrapper with no semantic meaning.

---

### 3.8 Nav

**Default HTML element:** `<header>` as outermost wrapper; `<nav>` inside.
**Behavior:** Fixed to top of viewport; stays in place during scroll.

**Outer header class string:**
```
fixed top-0 left-0 right-0 z-nav bg-navy border-b border-navy-800
```

`z-nav` resolves to `z-index: 50`. Modal (100) and tooltip (200) z-values exceed this, ensuring overlays appear above the nav.

**Inner flex container (height + layout):**
```
h-[4.5rem] flex items-center justify-between
px-container-x md:px-8 lg:px-12
max-w-[1280px] mx-auto w-full
```

Height: `h-[4.5rem]` = 72px.

**Logo element:**
Until the vector SVG is available, render the JPEG with a CSS filter to produce a white appearance on navy:
```html
<a href="/" aria-label="MH Global Attire — Return to Homepage">
  <img
    src="/mhgloballogo.jpeg"
    alt="MH Global Attire"
    class="h-12 w-auto filter brightness-0 invert"
    width="144"
    height="48" />
</a>
```
Replace with white SVG logo when vectorised. Remove the filter at that point.

**Desktop nav links — hidden below lg, visible at lg+:**

Wrapper:
```
hidden lg:flex items-center gap-8
```

Individual link:
```
font-sans text-sm font-medium text-white/90
hover:text-crimson transition-colors duration-150
```

Active link (current page): replace `text-white/90` with `text-crimson`. Add `aria-current="page"`.

**Desktop CTA — right of nav links, visible at lg+:**
Primary Button, `sm` size, label "Request a Quote".

**Mobile hamburger button — visible below lg, hidden at lg+:**

Class string:
```
flex lg:hidden items-center justify-center w-10 h-10 rounded-btn
text-white hover:text-crimson transition-colors duration-150
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
```

Aria attributes:
- `aria-label="Toggle navigation menu"`
- `aria-expanded="false"` → `"true"` when menu open
- `aria-controls="mobile-nav"`

Icon: 24×24px hamburger icon (three horizontal lines) when closed; X icon when open. Both in `currentColor`.

**Mobile navigation panel:**

Closed state class: `hidden`
Open state class:
```
block bg-navy border-t border-navy-800 py-4
```

The panel expands below the header, not as a modal overlay.

Panel aria attributes:
- `id="mobile-nav"`
- `aria-hidden="true"` when closed; `"false"` when open

Mobile link class string:
```
block font-sans text-base font-medium text-white/90
px-container-x md:px-8 py-3
hover:text-crimson hover:bg-navy-800 transition-colors duration-150
```

Active mobile link: add `text-crimson` and `aria-current="page"`.

**Page body offset:** Add `pt-[4.5rem]` to the `<body>` or first `<main>` element to prevent content from hiding behind the fixed nav.

**Full aria structure:**
```html
<header role="banner">
  <nav aria-label="Main navigation">
    <!-- logo link, desktop links, desktop CTA, hamburger button -->
  </nav>
  <div id="mobile-nav" aria-hidden="true">
    <!-- mobile link list -->
  </div>
</header>
```

---

### 3.9 Footer

**Default HTML element:** `<footer>`

**Outer footer class string:**
```
w-full bg-navy text-white
```

**Top border divider (first child inside footer, or immediately before footer):**
```
border-t border-cream-100/20
```

Renders a hairline line using cream-100 at 20% opacity on navy — a subtle warm-tinted separator.

**Inner content:** Use the Container component (3.7) for max-width constraint.

**Content grid layout:**
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8
```

Collapses to single column on mobile; 4 columns on desktop.

**Column heading class string (uses Inter — serif forbidden in footer):**
```
font-sans text-sm font-semibold text-white uppercase tracking-[0.08em] mb-4
```

**Body text in footer:**
```
font-sans text-sm text-white/70 leading-relaxed
```

**Footer link class string:**
```
font-sans text-sm text-white/70
hover:text-crimson transition-colors duration-150
```

**Footer bottom bar (copyright strip):**
```
border-t border-cream-100/10 mt-12 pt-6 pb-8
flex flex-col sm:flex-row items-center justify-between gap-4
font-sans text-caption text-white/50
```

**Aria requirements:**
- `<footer role="contentinfo">` — implicit for top-level `<footer>`
- Group footer nav links in `<nav aria-label="Footer navigation">`
- Social icon links: `aria-label="MH Global Attire on [Platform Name]"` on each

---

## DELIVERABLE 4 — /STYLEGUIDE PAGE FULL SPECIFICATION

**Route:** `app/styleguide/page.tsx`
**Page metadata title:** "Design System — MH Global Attire"
**Robots:** `noindex` — add to the page's `export const metadata` so the styleguide does not appear in search results or sitemap.
**Component type:** Server Component. No client-side interactivity required.

**Page outer wrapper:**
```html
<div class="bg-white min-h-screen">
  <!-- All sections below -->
</div>
```

This prevents the global body cream background from bleeding between sections.

---

### Page Header Block (above Section 1)

SectionWrapper variant: `light` (bg-cream py-section-y)
Container inside: max-w-[1280px] mx-auto px-container-x md:px-8 lg:px-12

Content inside Container:
```html
<p class="font-sans text-caption text-ink-muted uppercase tracking-[0.1em] mb-3">
  Phase 0A · Design System Approval Preview · Version 1.0 · 2026-07-03
</p>
<h1 class="font-display text-h1 text-navy">
  MH Global Attire Design System
</h1>
<p class="font-sans text-body-lg text-ink-muted mt-4 max-w-xl">
  Complete token reference, typography scale, component primitives, and usage
  patterns for approval before Phase 0B build begins.
</p>
```

`font-display` resolves to Cormorant Garamond via `var(--font-display)`.

---

### Section 1 — Color Palette

**SectionWrapper variant:** `white` (bg-white py-section-y)
**Container inside:** standard

**Section heading:**
```html
<h2 class="font-display text-h3 text-navy mb-10">01 · Color Palette</h2>
```

**Swatch grid layout:**
```
grid grid-cols-3 lg:grid-cols-9 gap-4
```

**Each swatch structure:**
```html
<div>
  <div
    class="w-full h-[120px] rounded-card [border-class-if-light-swatch]"
    style="background-color: [HEX]">
  </div>
  <div class="mt-3 space-y-0.5">
    <p class="font-sans text-xs font-semibold text-navy">--[variable-name]</p>
    <p class="font-sans text-caption text-ink-muted">[HEX]</p>
    <p class="font-mono text-caption text-ink-muted/70">[tailwind-key]</p>
  </div>
</div>
```

Swatch dimensions: `w-full` (fills grid column) × `h-[120px]`. At lg:grid-cols-9 on a 1280px container with 3rem gutters, each swatch is approximately 112px wide.

**Nine swatches in render order:**

| # | CSS Variable | Hex | Tailwind Key | Swatch border |
|---|---|---|---|---|
| 1 | `--navy` | `#0A2240` | `bg-navy` | none |
| 2 | `--navy-800` | `#0D2A4E` | `bg-navy-800` | none |
| 3 | `--crimson` | `#941C1D` | `bg-crimson` | none |
| 4 | `--crimson-600` | `#B02A28` | `bg-crimson-600` | none |
| 5 | `--cream` | `#EDE6D6` | `bg-cream` | `border border-line` |
| 6 | `--cream-100` | `#F5F1E8` | `bg-cream-100` | `border border-line` |
| 7 | `--white` | `#FFFFFF` | `bg-white` | `border border-line` |
| 8 | `--ink-muted` | `#4A5568` | `bg-ink-muted` | none |
| 9 | `--line` | `#D8CFBC` | `bg-line` | `border border-line/50` |

Light swatches (cream, cream-100, white, line) get `border border-line` so their edges are visible on the white page bg. Dark swatches need no border.

---

### Section 2 — Typography Scale

**SectionWrapper variant:** `light` (bg-cream py-section-y)
**Container inside:** standard

**Section heading:**
```html
<h2 class="font-display text-h3 text-navy mb-10">02 · Typography Scale</h2>
```

**Layout per step:** One row per type step using a two-column flex layout:

```html
<div class="flex flex-col lg:flex-row lg:items-baseline gap-4 py-6 border-b border-line">
  <!-- Left column: metadata label -->
  <div class="w-[180px] shrink-0">
    <p class="font-mono text-caption text-navy font-semibold">[step-name]</p>
    <p class="font-mono text-caption text-ink-muted/70">[rem] / [px]px</p>
    <p class="font-mono text-caption text-ink-muted/60">[font family name]</p>
  </div>
  <!-- Right column: live text sample -->
  <div class="flex-1 min-w-0 overflow-hidden">
    [live text element per step below]
  </div>
</div>
```

**Eight steps in descending order:**

**display — 3.815rem / 61px — Cormorant Garamond**
```html
<p class="font-display text-display text-navy whitespace-nowrap overflow-hidden text-ellipsis">
  MH Global Attire
</p>
```

**h1 — 3.052rem / 49px — Cormorant Garamond**
```html
<h1 class="font-display text-h1 text-navy m-0">MH Global Attire</h1>
```

**h2 — 2.441rem / 39px — Cormorant Garamond**
```html
<h2 class="font-display text-h2 text-navy m-0">MH Global Attire</h2>
```

**h3 — 1.953rem / 31px — Cormorant Garamond**
```html
<h3 class="font-display text-h3 text-navy m-0">MH Global Attire</h3>
```

**h4 — 1.563rem / 25px — Cormorant Garamond**
```html
<h4 class="font-display text-h4 text-navy m-0">MH Global Attire</h4>
```

**body-lg — 1.250rem / 20px — Inter**
```html
<p class="font-sans text-body-lg text-ink-muted">Premium B2B Apparel Manufacturing</p>
```

**body — 1.000rem / 16px — Inter**
```html
<p class="font-sans text-body text-ink-muted">Premium B2B Apparel Manufacturing</p>
```

**caption — 0.800rem / 13px — Inter**
```html
<p class="font-sans text-caption text-ink-muted">Premium B2B Apparel Manufacturing</p>
```

**Enforcement note rendered below the scale rows:**
```html
<p class="font-sans text-caption text-ink-muted/60 mt-8 border-l-2 border-crimson pl-4">
  Cormorant Garamond is assigned exclusively to the display and h1–h4 steps. It must
  never appear on body, body-lg, or caption text, nor on any nav link, button label,
  badge, form element, or footer text.
</p>
```

---

### Section 3 — Buttons

**Structure:** Two sub-sections — cream background first, then navy background.

**Section heading** (placed before both sub-sections, on cream bg):
Use `light` SectionWrapper for the cream sub-section. Then embed a dark strip for the navy sub-section.

**Section heading element:**
```html
<h2 class="font-display text-h3 text-navy mb-10">03 · Buttons</h2>
```

**Sub-section A — All variants on cream background:**

Sub-label:
```html
<p class="font-sans text-caption text-ink-muted uppercase tracking-[0.08em] mb-4">
  On cream background — all three variants at md size
</p>
```

Row:
```html
<div class="flex flex-wrap items-center gap-4 mb-10">
  <!-- Button primary md -->
  <!-- Button secondary md (cream/white-bg config: border-navy text-navy) -->
  <!-- Button ghost md -->
</div>
```

Size demonstration row (primary only):
```html
<p class="font-sans text-caption text-ink-muted uppercase tracking-[0.08em] mb-4">
  Size scale — primary variant
</p>
<div class="flex flex-wrap items-end gap-4">
  <!-- Button primary sm "Small" -->
  <!-- Button primary md "Medium" -->
  <!-- Button primary lg "Large" -->
</div>
```

**Sub-section B — Contrast verification on navy background:**

Rendered as a full-width navy strip nested inside the Section 3 container, OR as a separate dark SectionWrapper immediately after the light one.

Class on the navy strip: `w-full bg-navy -mx-container-x md:-mx-8 lg:-mx-12 px-container-x md:px-8 lg:px-12 py-12 mt-12`

OR simply: place as its own `<section class="w-full bg-navy py-12">` with a Container inside. This is cleaner. The dev chooses the nested approach or a separate section.

Content inside the navy strip:
```html
<p class="font-sans text-caption text-white/60 uppercase tracking-[0.08em] mb-4">
  On navy background — contrast verification
</p>
<div class="flex flex-wrap items-center gap-4 mb-4">
  <!-- Button primary md "Primary Action" -->
  <!-- Button secondary md (navy-bg config: border-white text-white hover:bg-white hover:text-navy) "Secondary Action" -->
</div>
<p class="font-sans text-caption text-white/50">
  Primary: white on crimson 8.6:1 · Secondary: white on transparent/navy 15.9:1
</p>
```

---

### Section 4 — Sample Card

**SectionWrapper variant:** `white` (bg-white py-section-y) so the cream-100 card surface is clearly distinct.

**Section heading:**
```html
<h2 class="font-display text-h3 text-navy mb-10">04 · Sample Card</h2>
```

**Card constraining wrapper** (realistic product card width):
```html
<div class="max-w-sm">
  <!-- Card default variant -->
</div>
```

**Complete card element with all nested content:**

```html
<article class="bg-cream-100 rounded-card border border-line shadow-card p-8">

  <!-- 1. Badge -->
  <span class="inline-flex items-center bg-navy text-white font-sans font-semibold
               uppercase tracking-[0.08em] text-[0.6875rem] px-3 py-1 rounded-badge mb-4">
    Woven Fabrics
  </span>

  <!-- 2. Heading -->
  <h3 class="font-display text-h4 text-navy mt-0 mb-3">
    Bulk Order Inquiry
  </h3>

  <!-- 3. Body text -->
  <p class="font-sans text-body text-ink-muted leading-[1.65] mb-6">
    Minimum order quantities vary by product category and fabric specification —
    contact us with your requirements to receive a tailored quotation. Standard
    production lead times range from 30 to 60 days from sample approval to shipment.
  </p>

  <!-- 4. Primary button -->
  <button
    type="button"
    class="inline-flex items-center justify-center gap-2 font-sans font-semibold
           tracking-wide rounded-btn transition-colors duration-150 ease-in-out
           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
           focus-visible:ring-crimson disabled:opacity-50 disabled:cursor-not-allowed
           bg-crimson text-white hover:bg-crimson-600
           text-body px-6 py-3">
    Request Quote
  </button>

</article>
```

Note: h3 uses `text-h4` (1.563rem) inside the card to maintain visual hierarchy. The `<h3>` element still receives Cormorant Garamond from the `@layer base` rule — no additional font class needed beyond `font-display`.

---

### Section 5 — Form Inputs

**SectionWrapper variant:** `light` (bg-cream py-section-y)

**Section heading:**
```html
<h2 class="font-display text-h3 text-navy mb-10">05 · Form Inputs</h2>
```

**Default state — two inputs side by side:**

Layout wrapper:
```html
<p class="font-sans text-caption text-ink-muted uppercase tracking-[0.08em] mb-4">
  Default state
</p>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
  <!-- Input field -->
  <!-- Select field -->
</div>
```

**Complete Input field HTML:**
```html
<div class="flex flex-col gap-1.5">
  <label for="sg-company-name"
         class="font-sans text-sm font-medium text-navy">
    Company Name
  </label>
  <input
    id="sg-company-name"
    name="companyName"
    type="text"
    placeholder="e.g. Gildan Activewear"
    aria-invalid="false"
    class="w-full bg-white font-sans text-body text-navy rounded-input
           border border-line px-4 py-3
           placeholder:text-ink-muted/50
           transition-colors duration-150 ease-in-out
           focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" />
</div>
```

**Complete Select field HTML:**
```html
<div class="flex flex-col gap-1.5">
  <label for="sg-product-category"
         class="font-sans text-sm font-medium text-navy">
    Product Category
  </label>
  <div class="relative">
    <select
      id="sg-product-category"
      name="productCategory"
      aria-invalid="false"
      class="w-full appearance-none bg-white font-sans text-body text-navy
             rounded-input border border-line px-4 py-3 pr-10
             transition-colors duration-150 ease-in-out cursor-pointer
             focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy">
      <option value="" disabled selected>Select a category</option>
      <option value="woven-shirts">Woven Shirts</option>
      <option value="knitwear">Knitwear</option>
      <option value="denim">Denim</option>
      <option value="workwear">Workwear</option>
    </select>
    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <svg
        class="h-4 w-4 text-navy"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0
             111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</div>
```

**Error state demonstration — rendered below the default row:**

```html
<p class="font-sans text-caption text-ink-muted uppercase tracking-[0.08em] mt-10 mb-4">
  Error state
</p>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
  <div class="flex flex-col gap-1.5">
    <label for="sg-company-name-error"
           class="font-sans text-sm font-medium text-navy">
      Company Name
    </label>
    <input
      id="sg-company-name-error"
      name="companyNameError"
      type="text"
      value=""
      aria-invalid="true"
      aria-describedby="sg-company-name-error-msg"
      class="w-full bg-white font-sans text-body text-navy rounded-input
             border border-crimson px-4 py-3
             placeholder:text-ink-muted/50
             transition-colors duration-150 ease-in-out
             focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson" />
    <p id="sg-company-name-error-msg"
       role="alert"
       class="font-sans text-caption text-crimson">
      Please enter your company name.
    </p>
  </div>
</div>
```

---

### Section 6 — Spacing & Token Reference

**SectionWrapper variant:** `white` (bg-white py-section-y)

**Section heading:**
```html
<h2 class="font-display text-h3 text-navy mb-10">06 · Token Reference</h2>
```

**Five sub-tables rendered vertically with `space-y-12` between them.**

Each sub-table uses this shared structure:

```html
<div>
  <h3 class="font-display text-h4 text-navy mb-4">[Category Name]</h3>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse">
      <thead>
        <tr class="border-b-2 border-line">
          <th class="text-left py-2 pr-8 font-sans text-caption font-semibold
                     text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">
            Token
          </th>
          <th class="text-left py-2 pr-8 font-sans text-caption font-semibold
                     text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">
            CSS Variable / Tailwind Key
          </th>
          <th class="text-left py-2 font-sans text-caption font-semibold
                     text-ink-muted uppercase tracking-[0.08em] whitespace-nowrap">
            Resolved Value
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-line/50">
        <!-- rows below -->
      </tbody>
    </table>
  </div>
</div>
```

Each row:
```html
<tr>
  <td class="py-2.5 pr-8 font-mono text-caption text-navy whitespace-nowrap">[token]</td>
  <td class="py-2.5 pr-8 font-mono text-caption text-ink-muted whitespace-nowrap">[key]</td>
  <td class="py-2.5 font-mono text-caption text-ink-muted">[value]</td>
</tr>
```

**Sub-table 1 — Spacing**

| Token | Tailwind Key | Resolved Value |
|---|---|---|
| section-y | `py-section-y` | 5rem (80px) · Mobile override: `py-10` = 2.5rem (40px) |
| container-x | `px-container-x` | 1.5rem (24px) mobile · `md:px-8` = 2rem · `lg:px-12` = 3rem |

**Sub-table 2 — Border Radius**

| Token | Tailwind Key | Resolved Value |
|---|---|---|
| card | `rounded-card` | 0.75rem (12px) |
| btn | `rounded-btn` | 0.375rem (6px) |
| badge | `rounded-badge` | 0.25rem (4px) |
| input | `rounded-input` | 0.375rem (6px) |

**Sub-table 3 — Box Shadow**

| Token | Tailwind Key | Resolved Value |
|---|---|---|
| card | `shadow-card` | `0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(10,34,64,0.08)` |
| card-dark | `shadow-card-dark` | `0 2px 8px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.35)` |

**Sub-table 4 — Z-Index**

| Token | Tailwind Key | Resolved Value |
|---|---|---|
| behind | `z-behind` | -1 |
| nav | `z-nav` | 50 |
| modal | `z-modal` | 100 |
| tooltip | `z-tooltip` | 200 |

**Sub-table 5 — Typography Steps**

| Step | rem | px | Line-Height | Letter-Spacing | Font Family |
|---|---|---|---|---|---|
| display | 3.815rem | 61px | 1.1 | -0.02em | Cormorant Garamond |
| h1 | 3.052rem | 49px | 1.15 | -0.02em | Cormorant Garamond |
| h2 | 2.441rem | 39px | 1.2 | -0.015em | Cormorant Garamond |
| h3 | 1.953rem | 31px | 1.25 | -0.01em | Cormorant Garamond |
| h4 | 1.563rem | 25px | 1.3 | -0.01em | Cormorant Garamond |
| body-lg | 1.250rem | 20px | 1.6 | 0em | Inter |
| body | 1.000rem | 16px | 1.65 | 0em | Inter |
| caption | 0.800rem | 13px | 1.5 | +0.02em | Inter |

---

## ACCEPTANCE CRITERIA SELF-CHECK

| Criterion | Status |
|---|---|
| All 9 color tokens in tailwind.config extend block | PRESENT — Deliverable 1 colors |
| Both font families (display + sans) in extend block | PRESENT — Deliverable 1 fontFamily |
| All 8 type scale steps with size + lineHeight + letterSpacing + fontWeight | PRESENT — Deliverable 1 fontSize |
| section-y and container-x spacing tokens with exact rem values | PRESENT — Deliverable 1 spacing |
| card, btn, badge, input border radius tokens with exact rem values | PRESENT — Deliverable 1 borderRadius |
| card and card-dark shadow tokens with exact CSS shadow strings | PRESENT — Deliverable 1 boxShadow |
| nav, modal, tooltip, behind z-index tokens | PRESENT — Deliverable 1 zIndex |
| All 5 breakpoints explicitly confirmed | PRESENT — Deliverable 1 screens |
| :root CSS variables block with all 9 color tokens + --font-display + --font-sans | PRESENT — Deliverable 2C globals.css |
| @layer base block with html reset, body defaults, h1–h4 serif, a color, ::selection | PRESENT — Deliverable 2C globals.css |
| next/font import block for layout.tsx with exact function call + variable names | PRESENT — Deliverable 2A |
| All 5 WCAG contrast ratios with numeric values stated | PRESENT — top of document, all PASS |
| All 9 component primitives with variants, states, aria requirements | PRESENT — Deliverable 3.1–3.9 |
| /styleguide page header block specified | PRESENT — Deliverable 4 page header |
| /styleguide Section 1 Color Palette — 9 swatches with all metadata | PRESENT — Deliverable 4 §1 |
| /styleguide Section 2 Typography Scale — 8 steps with live samples | PRESENT — Deliverable 4 §2 |
| /styleguide Section 3 Buttons — all variants on cream + navy | PRESENT — Deliverable 4 §3 |
| /styleguide Section 4 Sample Card — badge + h3 + body + button | PRESENT — Deliverable 4 §4 |
| /styleguide Section 5 Form Inputs — input + select + error state | PRESENT — Deliverable 4 §5 |
| /styleguide Section 6 Token Reference — 5 sub-tables | PRESENT — Deliverable 4 §6 |
| Zero hex values deviating from locked token table | CONFIRMED — all 9 hex values cross-checked to master plan §3 |
| Zero instances of display serif on non-heading elements | CONFIRMED — font-display/Cormorant Garamond appears only on h1–h4 and display step |
| No prohibited colors (no green, teal, orange, purple, or off-palette hues) | CONFIRMED — only the 9 locked tokens used throughout |
| All class names and CSS variable names consistent across D1/D2/D3 | CONFIRMED — navy, navy-800, crimson, crimson-600, cream, cream-100, ink-muted, line identical in all three deliverables |

---

## IMPLEMENTATION HANDOFF NOTES FOR FRONTEND-DEV AGENT

1. `app/globals.css` receives the exact CSS from Deliverable 2C verbatim. The three `@tailwind` directives must appear first in the file.

2. `tailwind.config.ts` receives the `extend` object from Deliverable 1. The file also requires `content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}']` in the standard position outside of `extend`.

3. `app/layout.tsx` receives the next/font import block from Deliverable 2A at the top of the file. The `<html>` element receives `className={`${cormorantGaramond.variable} ${inter.variable}`}`.

4. The Nav component must add `pt-[4.5rem]` to the `<body>` or first `<main>` to prevent content sliding under the fixed 72px header.

5. On the dark SectionWrapper, the arbitrary variants `[&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white` are mandatory — without them headings are invisible on the navy background.

6. The `secondary` Button variant has two context configurations — developer selects based on the host SectionWrapper variant. Cream/white host: `border-navy text-navy`. Navy host: `border-white text-white`.

7. The `/styleguide` route must export `export const metadata = { title: 'Design System — MH Global Attire', robots: { index: false } }` to prevent indexing.

8. File paths for implementation:
   - `app/globals.css` — Deliverable 2C
   - `app/layout.tsx` — Deliverable 2A import block + html className
   - `tailwind.config.ts` — Deliverable 1 extend object
   - `app/styleguide/page.tsx` — Deliverable 4
   - `components/ui/button.tsx` — Deliverable 3.1
   - `components/ui/card.tsx` — Deliverable 3.2
   - `components/ui/badge.tsx` — Deliverable 3.3
   - `components/ui/input.tsx` — Deliverable 3.4
   - `components/ui/select.tsx` — Deliverable 3.5
   - `components/ui/section-wrapper.tsx` — Deliverable 3.6
   - `components/ui/container.tsx` — Deliverable 3.7
   - `components/layout/nav.tsx` — Deliverable 3.8
   - `components/layout/footer.tsx` — Deliverable 3.9

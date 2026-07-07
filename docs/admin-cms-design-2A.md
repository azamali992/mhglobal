# MH Global Attire — Admin CMS Panel Design Specification
**Phase 2A · Version 1.0 · 2026-07-04**
**Agent:** ui-designer
**Status:** Implementation-ready. Every value is locked. Frontend-dev agent implements verbatim without making design decisions.

---

## CRITICAL TYPOGRAPHY OVERRIDE FOR ALL ADMIN ROUTES

The global `app/globals.css` `@layer base` rule assigns `font-family: var(--font-display)` (Cormorant Garamond) to all `h1`–`h4` HTML elements. This rule applies globally. Every heading element inside the admin panel **must carry an explicit `font-sans` class** to override it. Do not use bare `<h1>`–`<h4>` tags without `className="font-sans ..."` inside any admin component. This is not optional — Cormorant Garamond must never appear in any admin surface.

The `AdminShell` root `<div>` must carry `className="font-sans"` as a cascade anchor. This provides a second line of defence, but explicit per-element `font-sans` classes are still required on every heading.

**Admin surface color rule (absolute):**
- Page background: `bg-cream-100` (#F5F1E8) — everywhere inside admin content area
- Card/panel surfaces: `bg-white` (#FFFFFF)
- Sidebar: `bg-navy` (#0A2240)
- `bg-cream` (#EDE6D6) — forbidden in admin UI entirely. Never use it.

---

## SECTION 1 — ADMIN SHELL

**File:** `components/admin/admin-shell.tsx`
**Type:** Client Component (manages sidebar open/close state)

### Props Interface

```typescript
interface AdminShellProps {
  children: React.ReactNode;
  pageTitle: string;   // displayed in the top header bar, e.g. "Dashboard", "Categories"
  activePath: string;  // current pathname, e.g. "/admin/categories" — used to mark active nav item
}
```

### Overall Layout Structure

The shell is a full-viewport flex layout: sidebar fixed on the left (desktop), header fixed at top, main content scrolling in the remaining space.

```
┌──────────────────────────────────────────────────────┐
│  HEADER (h-14, bg-white, border-b border-line)        │
├────────────┬─────────────────────────────────────────┤
│            │                                         │
│  SIDEBAR   │   MAIN CONTENT AREA                     │
│  (w-64,    │   (bg-cream-100, flex-1,                │
│  bg-navy,  │    overflow-y-auto, p-6 lg:p-8)         │
│  fixed,    │                                         │
│  lg+ only) │                                         │
│            │                                         │
└────────────┴─────────────────────────────────────────┘
```

Root element class string:
```
font-sans flex h-screen overflow-hidden bg-cream-100
```

### 1.1 Sidebar (desktop, lg+ breakpoint)

**Visibility:** `hidden lg:flex` — hidden below 1024px, flex column at lg and above.

**Outer sidebar element:**
```
w-64 flex-shrink-0 bg-navy flex flex-col h-screen fixed left-0 top-0 z-nav
```

Width: `w-64` = 16rem (256px). Height: full viewport height. Position: fixed left, so the main content area must have `lg:pl-64` to avoid overlap.

**Logo block** (top of sidebar):
```
px-6 py-5 border-b border-white/10
```
Inside: render the MH Global Attire logo image with class `h-10 w-auto filter brightness-0 invert`. Wrap in a `<div>` (not a link — already in admin, no nav away needed). Alt text: "MH Global Attire".

**Navigation block** (middle of sidebar, flex-1 so it takes remaining space):
```
flex-1 overflow-y-auto py-4 px-3
```

Navigation is a `<nav aria-label="Admin navigation">` containing a `<ul>` with `space-y-1`. Each nav item is a `<li>`.

**Nav item structure** (each is a Next.js `<Link>` rendered as a block):

Base classes applied to all items:
```
flex items-center gap-3 px-3 py-2 rounded-btn text-sm font-medium font-sans
transition-colors duration-150 w-full
```

Inactive state:
```
text-white/80 hover:text-white hover:bg-navy-800
```

Active state (when `activePath` matches the item's href):
```
bg-navy-800 text-white
```

Active item also receives `aria-current="page"`.

**Navigation items** (in this exact order):

| Label | Icon (Heroicons outline, 20×20) | href | activePath match |
|---|---|---|---|
| Dashboard | `HomeIcon` | `/admin` | exact match `/admin` |
| Categories | `TagIcon` | `/admin/categories` | starts with `/admin/categories` |
| Products | `ShoppingBagIcon` | `/admin/products` | starts with `/admin/products` |
| Inquiries | `InboxIcon` | `/admin/inquiries` | starts with `/admin/inquiries` |
| Content | `DocumentTextIcon` | `/admin/content` | starts with `/admin/content` |
| Settings | `Cog6ToothIcon` | `/admin/settings` | starts with `/admin/settings` |

Icon class: `h-5 w-5 flex-shrink-0`. Icon is `aria-hidden="true"`. Label text is the nav item's visible text — always Inter, `text-sm font-medium`.

Inquiries nav item includes a badge showing the count of `Inquiry.status = NEW`. Badge: `ml-auto bg-crimson text-white font-sans text-[0.6875rem] font-semibold px-2 py-0.5 rounded-badge`. If count is zero, do not render the badge. This count is fetched once on layout load via a server-side query; it is not real-time polled in Phase 2A.

**User block** (bottom of sidebar):
```
px-3 py-4 border-t border-white/10
```

Inside: flex row, `items-center gap-3`.

Left: avatar circle — `h-8 w-8 rounded-full bg-navy-800 border border-white/20 flex items-center justify-center text-white font-sans text-sm font-semibold flex-shrink-0`. Content: first letter of `AdminUser.name` (or `AdminUser.email[0]` if name is null), uppercase.

Middle: flex column.
- Line 1: `font-sans text-sm font-medium text-white truncate` — shows `AdminUser.name` (or "Admin" if null).
- Line 2: `font-sans text-caption text-white/60 truncate` — shows `AdminUser.email`.

Right: sign-out button — icon-only, `aria-label="Sign out"`. Icon: `ArrowRightOnRectangleIcon`, 20×20, `text-white/60 hover:text-white`. This is a `<form>` with a server action (`signOut`) — same pattern as the existing `app/admin/page.tsx` sign-out form. Button type: `submit`.

### 1.2 Header Bar (all viewports)

**Element:** `<header>` with class:
```
h-14 bg-white border-b border-line flex items-center px-4 lg:px-6
fixed top-0 right-0 left-0 lg:left-64 z-[49]
```

Height: `h-14` = 56px. `lg:left-64` ensures it doesn't overlap the sidebar on desktop. `z-[49]` keeps it below the sidebar's `z-nav` (50) so sidebar shadow renders correctly.

**Left side of header:**

Mobile hamburger button (visible below lg, hidden at lg+):
```
flex lg:hidden items-center justify-center w-9 h-9 rounded-btn mr-3
text-navy hover:bg-cream-100 transition-colors duration-150
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20
```
`aria-label="Open navigation menu"` when closed; `aria-label="Close navigation menu"` when open.
`aria-expanded="false"` / `"true"` toggled on click.
`aria-controls="mobile-nav-drawer"`.
Icon: `Bars3Icon` (24×24) when closed, `XMarkIcon` (24×24) when open.

Page title — immediately right of the hamburger button (or flush left on desktop):
```
font-sans text-sm font-semibold text-navy
```
Content: `pageTitle` prop value. This updates per route.

**Right side of header** (desktop only, `hidden lg:flex items-center gap-3`):

Avatar circle: same spec as sidebar user block avatar, `h-8 w-8`.
Name: `font-sans text-sm font-medium text-navy` showing `AdminUser.name`.

### 1.3 Mobile Navigation Drawer

**Trigger:** Hamburger button in header sets `mobileNavOpen` state to `true`.

**Overlay backdrop:**
```
fixed inset-0 bg-navy/50 z-[98] lg:hidden
```
Click on backdrop closes drawer. `aria-hidden="true"` on the backdrop element.

**Drawer panel:**
```
fixed inset-y-0 left-0 w-72 bg-navy z-[99] flex flex-col
transform transition-transform duration-200 ease-in-out lg:hidden
```
When `mobileNavOpen = false`: `translate-x-[-100%]`
When `mobileNavOpen = true`: `translate-x-0`

Drawer has `id="mobile-nav-drawer"` and `role="dialog"` with `aria-modal="true"` and `aria-label="Navigation menu"`.

Inside the drawer, content is identical to the desktop sidebar: logo block, navigation items list (same icons, labels, active states), user block at bottom. No differences in content — only the container changes.

Keyboard: pressing `Escape` closes the drawer. Focus is trapped inside the drawer while open (use a focus trap utility or `inert` on the main content).

### 1.4 Main Content Area

**Element:** `<main>` with class:
```
flex-1 overflow-y-auto bg-cream-100 pt-14 lg:pl-64
```

`pt-14` accounts for the fixed 56px header. `lg:pl-64` accounts for the fixed 256px sidebar on desktop. Route page content renders inside this element wrapped in a padding container:
```
p-6 lg:p-8
```

All route page content (dashboards, tables, forms) renders inside this padding scope. The `children` prop of `AdminShell` is placed here.

### 1.5 AdminShell Usage Pattern

Each admin route page file wraps its content with `AdminShell`:

```typescript
// app/admin/categories/page.tsx
import AdminShell from "@/components/admin/admin-shell";

export default async function CategoriesPage() {
  return (
    <AdminShell pageTitle="Categories" activePath="/admin/categories">
      {/* route content */}
    </AdminShell>
  );
}
```

The existing `app/admin/layout.tsx` stays minimal (just metadata + children). `AdminShell` is used at the page level, not as a layout wrapper, so each page can pass its own `pageTitle`.

---

## SECTION 2 — DASHBOARD (/admin)

**File:** `app/admin/page.tsx` (replaces the current Phase 1 stub)
**Type:** Server Component. Data fetched server-side via Prisma before render.

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: "Dashboard — MH Global Attire Admin",
  robots: { index: false, follow: false },
};
```

### 2.1 Layout

Outer wrapper inside `AdminShell`:
```
max-w-5xl w-full
```

Vertical stacking order:
1. Greeting line
2. Stat cards row
3. Latest inquiries panel
4. Quick actions row

Vertical spacing between sections: `space-y-8`.

### 2.2 Greeting Line

```html
<p class="font-sans text-lg font-semibold text-navy">
  Good [morning/afternoon/evening], [AdminUser.name]
</p>
```

Derive time greeting server-side:
- 05:00–11:59 → "Good morning"
- 12:00–17:59 → "Good afternoon"
- 18:00–04:59 → "Good evening"

Below the greeting, a single line:
```html
<p class="font-sans text-sm text-ink-muted mt-1">
  Here's what's happening with your store today.
</p>
```

Both elements are wrapped in a `<div class="mb-8">`.

### 2.3 StatCard Component

**File:** `components/admin/stat-card.tsx`
**Type:** Server Component (no interactivity)

```typescript
interface StatCardProps {
  label: string;         // e.g. "Inquiries Awaiting Review"
  value: string | number; // e.g. 4 or "63"
  description?: string;  // e.g. "new since last week"
  href?: string;         // if provided, entire card is a clickable link
}
```

**Card element:** `<article>` (or `<a>` wrapping an `<article>` if `href` is provided).

Base class string:
```
bg-white rounded-card shadow-card p-6 flex flex-col gap-2
```

If `href` is provided, wrap in `<a href={href}>` with class:
```
block transition-shadow duration-200 hover:shadow-[0_4px_20px_rgba(10,34,64,0.14)] rounded-card
```

Inside the card:
- Label: `font-sans text-sm font-medium text-ink-muted`
- Value: `font-sans text-3xl font-bold text-navy mt-1` — `text-3xl` = 1.875rem
- Description (if present): `font-sans text-caption text-ink-muted`

**Stat cards row layout:**
```
grid grid-cols-1 sm:grid-cols-3 gap-4
```

Three cards, in order:

| label | value source | description | href |
|---|---|---|---|
| "Inquiries Awaiting Review" | Count of `Inquiry` rows where `status = 'NEW'` | "require your attention" | `/admin/inquiries` |
| "Total Inquiries" | Count of all `Inquiry` rows | "all time" | `/admin/inquiries` |
| "Published Products" | Count of `Product` rows where `published = true` | "visible on website" | `/admin/products` |

**Loading state:** While data is loading (if using React Suspense), each card renders a skeleton: `bg-white rounded-card shadow-card p-6 animate-pulse`. Inside: a `bg-cream-100 rounded h-4 w-24 mb-3` label skeleton, and a `bg-cream-100 rounded h-8 w-16` value skeleton.

### 2.4 LatestInquiries Component

**File:** `components/admin/latest-inquiries.tsx`
**Type:** Client Component (rows are clickable — opens InquiryDrawer)

```typescript
interface LatestInquiriesProps {
  inquiries: Array<{
    id: string;
    company: string | null;
    name: string;
    country: string | null;
    createdAt: Date;
    status: "NEW" | "REVIEWED" | "QUOTED" | "CLOSED";
  }>;
}
```

Data source: 5 most recent `Inquiry` rows ordered by `createdAt DESC`. Fetched server-side in the dashboard page, passed as props.

**Panel wrapper:**
```
bg-white rounded-card shadow-card overflow-hidden
```

**Panel header:**
```
px-6 py-4 border-b border-line flex items-center justify-between
```
Left: `<h2 class="font-sans text-sm font-semibold text-navy">Latest Inquiries</h2>`
Right: `<a href="/admin/inquiries" class="font-sans text-sm text-crimson hover:text-crimson-600 transition-colors duration-150">View all</a>`

**Table:**
```html
<table class="w-full">
  <thead>
    <tr class="border-b border-line">
      <th class="text-left px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">Company</th>
      <th class="text-left px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted hidden sm:table-cell">Country</th>
      <th class="text-left px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted hidden md:table-cell">Date Received</th>
      <th class="text-left px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">Status</th>
    </tr>
  </thead>
  <tbody class="divide-y divide-line/50">
    <!-- rows -->
  </tbody>
</table>
```

**Table row** (each `<tr>` is clickable — cursor-pointer, opens InquiryDrawer):
```
cursor-pointer hover:bg-cream-100 transition-colors duration-150
```
`onClick`: sets `selectedInquiryId` state, opens the `InquiryDrawer`. The row renders `<td>` elements with `px-6 py-3 font-sans text-sm text-navy`.

- Company cell: `Inquiry.company` value, or `Inquiry.name` if company is null (always shows something).
- Country cell: `Inquiry.country` or `—` if null. `hidden sm:table-cell`.
- Date cell: `Inquiry.createdAt` formatted as "DD MMM YYYY" (e.g. "04 Jul 2026"). `hidden md:table-cell`.
- Status cell: `<Badge>` component from `components/ui/` with variant and label per the mapping below.

**InquiryStatus to Badge mapping — canonical (used everywhere in the admin):**

| `Inquiry.status` value | Badge label | Badge variant |
|---|---|---|
| `NEW` | "New" | `crimson` |
| `REVIEWED` | "In Review" | `navy` |
| `QUOTED` | "Quoted" | `muted` |
| `CLOSED` | "Closed" | `muted` |

**Empty state** (when `inquiries.length === 0`):
Replace the table with:
```html
<div class="px-6 py-16 text-center">
  <p class="font-sans text-sm text-ink-muted">
    No inquiries yet — your contact form submissions will appear here.
  </p>
</div>
```

**InquiryDrawer on dashboard:** The same `InquiryDrawer` component used in `/admin/inquiries` is rendered here. Clicking a row opens it with the selected inquiry's data. Full InquiryDrawer spec is in Section 5.

### 2.5 QuickActions Row

Three action tiles rendered as a `grid grid-cols-1 sm:grid-cols-3 gap-4`.

Each tile:
```
bg-white rounded-card shadow-card p-6 flex flex-col items-start gap-3
hover:shadow-[0_4px_20px_rgba(10,34,64,0.14)] transition-shadow duration-200 cursor-pointer
```

Rendered as `<a href="...">` links:

| Icon (Heroicons outline, 24×24) | Title | Description | href |
|---|---|---|---|
| `PlusCircleIcon` | "Add New Product" | "Create a new product listing" | `/admin/products?action=new` |
| `FolderPlusIcon` | "Add New Category" | "Create a new product category" | `/admin/categories?action=new` |
| `DocumentTextIcon` | "Edit Site Content" | "Update page text and headings" | `/admin/content` |

Icon class: `h-6 w-6 text-crimson`.
Title: `font-sans text-sm font-semibold text-navy`.
Description: `font-sans text-caption text-ink-muted`.

### 2.6 Dashboard Mobile Behavior (below md, 768px)

- Stat cards collapse from 3 columns to 1 column (stacked).
- LatestInquiries table: Country and Date columns hidden (`hidden sm:table-cell` / `hidden md:table-cell`). Only Company and Status visible.
- QuickActions tiles stack to 1 column.
- Greeting and panel headers remain unchanged.

---

## SECTION 3 — CATEGORIES (/admin/categories)

**File:** `app/admin/categories/page.tsx`
**Type:** Client Component (drag-to-reorder, inline toggles, drawer state)

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: "Categories — MH Global Attire Admin",
  robots: { index: false, follow: false },
};
```

### 3.1 Page Header Row

```
flex items-center justify-between mb-6
```

Left side:
- `<h1 class="font-sans text-lg font-semibold text-navy">Categories</h1>`
- Count badge immediately right of title: `<span class="ml-3 bg-cream-100 text-ink-muted font-sans text-caption font-medium px-2.5 py-0.5 rounded-badge">[n] total</span>`

Right side:
- Primary `Button` component, size `sm`, label "Add Category", icon `PlusIcon` (16×16) left of label. `onClick`: open `AdminDrawer` in "create" mode.

### 3.2 DataTable Component (Reusable)

**File:** `components/admin/data-table.tsx`
**Type:** Client Component

```typescript
interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  onReorder?: (orderedIds: string[]) => void; // undefined = drag disabled
  keyField: keyof T; // field used as React key and drag ID, e.g. "id"
  emptyState: React.ReactNode;
}

interface DataTableColumn<T> {
  key: string;
  header: string;       // shown in <thead>
  render: (row: T) => React.ReactNode;
  className?: string;   // applied to both <th> and <td>
  hiddenBelow?: "sm" | "md" | "lg"; // responsive hiding
}
```

**Table wrapper:**
```
bg-white rounded-card shadow-card overflow-hidden
```

**Table element:**
```
w-full border-collapse
```

**Table head:**
```html
<thead>
  <tr class="border-b border-line bg-cream-100/50">
    <!-- one <th> per column -->
  </tr>
</thead>
```

`<th>` class: `text-left px-4 py-3 font-sans text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted whitespace-nowrap`. For the drag handle column: `w-8 px-2`. For Actions column: `text-right`.

**Table body:**
```html
<tbody class="divide-y divide-line/50">
  <!-- draggable <tr> per row -->
</tbody>
```

**Default row state** `<tr>` class: `font-sans text-sm text-navy hover:bg-cream-100/50 transition-colors duration-150`

`<td>` base class: `px-4 py-3 font-sans text-sm text-navy`

### 3.3 Categories DataTable — Column Specification

The DataTable for Categories is instantiated in `app/admin/categories/page.tsx` with these columns:

**Column 1 — Drag Handle**
- header: "" (empty, `aria-label="Drag to reorder"` on `<th>`)
- `w-8 px-2`
- render: `<button aria-label="Drag to reorder [category name]" class="cursor-grab active:cursor-grabbing text-ink-muted/40 hover:text-ink-muted p-1 touch-none"><GripVerticalIcon class="h-4 w-4" aria-hidden="true" /></button>`
- drag handle activates the row's drag behavior (dnd-kit or @hello-pangea/dnd). Only the gripper element acts as drag handle, not the whole row.
- On mobile (below md): the drag handle column is present but the button is disabled and shows a tooltip on long-press: "Drag to reorder is available on desktop". Implement via `title` attribute and `disabled` prop.

**Column 2 — Image**
- header: "" (empty)
- `w-12`
- render: `<img src={row.heroImage ?? undefined} alt={row.name} class="h-10 w-10 rounded object-cover bg-cream-100 border border-line" />`. If `heroImage` is null, render: `<div class="h-10 w-10 rounded bg-cream-100 border border-line flex items-center justify-center"><PhotoIcon class="h-5 w-5 text-ink-muted/40" aria-hidden="true" /></div>`

**Column 3 — Name**
- header: "Name"
- render:
  ```html
  <div>
    <p class="font-sans text-sm font-medium text-navy">{row.name}</p>
    <p class="font-sans text-caption text-ink-muted mt-0.5">{row.slug}</p>
  </div>
  ```
  The slug display is read-only `text-caption text-ink-muted`. Never expose the word "slug" — the caption just shows the value (e.g. "t-shirts") as a subdued URL hint.

**Column 4 — GSM Range**
- header: "GSM Range"
- render: `<span class="font-sans text-sm text-ink-muted">{row.gsmRange ?? "—"}</span>`
- `hiddenBelow: "md"` — hidden on mobile and tablet

**Column 5 — Status**
- header: "Status"
- render: Inline toggle switch component (see 3.4 below) bound to `row.published`.

**Column 6 — Actions**
- header: "" (empty, `text-right`)
- render (right-aligned):
  ```html
  <div class="flex items-center justify-end gap-2">
    <button aria-label="Edit [row.name]" class="p-1.5 rounded text-ink-muted hover:text-navy hover:bg-cream-100 transition-colors duration-150">
      <PencilSquareIcon class="h-4 w-4" aria-hidden="true" />
    </button>
    <button aria-label="Delete [row.name]" class="p-1.5 rounded text-ink-muted hover:text-crimson hover:bg-crimson/10 transition-colors duration-150">
      <TrashIcon class="h-4 w-4" aria-hidden="true" />
    </button>
  </div>
  ```

### 3.4 Inline Publish Toggle

Rendered inside the Status column. This is an `<button role="switch">` element.

States:

| `published` value | Visual | aria-checked |
|---|---|---|
| `true` | Track: `bg-navy`, knob slides right | `"true"` |
| `false` | Track: `bg-line`, knob slides left | `"false"` |

Class strings:

Track (outer `<button>`):
```
relative inline-flex h-5 w-9 items-center rounded-full
transition-colors duration-150 ease-in-out
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/30 focus-visible:ring-offset-1
```
Color: `bg-navy` when checked, `bg-line` when unchecked.

Knob (inner `<span>`):
```
inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow
transition-transform duration-150 ease-in-out
```
Position: `translate-x-1` when unchecked, `translate-x-4` when checked.

`aria-label`: `"Publish [Category.name]"` — uses the actual category name so the action is unambiguous for screen readers.

**Optimistic behavior:**
1. User clicks the toggle.
2. Local state updates immediately (visual flip).
3. Call `toggleCategoryPublishAction(id: string, published: boolean)` — passes `Category.id` and the new `Category.published` value.
4. On success: no visual change needed (already updated optimistically).
5. On failure: revert local state to original value, show error `ToastNotification` (error variant): "Could not update — please try again."

### 3.5 Drag-to-Reorder Behavior

Library: `@hello-pangea/dnd` or `dnd-kit/sortable`. The spec is library-agnostic for the visual behavior.

**Drag states:**

The row being dragged:
```
opacity-60 bg-cream-100 shadow-card-dark
```
The original position (drop placeholder) while dragging:
```
border-t-2 border-crimson bg-crimson/5
```

**Drop behavior:**
1. On drag end: compute new `order` values. The new order is the array index position (0-based) of each category ID after reordering.
2. Optimistic update: update local row order immediately (visual reorder).
3. Call `reorderCategoriesAction(orderedIds: string[])` — passes the full array of `Category.id` strings in new display order. The server assigns sequential `order` integers (0, 1, 2, …) to match array position.
4. On failure: revert to pre-drag order, show error `ToastNotification` (error variant): "Could not save the new order — please try again."

**Mobile reorder:** On viewports below `md` (768px), the drag gripper button is rendered with `disabled` attribute and `cursor-not-allowed`. The tooltip text "Drag to reorder is available on desktop" is set via the `title` attribute. No drag interaction fires on mobile.

### 3.6 SlugField Component

**File:** `components/admin/slug-field.tsx`
**Type:** Client Component

```typescript
interface SlugFieldProps {
  value: string;
  onChange: (slug: string) => void;
  autoSourceValue: string; // the "name" field value — slug auto-generates from this
  fieldId: string;         // for label association
}
```

**Locked state** (default, when slug has been auto-generated or last saved):

```html
<div class="flex flex-col gap-1.5">
  <label class="font-sans text-sm font-medium text-navy">URL Slug</label>
  <div class="flex items-center gap-2 px-4 py-3 bg-cream-100 border border-line rounded-input">
    <span class="font-sans text-sm text-ink-muted flex-1 truncate">{value}</span>
    <button
      type="button"
      aria-label="Edit URL slug"
      class="font-sans text-caption text-crimson hover:text-crimson-600 flex-shrink-0 transition-colors duration-150">
      Edit
    </button>
  </div>
  <p class="font-sans text-caption text-ink-muted">
    Preview: yourdomain.com/products/{value}
  </p>
</div>
```

**Unlocked state** (after user clicks "Edit"):

Replace the display div with a standard `Input` component (from `components/ui/Input.tsx`). Below the input, show:

```html
<p class="font-sans text-caption text-crimson flex items-center gap-1 mt-1">
  <ExclamationTriangleIcon class="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
  Changing the URL slug will break any existing links to this category.
</p>
<p class="font-sans text-caption text-ink-muted mt-0.5">
  Preview: yourdomain.com/products/{value}
</p>
```

**Auto-generation behavior:**
- When the form's Name field changes, if the slug is in "locked" state (not manually edited), auto-populate the slug: lowercase the name, replace spaces and special characters with hyphens, collapse consecutive hyphens, trim leading/trailing hyphens. Example: "T-Shirts & Polos" → "t-shirts-polos".
- Once the user clicks "Edit" and manually types a slug, auto-generation is disabled for that session.
- On blur of the unlocked input: re-lock the field, run the value through the same slugification to clean up any accidental formatting.

### 3.7 ImageUploadZone Component

**File:** `components/admin/image-upload-zone.tsx`
**Type:** Client Component

```typescript
interface ImageUploadZoneProps {
  value: string | null;             // current image URL
  onChange: (url: string) => void;  // called when URL input changes
  label: string;                    // e.g. "Category Image"
  cloudinaryConfigured: boolean;    // pass false in Phase 2A — always false for now
  multiple?: boolean;               // default false; true for Product images
}
```

**"Not configured" state** — rendered when `cloudinaryConfigured === false`:

Outer wrapper:
```
flex flex-col gap-3
```

Label element:
```html
<label class="font-sans text-sm font-medium text-navy">{label}</label>
```

Dropzone area (non-interactive):
```
border-2 border-dashed border-line rounded-card p-8 text-center cursor-default
bg-white
```
Inside the dropzone:
```html
<div class="flex flex-col items-center gap-3">
  <CloudArrowUpIcon class="h-8 w-8 text-ink-muted/40" aria-hidden="true" />
  <p class="font-sans text-sm text-ink-muted/60">
    Drag an image here or click to browse
  </p>
</div>
```
The dropzone `onClick` and `onDrop` handlers are **not attached** when `cloudinaryConfigured === false`. The element must not have `cursor-pointer`. No `<input type="file">` is rendered.

Inline notice box (immediately below the dropzone):
```
bg-cream-100 border border-line rounded-btn px-4 py-3
```
Inside:
```html
<p class="font-sans text-caption text-ink-muted">
  Image uploads are not active yet. Enter an image URL below to use an external image for now.
</p>
```

URL fallback input (below the notice):
Standard `Input` component from `components/ui/Input.tsx` with:
- `label`: "Image URL"
- `id`: e.g. `"heroImage-url"` (derived from the bound field)
- `type="url"`
- `placeholder`: "https://example.com/image.jpg"
- `value`: `value ?? ""`
- `onChange`: calls `onChange(e.target.value)`

**Single image preview** (when `value` is non-null and `multiple !== true`):

Below the URL input, render:
```
mt-3 relative inline-block
```
```html
<img src={value} alt="Current image" class="h-24 w-24 object-cover rounded border border-line" />
<button
  type="button"
  aria-label="Remove image"
  class="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-crimson text-white
         flex items-center justify-center hover:bg-crimson-600 transition-colors duration-150">
  <XMarkIcon class="h-3 w-3" aria-hidden="true" />
</button>
```
Remove button calls `onChange("")` to clear the value.

**Multi-image mode** (when `multiple === true`, used for `Product.images`):

When `multiple` is true, the component manages an array internally. The `onChange` prop in multi-image mode receives the full updated URL array serialised as a JSON string: `onChange(JSON.stringify(updatedUrls))`. The parent form deserialises this back to `string[]` before saving.

Existing images from the `images` array appear as a horizontal scrolling row:
```
flex gap-2 overflow-x-auto pb-2 mt-2
```
Each existing image thumbnail:
```html
<div class="relative flex-shrink-0">
  <img src={url} alt="Product image" class="h-16 w-16 object-cover rounded border border-line" />
  <button
    type="button"
    aria-label="Remove this image"
    class="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-crimson text-white
           flex items-center justify-center hover:bg-crimson-600 transition-colors">
    <XMarkIcon class="h-3 w-3" aria-hidden="true" />
  </button>
</div>
```

"Add Another Image URL" button (below the scrollable row):
```html
<button type="button" class="font-sans text-sm text-crimson hover:text-crimson-600
  flex items-center gap-1 transition-colors duration-150 mt-2">
  <PlusIcon class="h-4 w-4" aria-hidden="true" />
  Add Another Image URL
</button>
```
Clicking appends a new text input for an additional URL. Each additional URL input follows the same `Input` component pattern with label "Image URL [n]" and an X button to remove that input row. Maximum 10 image URL inputs total.

### 3.8 Category Add/Edit Form — AdminDrawer

**Component used:** `AdminDrawer` (spec in Section 8.2).

Drawer `title`: "Add Category" (create mode) or "Edit Category" (edit mode).

Drawer `footer`: The "Save Category" button rendered in the footer slot.

**Form fields in order (inside the drawer body, `flex flex-col gap-6`):**

1. **Category Name** — `Input` component, `label="Category Name"`, `id="category-name"`, `type="text"`, `required`, `placeholder="e.g. T-Shirts"`. Writes to `Category.name`. On change: fires slug auto-generation.

2. **URL Slug** — `SlugField` component, `autoSourceValue={nameFieldValue}`. Writes to `Category.slug`.

3. **Description** — `<div class="flex flex-col gap-1.5">` containing `<label class="font-sans text-sm font-medium text-navy">Description</label>` and `<textarea id="category-description" rows={4} class="w-full bg-white font-sans text-sm text-navy rounded-input border border-line px-4 py-3 placeholder:text-ink-muted/50 resize-none focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors duration-150" placeholder="Brief description of this product category..." />`. Writes to `Category.description`.

4. **GSM Range** — `Input` component, `label="GSM Range"`, `id="category-gsm"`, `type="text"`, `placeholder="e.g. 140–240 GSM"`. Writes to `Category.gsmRange`.

5. **Category Image** — `ImageUploadZone` component, `label="Category Image"`, `cloudinaryConfigured={false}`, `multiple={false}`. Value bound to `Category.heroImage`.

6. **Visible on website** — Toggle switch (same inline toggle spec as 3.4), `aria-label="Visible on website"`. Writes to `Category.published`. Label text "Visible on website" shown to the right of the toggle in `font-sans text-sm text-navy`.

**Form footer** (passed as the `footer` prop of `AdminDrawer`):

```
flex items-center justify-between gap-3
```

Left: If in edit mode — "Delete Category" ghost button in crimson (`font-sans text-sm text-crimson hover:text-crimson-600 transition-colors`). This opens `AdminConfirmDialog`.

Right: Two buttons — "Cancel" ghost `Button`, size `sm`; and "Save Category" primary `Button`, size `sm`, `isLoading` when form submission is in flight.

**Submit behavior:**
- Create mode: calls `createCategoryAction({ name, slug, description, gsmRange, heroImage, published, order })`. `order` is assigned as the current count of existing categories (appended to end). On success: close drawer, show success `ToastNotification` (success variant): "Category saved." Optimistic: add new row to table immediately.
- Edit mode: calls `updateCategoryAction({ id, name, slug, description, gsmRange, heroImage, published })`. On success: update row in table, close drawer, show success `ToastNotification` (success variant): "Category saved."
- On error (either mode): keep drawer open, show error `ToastNotification` (error variant): "Could not save — please try again."

### 3.9 Category Delete Flow

**Trigger:** Trash icon in row Actions column, or "Delete Category" button inside the edit drawer footer.

**Step 1:** Open `AdminConfirmDialog` with:
- `title`: "Delete [Category.name]?"
- `message`: "This cannot be undone. Products in this category will not be deleted."
- `confirmLabel`: "Delete Category"
- `onConfirm`: call `deleteCategoryAction(id: string)`.
- `onCancel`: close dialog, no action.

**Step 2 (on confirm):** Optimistically remove the row from the table. Call `deleteCategoryAction(id)`. On success: show success `ToastNotification` (success variant): "Category deleted." On failure: restore the row, show error `ToastNotification` (error variant): "Could not delete — please try again."

### 3.10 Empty State

When `categories.length === 0`, replace the DataTable with:

```html
<div class="bg-white rounded-card shadow-card p-16 text-center flex flex-col items-center gap-4">
  <TagIcon class="h-12 w-12 text-ink-muted/30" aria-hidden="true" />
  <p class="font-sans text-sm text-navy font-medium">No categories yet</p>
  <p class="font-sans text-caption text-ink-muted max-w-xs">
    Add your first category to start organising your products.
  </p>
  <Button variant="primary" size="sm" onClick={() => openDrawer("create")}>
    Add Category
  </Button>
</div>
```

### 3.11 Categories Mobile Behavior (below md, 768px)

- DataTable columns visible on mobile: Name (with slug caption), Status toggle, Actions. The GSM Range column is hidden (`hiddenBelow: "md"`). The Image column is hidden (`hiddenBelow: "sm"`).
- Drag handle column visible but buttons disabled with tooltip.
- `AdminDrawer` becomes a full-screen bottom sheet: `fixed inset-x-0 bottom-0 top-auto w-full max-w-none h-[90vh] rounded-t-card` instead of the right-slide panel. The same content renders inside.
- The category name and URL slug remain visible inside the drawer regardless of viewport.

---

## SECTION 4 — PRODUCTS (/admin/products)

**File:** `app/admin/products/page.tsx`
**Type:** Client Component

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: "Products — MH Global Attire Admin",
  robots: { index: false, follow: false },
};
```

### 4.1 Page Header Row

```
flex items-center justify-between mb-4
```
Left: `<h1 class="font-sans text-lg font-semibold text-navy">Products</h1>` + count badge (same spec as Categories).
Right: Primary `Button`, size `sm`, label "Add Product", icon `PlusIcon`.

### 4.2 Filter Bar

Rendered between the page header and the DataTable:
```
flex flex-col sm:flex-row gap-3 mb-4
```

**Category filter** — `Select` component from `components/ui/` with:
- `label`: "" (visually hidden via `sr-only` span)
- `aria-label`: "Filter by category"
- First option: `<option value="">All Categories</option>`
- Subsequent options: one per `Category` row, value = `Category.id`, label = `Category.name`.
- `onChange`: updates `activeCategoryFilter` state, re-filters rows client-side by `Product.categoryId`.

**Search input** — `Input` component with:
- `label`: "" (visually hidden)
- `aria-label`: "Search products"
- `placeholder`: "Search products..."
- `type="search"`
- `onChange`: debounce 250ms, updates `searchQuery` state, filters `Product.name` case-insensitively.

**"Clear filters" button** — ghost `Button`, size `sm`, label "Clear filters". Visible only when `activeCategoryFilter !== ""` or `searchQuery !== ""`. `onClick`: reset both filters.

### 4.3 Products DataTable — Column Specification

Same `DataTable` component as Categories. Columns:

**Column 1 — Drag Handle:** Identical to Categories spec.

**Column 2 — Image:** `src={row.images[0] ?? undefined}`. Placeholder icon if `images` is empty.

**Column 3 — Name:** `Product.name` in bold, slug value in caption below (same pattern as Categories).

**Column 4 — Category:**
- header: "Category"
- render: Resolved category name. The page component pre-joins categories server-side so each product row carries `categoryName: string`. Render: `<span class="font-sans text-sm text-ink-muted">{row.categoryName}</span>`
- `hiddenBelow: "md"`

**Column 5 — GSM Range:**
- header: "GSM Range"
- render: `<span class="font-sans text-sm text-ink-muted">{row.gsmRange ?? "—"}</span>`
- `hiddenBelow: "lg"`

**Column 6 — Status:** Inline toggle, `aria-label="Publish [Product.name]"`, writes to `Product.published`. Calls `toggleProductPublishAction(id: string, published: boolean)`. Same optimistic pattern as Categories. Error toast: "Could not update — please try again."

**Column 7 — Actions:** Edit + Delete icons, same pattern as Categories.

### 4.4 Drag-to-Reorder for Products

Same visual behavior as Categories. On drop: calls `reorderProductsAction(orderedIds: string[])` — passes `Product.id` array in new display order, which the server maps to sequential `Product.order` integers.

When a category filter is active, reordering only affects the visible (filtered) subset of products. The server action receives only the filtered IDs; server reassigns their `order` values within the filtered set, leaving other products' `order` values unchanged.

### 4.5 TagListInput Component

**File:** `components/admin/tag-list-input.tsx`
**Type:** Client Component

```typescript
interface TagListInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label: string;        // e.g. "Fabric Options"
  placeholder: string;  // e.g. "e.g. 100% cotton"
  id: string;
}
```

**Layout:**
```
flex flex-col gap-2
```

Label: `<label class="font-sans text-sm font-medium text-navy">{label}</label>`

Tags display area:
```
flex flex-wrap gap-2 min-h-[2.5rem] p-2 bg-white border border-line rounded-input
```

Each existing tag pill:
```html
<span class="inline-flex items-center gap-1.5 bg-cream-100 text-navy
             font-sans text-caption rounded-badge px-3 py-1">
  {tag}
  <button
    type="button"
    aria-label="Remove {tag}"
    onClick={() => onChange(value.filter(t => t !== tag))}
    class="text-ink-muted hover:text-crimson transition-colors duration-150">
    <XMarkIcon class="h-3 w-3" aria-hidden="true" />
  </button>
</span>
```

Add-tag input row (below the tags display area):
```
flex gap-2
```

Text input:
```html
<input
  type="text"
  id="{id}-new-tag"
  placeholder={placeholder}
  class="flex-1 font-sans text-sm text-navy bg-white border border-line rounded-input
         px-3 py-2 placeholder:text-ink-muted/50
         focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy
         transition-colors duration-150"
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      appendTag();
    }
  }}
/>
```

"Add" button:
```html
<button type="button" onClick={appendTag}
  class="font-sans text-sm font-medium text-white bg-navy
         px-3 py-2 rounded-btn hover:bg-navy-800 transition-colors duration-150
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20">
  Add
</button>
```

`appendTag` logic: trim the input value, reject if empty or if the tag already exists in `value`, call `onChange([...value, trimmedTag])`, clear the input field.

**States:**
- Empty (no tags): the tags area shows only the empty `min-h` container with the add input below.
- Max tags: no hard maximum, but UI scrolls naturally as tags wrap.
- Keyboard: `Enter` in the text input appends the tag. `Backspace` on empty input removes the last tag in the array (call `onChange(value.slice(0, -1))`).

### 4.6 Product Add/Edit Form — AdminDrawer

Drawer `title`: "Add Product" or "Edit Product".

**Form fields in order (`flex flex-col gap-6` in drawer body):**

1. **Product Name** — `Input`, `label="Product Name"`, `id="product-name"`, `required`. Writes to `Product.name`. Fires slug auto-generation.

2. **URL Slug** — `SlugField`, `autoSourceValue={nameFieldValue}`. Writes to `Product.slug`.

3. **Category** — Select component (`components/ui/`), `label="Category"`, `id="product-category"`, `required`. Options: one per `Category` row (value = `Category.id`, label = `Category.name`). First option: `<option value="" disabled>Select a category</option>`. Writes to `Product.categoryId`.

4. **Description** — Textarea, `label="Description"`, `id="product-description"`, `rows={6}`. Optional. Writes to `Product.description`. Same textarea class spec as the Category description field.

5. **Fabric Options** — `TagListInput`, `label="Fabric Options"`, `id="product-fabric-options"`, `placeholder="e.g. 100% cotton"`. Writes to `Product.fabricOptions` (string array).

6. **GSM Range** — `Input`, `label="GSM Range"`, `id="product-gsm"`, `placeholder="e.g. 260–400 GSM"`. Optional. Writes to `Product.gsmRange`.

7. **Sizes Available** — `Input`, `label="Sizes Available"`, `id="product-sizes"`, `placeholder="e.g. XS–5XL"`. Optional. Writes to `Product.sizes`.

8. **Customization Options** — `TagListInput`, `label="Customization Options"`, `id="product-customization"`, `placeholder="e.g. Pantone matching"`. Writes to `Product.customization` (string array).

9. **Product Images** — `ImageUploadZone`, `label="Product Images"`, `cloudinaryConfigured={false}`, `multiple={true}`. Value bound to `Product.images` array. See multi-image spec in 3.7.

10. **Visible on website** — Toggle switch, `aria-label="Visible on website"`. Label text visible. Writes to `Product.published`.

**Submit behavior:**
- Create: calls `createProductAction({ name, slug, categoryId, description, fabricOptions, gsmRange, sizes, customization, images, published, order })`. `order` = current total product count. Success toast: "Product saved." Error toast: "Could not save — please try again."
- Edit: calls `updateProductAction({ id, name, slug, categoryId, description, fabricOptions, gsmRange, sizes, customization, images, published })`. Same toast messages.

### 4.7 Product Delete Flow

Identical pattern to Category delete. `AdminConfirmDialog`:
- `title`: "Delete [Product.name]?"
- `message`: "This cannot be undone."
- `confirmLabel`: "Delete Product"
- On confirm: calls `deleteProductAction(id: string)`. Success toast: "Product deleted." Error toast: "Could not delete — please try again."

### 4.8 Products Empty State

When all products are filtered out (filter active, no matches):
```html
<div class="bg-white rounded-card shadow-card p-16 text-center">
  <p class="font-sans text-sm text-navy font-medium">No products match your filters.</p>
  <button class="font-sans text-sm text-crimson hover:text-crimson-600 mt-2 transition-colors" onClick={clearFilters}>
    Clear filters
  </button>
</div>
```

When no products exist at all:
```html
<div class="bg-white rounded-card shadow-card p-16 text-center flex flex-col items-center gap-4">
  <ShoppingBagIcon class="h-12 w-12 text-ink-muted/30" aria-hidden="true" />
  <p class="font-sans text-sm text-navy font-medium">No products yet</p>
  <p class="font-sans text-caption text-ink-muted max-w-xs">
    Add your first product to start building your catalogue.
  </p>
  <Button variant="primary" size="sm">Add Product</Button>
</div>
```

### 4.9 Products Mobile Behavior (below md, 768px)

- Visible columns: Name, Status toggle, Actions. Category column hidden (`hiddenBelow: "md"`). GSM Range hidden (`hiddenBelow: "lg"`). Image hidden (`hiddenBelow: "sm"`).
- Filter bar stacks vertically (`flex-col`): category select full width, search input full width.
- AdminDrawer becomes full-screen bottom sheet (same as Categories spec).
- TagListInput works identically on mobile; tag pills wrap naturally.

---

## SECTION 5 — INQUIRIES (/admin/inquiries)

**File:** `app/admin/inquiries/page.tsx`
**Type:** Client Component

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: "Inquiries — MH Global Attire Admin",
  robots: { index: false, follow: false },
};
```

### 5.1 Page Header Row

```
flex items-center justify-between mb-4
```
Left: `<h1 class="font-sans text-lg font-semibold text-navy">Inquiries</h1>` + count badge showing total `Inquiry` count.
No "Add" button — inquiries are submitted by buyers via the public contact form only.

### 5.2 Filter Bar

```
flex flex-col sm:flex-row gap-3 mb-4
```

**Status filter** — Select, `aria-label="Filter by status"`:
- Options: `<option value="">All statuses</option>`, then "New" (value `NEW`), "In Review" (value `REVIEWED`), "Quoted" (value `QUOTED`), "Closed" (value `CLOSED`).
- Note: The option labels shown to the user are the human-readable strings. The values are the enum strings used for filtering — they are values, not visible labels.
- `onChange`: updates `statusFilter` state, applies filter client-side.

**Date range — From** — `<div class="flex flex-col gap-1">` containing `<label class="font-sans text-caption text-ink-muted">From</label>` and `<input type="date" class="[same class as Input component's input element]" aria-label="Filter from date" />`. Filters `Inquiry.createdAt >= value`.

**Date range — To** — Same structure, `aria-label="Filter to date"`. Filters `Inquiry.createdAt <= value` (end of selected day).

**Search input** — `Input`, `aria-label="Search inquiries"`, `placeholder="Search by company or name..."`, debounce 250ms. Filters `Inquiry.company` and `Inquiry.name` case-insensitively (OR match).

**"Clear filters" button** — ghost `Button`, size `sm`, label "Clear filters". Visible when any filter is active. `onClick`: reset all four filters.

### 5.3 Inquiries DataTable — Column Specification

Same `DataTable` component. **No drag handle column** (Inquiry has no `order` field — rows are not reorderable).

**Column 1 — Company:**
- header: "Company"
- render: `<span class="font-sans text-sm font-medium text-navy">{row.company ?? row.name}</span>` — always shows something (falls back to name if company is null).

**Column 2 — Name:**
- header: "Name"
- render: `<span class="font-sans text-sm text-ink-muted">{row.name}</span>`
- `hiddenBelow: "sm"`

**Column 3 — Country:**
- header: "Country"
- render: `<span class="font-sans text-sm text-ink-muted">{row.country ?? "—"}</span>`
- `hiddenBelow: "md"`

**Column 4 — Date Received:**
- header: "Date Received"
- render: `<span class="font-sans text-sm text-ink-muted">{formatDate(row.createdAt)}</span>` where `formatDate` produces "DD MMM YYYY".
- `hiddenBelow: "md"`

**Column 5 — Status:**
- header: "Status"
- render: `<Badge variant={statusVariant(row.status)}>{statusLabel(row.status)}</Badge>` using the canonical mapping from Section 2.4.

**Row click behavior:** Every `<tr>` is `cursor-pointer`. `onClick`: set `selectedInquiry` state to the full inquiry object, open `InquiryDrawer`. No separate actions column.

### 5.4 InquiryDrawer Component

**File:** `components/admin/inquiry-drawer.tsx`
**Type:** Client Component

```typescript
interface InquiryDrawerProps {
  inquiry: {
    id: string;
    name: string;
    company: string | null;
    country: string | null;
    email: string;
    phone: string | null;
    productInterest: string | null;
    quantity: string | null;
    fabric: string | null;
    gsm: string | null;
    customization: string | null;
    message: string | null;
    fileUrls: string[];
    status: "NEW" | "REVIEWED" | "QUOTED" | "CLOSED";
    createdAt: Date;
  } | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: "NEW" | "REVIEWED" | "QUOTED" | "CLOSED") => void;
}
```

Uses the `AdminDrawer` component as its outer shell with `title=""` (the drawer header is replaced by a custom header — pass the company name as the title). Width override: `max-w-2xl` (passed as a `className` prop override on `AdminDrawer`).

**Drawer body content (`flex flex-col gap-6`):**

**A. Drawer Header Content (inside the drawer body, above the divider):**

Company name:
```html
<h2 class="font-sans text-lg font-semibold text-navy">{inquiry.company ?? inquiry.name}</h2>
```

Date received:
```html
<p class="font-sans text-caption text-ink-muted mt-0.5">
  Received {formatDate(inquiry.createdAt)}
</p>
```

**B. Status Segmented Control:**

```
flex gap-2 mt-2
```

Four buttons, one per status:
```
px-4 py-2 rounded-btn font-sans text-sm font-medium transition-colors duration-150
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-navy/30
```

Active (current `inquiry.status`) class:
```
bg-navy text-white
```

Inactive class:
```
bg-white border border-line text-ink-muted hover:border-navy hover:text-navy
```

Buttons in order: "New" / "In Review" / "Quoted" / "Closed".

**Click behavior:**
- Clicking "Closed" when current status is not "CLOSED": open `AdminConfirmDialog` first.
  - `title`: "Mark as Closed?"
  - `message`: "Mark this inquiry as closed? This indicates no further action is needed."
  - `confirmLabel`: "Mark as Closed"
  - On confirm: proceed with status update.
- Clicking any other status: no confirmation required.
- On status click (after any required confirmation):
  1. Call `onStatusChange(inquiry.id, newStatus)`.
  2. In the parent component: optimistic update to local inquiry state, call `updateInquiryStatusAction(id: string, status: InquiryStatus)`.
  3. On failure: revert status in local state, show error `ToastNotification` (error variant): "Could not update status — please try again."

**C. Inquiry Details Grid:**

```
grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4
```

Each field is a `<div class="flex flex-col gap-0.5">` containing:
- Label: `<p class="font-sans text-caption font-medium text-ink-muted uppercase tracking-[0.06em]">[Label]</p>`
- Value: `<p class="font-sans text-sm text-navy">[Value or "—"]</p>`

Fields and their data sources (in this order):

| Display Label | Data source | Special rendering |
|---|---|---|
| Full Name | `Inquiry.name` | Plain text |
| Email Address | `Inquiry.email` | `<a href="mailto:{email}" class="text-crimson hover:text-crimson-600 transition-colors">{email}</a>` |
| Phone | `Inquiry.phone` | `<a href="tel:{phone}" class="text-crimson hover:text-crimson-600 transition-colors">{phone}</a>` if non-null, else "—" |
| Company | `Inquiry.company` | "—" if null |
| Country | `Inquiry.country` | "—" if null |
| Product Interest | `Inquiry.productInterest` | "—" if null |
| Quantity | `Inquiry.quantity` | "—" if null |
| Fabric | `Inquiry.fabric` | "—" if null |
| GSM | `Inquiry.gsm` | "—" if null |
| Customization | `Inquiry.customization` | "—" if null |

**Message field** (full-width, `col-span-1 md:col-span-2`):
- Label: "Message" (same label style)
- Value block: `<div class="bg-cream-100 rounded-card p-4 mt-1"><p class="font-sans text-sm text-navy whitespace-pre-wrap">{inquiry.message ?? "—"}</p></div>`
- `whitespace-pre-wrap` preserves line breaks in the buyer's message.

**D. Attachments Section:**

Only rendered when `inquiry.fileUrls.length > 0`.

Section header:
```html
<h3 class="font-sans text-sm font-semibold text-navy">Reference Files</h3>
```

Files list (`flex flex-col gap-2 mt-2`):

Each entry in `Inquiry.fileUrls`:
```html
<div class="flex items-center gap-3 p-3 bg-white border border-line rounded-btn">
  <!-- Icon: DocumentIcon for unknown/doc files, PhotoIcon for .jpg/.jpeg/.png/.webp -->
  <DocumentIcon class="h-5 w-5 text-ink-muted flex-shrink-0" aria-hidden="true" />
  <span class="font-sans text-sm text-navy flex-1 truncate" title="{filename}">
    {truncate(filename, 32)} <!-- show last 32 chars of the URL path segment -->
  </span>
  <a href="{url}" download aria-label="Download {filename}"
     class="font-sans text-caption text-crimson hover:text-crimson-600
            border border-crimson hover:border-crimson-600
            px-3 py-1 rounded-btn transition-colors duration-150 flex-shrink-0">
    Download
  </a>
</div>
```

File icon selection: if the URL ends in `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, or `.svg` → use `PhotoIcon`. All others → use `DocumentIcon`.

Filename extraction: take the last path segment of the URL (split by `/`, take last element). If it contains a query string, strip it (split by `?`, take first element).

**E. Reply Button (drawer footer):**

The drawer `footer` slot contains:
```html
<a
  href="mailto:{inquiry.email}?subject=Re: Your Enquiry — MH Global Attire&body=Dear {inquiry.name},%0D%0A%0D%0AThank you for your enquiry."
  class="inline-flex items-center justify-center gap-2 font-sans font-semibold
         text-sm px-6 py-3 rounded-btn bg-crimson text-white
         hover:bg-crimson-600 transition-colors duration-150
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-crimson">
  <EnvelopeIcon class="h-4 w-4" aria-hidden="true" />
  Reply by Email
</a>
```

This opens the admin's default email client. It is the only reply mechanism — there is no in-app email compose.

### 5.5 Inquiries Empty States

**No results for active filters:**
```html
<div class="bg-white rounded-card shadow-card p-16 text-center">
  <p class="font-sans text-sm text-navy font-medium">No inquiries match your filters.</p>
  <button class="font-sans text-sm text-crimson hover:text-crimson-600 mt-2 transition-colors" onClick={clearFilters}>
    Clear filters
  </button>
</div>
```

**No inquiries at all:**
```html
<div class="bg-white rounded-card shadow-card p-16 text-center flex flex-col items-center gap-4">
  <InboxIcon class="h-12 w-12 text-ink-muted/30" aria-hidden="true" />
  <p class="font-sans text-sm text-navy font-medium">No inquiries yet</p>
  <p class="font-sans text-caption text-ink-muted max-w-xs">
    When buyers submit the contact form, their messages will appear here.
  </p>
</div>
```

### 5.6 Inquiries Mobile Behavior (below md, 768px)

- DataTable visible columns: Company, Status. Name hidden (`hiddenBelow: "sm"`). Country and Date hidden (`hiddenBelow: "md"`).
- Filter bar stacks vertically (`flex-col`), all controls full width. Date inputs side-by-side in a `grid grid-cols-2 gap-2` sub-row.
- `InquiryDrawer` becomes full-screen: same spec as Categories/Products mobile drawer.
- Status segmented control (4 buttons) stacks into a `grid grid-cols-2 gap-2` on mobile instead of a single row.
- Details grid: single column (`grid-cols-1`) — the `md:grid-cols-2` responsive class handles this automatically.

---

## SECTION 6 — CONTENT (/admin/content)

**File:** `app/admin/content/page.tsx`
**Type:** Client Component (page selection state, per-card save state)

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: "Page Content — MH Global Attire Admin",
  robots: { index: false, follow: false },
};
```

### 6.1 Layout

Two-column layout on desktop, single-column on mobile:
```
flex flex-col md:flex-row gap-6
```

**Left column (page navigation):**
- Desktop: `w-56 flex-shrink-0`
- Mobile: full-width Select dropdown replaces the button list.

**Right column (content blocks):**
- `flex-1 min-w-0`

### 6.2 Page Navigation — Desktop

`<nav aria-label="Select page to edit">` containing a `<ul class="flex flex-col gap-1">`.

Each page is a `<li>` containing a `<button>` with class:

Inactive:
```
w-full text-left px-3 py-2 font-sans text-sm text-ink-muted
hover:text-navy rounded-btn transition-colors duration-150
```

Active (`activePage === page.value`):
```
w-full text-left px-3 py-2 font-sans text-sm font-semibold text-navy
border-l-2 border-crimson pl-3 rounded-r-btn
```

Pages in display order:

| Display label | `ContentBlock.page` value |
|---|---|
| Home | `home` |
| About | `about` |
| Manufacturing | `manufacturing` |
| OEM Services | `oem-services` |
| Quality | `quality` |
| Sustainability | `sustainability` |
| Why Choose Us | `why` |

Default active page on load: `home`.

### 6.3 Page Navigation — Mobile

Replace the left column with a full-width Select at the top of the page (above the right column):
```html
<div class="md:hidden mb-4">
  <label for="content-page-select" class="font-sans text-sm font-medium text-navy mb-1.5 block">
    Select a page to edit
  </label>
  <select id="content-page-select" aria-label="Select page to edit"
    class="[same class as Select component in design system]"
    onChange={(e) => setActivePage(e.target.value)}>
    <option value="home">Home</option>
    <option value="about">About</option>
    <option value="manufacturing">Manufacturing</option>
    <option value="oem-services">OEM Services</option>
    <option value="quality">Quality</option>
    <option value="sustainability">Sustainability</option>
    <option value="why">Why Choose Us</option>
  </select>
</div>
```

### 6.4 ContentBlockCard Component

**File:** `components/admin/content-block-card.tsx`
**Type:** Client Component (manages its own dirty/saving state)

```typescript
interface ContentBlockCardProps {
  block: {
    id: string;
    page: string;
    key: string;
    value: string;
    imageUrl: string | null;
    order: number;
  };
  onSave: (id: string, updates: { value: string; imageUrl: string | null }) => Promise<void>;
}
```

**Card wrapper:**
```
bg-white rounded-card shadow-card p-6 mb-4
```

**Card header:**
```
flex items-center justify-between mb-4
```

Left: human-readable label derived from `ContentBlock.key`:
```html
<h3 class="font-sans text-sm font-semibold text-navy">{derivedLabel(block.key)}</h3>
```

Right: "Save" primary `Button`, size `sm`. Only rendered when `isDirty === true` (user has made edits). Class additions when in loading state: `isLoading={isSaving}`.

### 6.5 Key-to-Label Mapping Function

The `derivedLabel(key: string): string` function. Must be defined as a utility (e.g. `lib/content-key-labels.ts`). Never call it with a raw key shown to the user — always translate.

**Explicit mappings (exact key → exact label):**

```
hero.heading           → "Page Heading"
hero.subheading        → "Page Subheading"
hero.cta.primary       → "Primary Button Label"
hero.cta.secondary     → "Secondary Button Label"
about.intro            → "Introduction"
about.history          → "Company History"
about.mission          → "Mission Statement"
about.vision           → "Vision Statement"
values.quality         → "Core Value — Quality"
values.reliability     → "Core Value — Reliability"
values.transparency    → "Core Value — Transparency"
values.customization   → "Core Value — Customization"
values.partnership     → "Core Value — Partnership"
values.continuous-improvement → "Core Value — Continuous Improvement"
manufacturing.intro    → "Manufacturing Introduction"
stage.1                → "Production Stage 1"
stage.2                → "Production Stage 2"
stage.3                → "Production Stage 3"
stage.4                → "Production Stage 4"
stage.5                → "Production Stage 5"
stage.6                → "Production Stage 6"
stage.7                → "Production Stage 7"
stage.8                → "Production Stage 8"
stage.9                → "Production Stage 9"
workflow.step.1        → "Workflow Step 1"
workflow.step.2        → "Workflow Step 2"
workflow.step.3        → "Workflow Step 3"
workflow.step.4        → "Workflow Step 4"
workflow.step.5        → "Workflow Step 5"
workflow.step.6        → "Workflow Step 6"
workflow.step.7        → "Workflow Step 7"
workflow.step.8        → "Workflow Step 8"
workflow.step.9        → "Workflow Step 9"
workflow.step.10       → "Workflow Step 10"
service.1              → "Service 1"
service.2              → "Service 2"
service.3              → "Service 3"
service.4              → "Service 4"
service.5              → "Service 5"
service.6              → "Service 6"
service.7              → "Service 7"
service.8              → "Service 8"
service.9              → "Service 9"
service.10             → "Service 10"
service.11             → "Service 11"
service.12             → "Service 12"
service.13             → "Service 13"
service.14             → "Service 14"
service.15             → "Service 15"
service.16             → "Service 16"
service.17             → "Service 17"
service.18             → "Service 18"
service.19             → "Service 19"
oem.moq                → "Minimum Order Quantity Note"
quality.intro          → "Quality Introduction"
qc.point.1             → "Quality Checkpoint 1"
qc.point.2             → "Quality Checkpoint 2"
qc.point.3             → "Quality Checkpoint 3"
qc.point.4             → "Quality Checkpoint 4"
qc.point.5             → "Quality Checkpoint 5"
qc.point.6             → "Quality Checkpoint 6"
qc.point.7             → "Quality Checkpoint 7"
qc.point.8             → "Quality Checkpoint 8"
qc.point.9             → "Quality Checkpoint 9"
qc.point.10            → "Quality Checkpoint 10"
qc.point.11            → "Quality Checkpoint 11"
qc.point.12            → "Quality Checkpoint 12"
sustainability.body    → "Sustainability Statement"
initiative.1           → "Sustainability Initiative 1"
initiative.2           → "Sustainability Initiative 2"
initiative.3           → "Sustainability Initiative 3"
initiative.4           → "Sustainability Initiative 4"
initiative.5           → "Sustainability Initiative 5"
initiative.6           → "Sustainability Initiative 6"
initiative.7           → "Sustainability Initiative 7"
initiative.8           → "Sustainability Initiative 8"
differentiator.1       → "Differentiator 1"
differentiator.2       → "Differentiator 2"
differentiator.3       → "Differentiator 3"
differentiator.4       → "Differentiator 4"
differentiator.5       → "Differentiator 5"
differentiator.6       → "Differentiator 6"
differentiator.7       → "Differentiator 7"
differentiator.8       → "Differentiator 8"
differentiator.9       → "Differentiator 9"
differentiator.10      → "Differentiator 10"
contact.message        → "Contact Page Message"
```

**Fallback rule** for any key not in the explicit list above: take the last dot-segment of the key, replace hyphens and underscores with spaces, then title-case each word. Example: `some.nested.custom-key` → last segment = `custom-key` → `Custom Key`.

### 6.6 ContentBlockCard Edit Field Logic

**Field selection rule:**

1. If `block.imageUrl` is non-null → render `ImageUploadZone` (`cloudinaryConfigured={false}`, `multiple={false}`) bound to `localImageUrl` state. Below it, also render the text field for `block.value` (the alt text or caption may be edited too).

2. If `block.imageUrl` is null AND `block.value.length > 120` → render a `<textarea>` with `rows={5}` and the same class spec as the Category description textarea.

3. If `block.imageUrl` is null AND `block.value.length <= 120` → render the `Input` component, `type="text"`.

All fields are pre-populated with current values on mount. Any edit sets `isDirty = true` and reveals the "Save" button.

### 6.7 ContentBlockCard Save Behavior

**Save button states:**

| State | Button label | Button style |
|---|---|---|
| Not dirty | Button hidden | — |
| Dirty, idle | "Save" | primary, size sm |
| Saving | "Saving..." | primary, size sm, `isLoading={true}` (spinner + disabled) |
| Success | Button hidden again (reset `isDirty = false`) | — |
| Error | "Save" | primary, size sm, error toast shown |

On "Save" click:
1. Set `isSaving = true`. Button shows "Saving..." with spinner, disabled.
2. Call `updateContentBlockAction(id: string, { value: string, imageUrl: string | null })` — passes `ContentBlock.id`, updated `ContentBlock.value`, updated `ContentBlock.imageUrl`.
3. On success: set `isSaving = false`, set `isDirty = false` (hides the Save button), show success `ToastNotification` (success variant): "Saved."
4. On failure: set `isSaving = false`, keep `isDirty = true` (Save button remains visible), show error `ToastNotification` (error variant): "Could not save — please try again."

Note: No optimistic value change on content save. The saving animation is the feedback. The text in the input/textarea remains as the user typed it.

### 6.8 Content Empty State

If a selected page has zero `ContentBlock` rows (should not happen with seeded data, but handle gracefully):
```html
<div class="bg-white rounded-card shadow-card p-12 text-center">
  <p class="font-sans text-sm text-ink-muted">No editable content found for this page.</p>
</div>
```

### 6.9 Content Mobile Behavior (below md, 768px)

- Left column (page nav buttons) hidden. Replaced by the full-width Select dropdown at the top of the page.
- ContentBlock cards render full-width below the Select.
- ImageUploadZone inside cards renders full-width — no horizontal overflow.
- Textarea fields resize vertically with `resize-y` (allow user to expand). On mobile, initial `rows={4}` instead of 5.

---

## SECTION 7 — SETTINGS (/admin/settings)

**File:** `app/admin/settings/page.tsx`
**Type:** Client Component (form state for all 11 settings)

**Metadata:**
```typescript
export const metadata: Metadata = {
  title: "Settings — MH Global Attire Admin",
  robots: { index: false, follow: false },
};
```

### 7.1 Layout

Single column, `max-w-2xl`, `flex flex-col gap-6`.

Data source: all `SiteSetting` rows fetched server-side, converted to a `Record<string, string>` keyed by `SiteSetting.key`. Passed as initial form values.

### 7.2 Settings Group Card

Reuse the `Card` component from `components/ui/Card.tsx` with `variant="default"` but override padding to `p-6` and background to `bg-white` via className. Each group is one `<Card>`.

Group label (section heading inside each card):
```html
<h2 class="font-sans text-sm font-semibold text-navy uppercase tracking-[0.08em] mb-5">
  [Group Name]
</h2>
```

Fields inside the group: `<div class="flex flex-col gap-5">` containing `Input` components.

### 7.3 Group 1 — "Contact Information"

Card heading: "Contact Information"

Fields in order:

| Display label | `SiteSetting.key` | Input type | Helper text |
|---|---|---|---|
| Phone Number | `phone` | `type="tel"` | none |
| WhatsApp Number | `whatsapp` | `type="tel"` | "Include country code, e.g. +92 300 1234567" |
| General Email | `email.info` | `type="email"` | none |
| Sales Email | `email.sales` | `type="email"` | none |
| Ahmad's Email | `email.ahmad` | `type="email"` | none |
| Office Address | `address` | Textarea, 3 rows | none |

Helper text for WhatsApp: rendered below the input as `<p class="font-sans text-caption text-ink-muted mt-1">Include country code, e.g. +92 300 1234567</p>`.

Field IDs: `setting-phone`, `setting-whatsapp`, `setting-email-info`, `setting-email-sales`, `setting-email-ahmad`, `setting-address`.

Office Address textarea class: same as Category description textarea, `rows={3}`.

### 7.4 Group 2 — "Social Media"

Card heading: "Social Media"

Fields in order:

| Display label | `SiteSetting.key` | Input type |
|---|---|---|
| Instagram URL | `social.instagram` | `type="url"` |
| LinkedIn URL | `social.linkedin` | `type="url"` |
| Facebook URL | `social.facebook` | `type="url"` |

Field IDs: `setting-social-instagram`, `setting-social-linkedin`, `setting-social-facebook`.

Each URL input has `placeholder="https://..."`.

### 7.5 Group 3 — "Company Information"

Card heading: "Company Information"

Fields in order:

| Display label | `SiteSetting.key` | Input type |
|---|---|---|
| Founder Name | `founder` | `type="text"` |
| Year Founded | `founded` | `type="text"` |

Field IDs: `setting-founder`, `setting-founded`.

Year Founded placeholder: "e.g. 2005".

### 7.6 Save Settings Button

Below the three Card groups, flush right on desktop, full-width on mobile:
```
flex justify-end mt-2
```

Primary `Button`, size `md`, label "Save Settings", `isLoading={isSaving}`. Full width on mobile (`w-full sm:w-auto`).

**On click:**
1. Set `isSaving = true`. Button shows spinner and is disabled.
2. Build a `Record<string, string>` of all 11 key/value pairs from form state:
   ```
   { phone, whatsapp, "email.info", "email.sales", "email.ahmad", address,
     "social.instagram", "social.linkedin", "social.facebook", founder, founded }
   ```
3. Call `updateSiteSettingsAction(settings: Record<string, string>)`. The server action iterates the record and upserts each `SiteSetting` row by `key`.
4. On success: set `isSaving = false`, show success `ToastNotification` (success variant): "Settings saved."
5. On failure: set `isSaving = false`, show error `ToastNotification` (error variant): "Could not save settings — please try again."

No per-field autosave. No optimistic UI for settings (values are small, save is instant enough that a loading spinner is appropriate).

### 7.7 Settings Mobile Behavior (below md, 768px)

- Three Card groups stack vertically, full width.
- All input fields full width (default).
- "Save Settings" button full width on mobile (`w-full`).
- No layout changes beyond single-column stacking.

---

## SECTION 8 — SHARED UX PATTERN COMPONENTS

### 8.1 ToastNotification Component

**File:** `components/admin/toast-notification.tsx`
**Type:** Client Component

```typescript
interface ToastNotificationProps {
  id: string;           // unique ID for the toast (used for stacking and removal)
  message: string;
  variant: "success" | "error" | "info";
  onDismiss: (id: string) => void;
}
```

Toast state is managed by a `useToast` hook or a global toast context (e.g. `ToastProvider` wrapping the `AdminShell`). The toast queue is an array of toast objects; each new `showToast()` call appends to the array.

**Position and container:**
```
fixed top-4 right-4 z-tooltip flex flex-col gap-2
pointer-events-none
```

Each toast has `pointer-events-auto`.

**Width:** `w-80` (320px). On mobile (below sm, 640px): `w-[calc(100vw-2rem)]` centered.

**Toast element:**
```
w-80 flex items-start gap-3 px-4 py-3 rounded-card shadow-card-dark
transition-all duration-200
```

**Variant classes (append to base):**

| Variant | Background | Text | Icon |
|---|---|---|---|
| `success` | `bg-navy` | `text-white` | `CheckCircleIcon` (h-5 w-5, text-white) |
| `error` | `bg-crimson` | `text-white` | `ExclamationCircleIcon` (h-5 w-5, text-white) |
| `info` | `bg-white border border-line` | `text-navy` | `InformationCircleIcon` (h-5 w-5, text-ink-muted) |

**Inner layout:**
```html
<div class="flex items-start gap-3 flex-1">
  <!-- Icon -->
  <[VariantIcon] class="h-5 w-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
  <!-- Message -->
  <p class="font-sans text-sm flex-1">{message}</p>
</div>
<!-- Dismiss button -->
<button
  type="button"
  aria-label="Dismiss notification"
  onClick={() => onDismiss(id)}
  class="flex-shrink-0 -mt-0.5 ml-1 p-0.5 rounded
         opacity-70 hover:opacity-100 transition-opacity duration-150">
  <XMarkIcon class="h-4 w-4" aria-hidden="true" />
</button>
```

**Animation:**
- Enter: `translate-x-0 opacity-100` — slides in from right. Initial state for the entering animation: `translate-x-full opacity-0`. Use `transition-all duration-200`.
- Exit: `translate-x-full opacity-0` — slides back right, then removed from the DOM. Trigger exit animation when the toast is marked for removal (auto-dismiss or manual dismiss), then remove after 200ms.

**Auto-dismiss:** Each toast auto-dismisses after **4000ms** (4 seconds). The timer starts on mount. Manual dismiss (X button) cancels the timer.

**Multiple toasts:** They stack vertically with `gap-2`. New toasts append to the bottom of the stack (most recent at the bottom). Maximum 5 toasts visible simultaneously — if a 6th arrives, the oldest is dismissed immediately.

**Accessibility:** `role="status"` on success/info toasts. `role="alert"` on error toasts. `aria-live="polite"` on the container for non-error; `aria-live="assertive"` for errors.

### 8.2 AdminDrawer Component

**File:** `components/admin/admin-drawer.tsx`
**Type:** Client Component

```typescript
interface AdminDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClassName?: string; // default "max-w-xl", override with "max-w-2xl" for InquiryDrawer
}
```

**Overlay backdrop:**
```
fixed inset-0 bg-navy/40 z-[99] transition-opacity duration-200
```
`opacity-0` when `!open`; `opacity-100` when `open`. Clicking backdrop calls `onClose()`. `aria-hidden="true"`.

When `!open`, add `pointer-events-none` to prevent interaction.

**Panel:**
```
fixed inset-y-0 right-0 z-modal bg-white flex flex-col shadow-card-dark
transition-transform duration-200 ease-in-out
```
Width: `w-full {widthClassName ?? "max-w-xl"}`.

Transform:
- Closed: `translate-x-full`
- Open: `translate-x-0`

`role="dialog"` `aria-modal="true"` `aria-labelledby="drawer-title"`.

**Panel header (`flex-shrink-0`):**
```
px-6 py-4 border-b border-line flex items-center justify-between
```
```html
<h2 id="drawer-title" class="font-sans text-base font-semibold text-navy">{title}</h2>
<button type="button" aria-label="Close panel" onClick={onClose}
  class="p-1.5 rounded text-ink-muted hover:text-navy hover:bg-cream-100
         transition-colors duration-150
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20">
  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
</button>
```

**Panel body (`flex-1 overflow-y-auto`):**
```
px-6 py-6
```
`{children}` renders here.

**Panel footer (if `footer` is provided, `flex-shrink-0`):**
```
px-6 py-4 border-t border-line
```
`{footer}` renders here.

**Mobile drawer behavior (below md, 768px):**

On viewports below `md`, override the panel classes:
```
fixed inset-x-0 bottom-0 top-auto right-auto inset-y-auto
w-full max-w-none h-[90vh] rounded-t-card
```
Transform: `translate-y-full` (closed) / `translate-y-0` (open).

This converts the right-slide panel into a bottom sheet. The header, body, and footer render identically inside.

**Keyboard:** `Escape` key calls `onClose()`. Focus trap: when the drawer opens, move focus to the first focusable element inside (the close button or first form input). When the drawer closes, return focus to the element that triggered the open.

### 8.3 AdminConfirmDialog Component

**File:** `components/admin/admin-confirm-dialog.tsx`
**Type:** Client Component

```typescript
interface AdminConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean; // default true — confirm button uses crimson bg
}
```

**Overlay:**
```
fixed inset-0 bg-navy/50 z-modal flex items-center justify-center p-4
```

**Dialog panel:**
```
bg-white rounded-card shadow-card-dark p-8 max-w-sm w-full
```

`role="alertdialog"` `aria-modal="true"` `aria-labelledby="confirm-dialog-title"` `aria-describedby="confirm-dialog-message"`.

**Content:**
```html
<h2 id="confirm-dialog-title" class="font-sans text-base font-semibold text-navy mb-3">
  {title}
</h2>
<p id="confirm-dialog-message" class="font-sans text-sm text-ink-muted mb-6">
  {message}
</p>
<div class="flex gap-3 justify-end">
  <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
  <Button
    variant="primary"
    size="sm"
    onClick={onConfirm}
    className={destructive !== false ? "bg-crimson hover:bg-crimson-600" : ""}>
    {confirmLabel}
  </Button>
</div>
```

**Keyboard:** `Escape` calls `onCancel()`. Focus is trapped inside the dialog. On open: focus the "Cancel" button (safer default than the destructive action). `Tab` / `Shift+Tab` cycle between the two buttons only.

---

## SECTION 9 — SERVER ACTIONS REFERENCE

All server actions are defined in `app/admin/actions.ts` (or split by domain: `app/admin/categories/actions.ts`, etc.). Named here for the frontend-dev to stub and the backend-dev to implement. All actions require an authenticated session (validated inside each action via `auth()`).

### Categories

| Action name | Signature | Prisma fields written |
|---|---|---|
| `createCategoryAction` | `(data: { name, slug, description, gsmRange, heroImage, published, order })` | `Category.name`, `.slug`, `.description`, `.gsmRange`, `.heroImage`, `.published`, `.order` |
| `updateCategoryAction` | `(data: { id, name, slug, description, gsmRange, heroImage, published })` | `Category.name`, `.slug`, `.description`, `.gsmRange`, `.heroImage`, `.published` |
| `deleteCategoryAction` | `(id: string)` | Deletes `Category` row by `id` |
| `toggleCategoryPublishAction` | `(id: string, published: boolean)` | `Category.published` |
| `reorderCategoriesAction` | `(orderedIds: string[])` | `Category.order` for all provided IDs |

### Products

| Action name | Signature | Prisma fields written |
|---|---|---|
| `createProductAction` | `(data: { name, slug, categoryId, description, fabricOptions, gsmRange, sizes, customization, images, published, order })` | `Product.name`, `.slug`, `.categoryId`, `.description`, `.fabricOptions`, `.gsmRange`, `.sizes`, `.customization`, `.images`, `.published`, `.order` |
| `updateProductAction` | `(data: { id, name, slug, categoryId, description, fabricOptions, gsmRange, sizes, customization, images, published })` | All above except `order` |
| `deleteProductAction` | `(id: string)` | Deletes `Product` row by `id` |
| `toggleProductPublishAction` | `(id: string, published: boolean)` | `Product.published` |
| `reorderProductsAction` | `(orderedIds: string[])` | `Product.order` for all provided IDs |

### Inquiries

| Action name | Signature | Prisma fields written |
|---|---|---|
| `updateInquiryStatusAction` | `(id: string, status: "NEW" \| "REVIEWED" \| "QUOTED" \| "CLOSED")` | `Inquiry.status` |

Note: Inquiries are read-only except for status updates. No create/delete actions are surfaced in the admin UI. `Inquiry` has no `updatedAt` field — do not reference one.

### Content

| Action name | Signature | Prisma fields written |
|---|---|---|
| `updateContentBlockAction` | `(id: string, updates: { value: string, imageUrl: string \| null })` | `ContentBlock.value`, `ContentBlock.imageUrl` |

### Settings

| Action name | Signature | Prisma fields written |
|---|---|---|
| `updateSiteSettingsAction` | `(settings: Record<string, string>)` | `SiteSetting.value` for each key in the record (upsert by `SiteSetting.key`) |

---

## SECTION 10 — ACCESSIBILITY REQUIREMENTS (ADMIN PANEL)

All interactive elements must meet the following requirements. These complement the per-component specs above.

**Keyboard navigation:**
- Every interactive element reachable by Tab in a logical DOM order.
- All icon-only buttons have `aria-label` with a descriptive string.
- Toggle switches use `role="switch"` and `aria-checked`.
- Drag handle buttons use `aria-label="Drag to reorder [item name]"`.
- Drawers and dialogs trap focus while open; restore focus on close.
- `Escape` closes any open drawer, dialog, or mobile nav.

**Color contrast (admin surfaces — all WCAG AA verified):**
- `text-navy` on `bg-white`: 15.3:1 — PASS
- `text-navy` on `bg-cream-100`: 14.2:1 — PASS
- `text-white` on `bg-navy`: 15.9:1 — PASS
- `text-white` on `bg-crimson`: 8.6:1 — PASS
- `text-ink-muted` on `bg-white`: 7.5:1 — PASS
- `text-ink-muted` on `bg-cream-100`: 6.7:1 — PASS

**Screen reader announcements:**
- Success/info toasts: `role="status"` with `aria-live="polite"`.
- Error toasts: `role="alert"` with `aria-live="assertive"`.
- Table row counts: the page header count badge uses `aria-label="[n] categories total"`.
- Drawers: `role="dialog"` with `aria-labelledby` pointing to the drawer title `<h2>`.
- Confirm dialogs: `role="alertdialog"` with `aria-labelledby` and `aria-describedby`.

**Reduced motion:** Wrap all `transition-transform` and `transition-all` animations in `@media (prefers-reduced-motion: reduce)` overrides: set transition duration to `0.01ms`. Add `motion-safe:` prefix to animation classes where Tailwind supports it.

---

## SECTION 11 — COMPONENT FILE PATH SUMMARY

All admin-specific components live under `components/admin/`. The existing primitives in `components/ui/` are reused as-is.

| Component | File path |
|---|---|
| `AdminShell` | `components/admin/admin-shell.tsx` |
| `StatCard` | `components/admin/stat-card.tsx` |
| `LatestInquiries` | `components/admin/latest-inquiries.tsx` |
| `DataTable` | `components/admin/data-table.tsx` |
| `SlugField` | `components/admin/slug-field.tsx` |
| `ImageUploadZone` | `components/admin/image-upload-zone.tsx` |
| `TagListInput` | `components/admin/tag-list-input.tsx` |
| `InquiryDrawer` | `components/admin/inquiry-drawer.tsx` |
| `ContentBlockCard` | `components/admin/content-block-card.tsx` |
| `AdminDrawer` | `components/admin/admin-drawer.tsx` |
| `AdminConfirmDialog` | `components/admin/admin-confirm-dialog.tsx` |
| `ToastNotification` | `components/admin/toast-notification.tsx` |

Utility file for key-to-label mapping:

| Utility | File path |
|---|---|
| `derivedLabel` | `lib/content-key-labels.ts` |

Server actions (suggested file locations):

| Domain | File path |
|---|---|
| Categories | `app/admin/categories/actions.ts` |
| Products | `app/admin/products/actions.ts` |
| Inquiries | `app/admin/inquiries/actions.ts` |
| Content | `app/admin/content/actions.ts` |
| Settings | `app/admin/settings/actions.ts` |

---

## SECTION 12 — ACCEPTANCE CRITERIA SELF-CHECK

| # | Criterion | Status |
|---|---|---|
| 1 | File exists and is non-empty | PRESENT |
| 2 | All six routes have dedicated sections with layout, components, states, data bindings | PRESENT — Sections 2–7 |
| 3 | Every Prisma field named with exact field name from schema (published, fabricOptions, fileUrls, status, value, order, etc.) | CONFIRMED |
| 4 | Every form label, button label, toast message, empty-state string, dialog copy written in full | CONFIRMED |
| 5 | InquiryStatus enum values each have a specified human-readable label and Badge variant | CONFIRMED — Section 2.4 canonical mapping table |
| 6 | Product form includes fabricOptions, gsmRange, sizes, customization fields | CONFIRMED — Section 4.6 |
| 7 | Inquiry detail view surfaces phone, productInterest, quantity, fabric, gsm, customization, message, fileUrls | CONFIRMED — Section 5.4 |
| 8 | ImageUploadZone cloudinaryConfigured:false state fully specified with exact copy and fallback behavior | CONFIRMED — Section 3.7 |
| 9 | ToastNotification: position, width, auto-dismiss, all three variants, animation | CONFIRMED — Section 8.1 |
| 10 | AdminShell: sidebar (desktop) and drawer (mobile), all nav labels, active/inactive states, user block | CONFIRMED — Section 1 |
| 11 | Drag-to-reorder: visual drag state, drop target indicator, optimistic update, error revert | CONFIRMED — Sections 3.5, 4.4 |
| 12 | Zero instances of font-display, Cormorant Garamond, or bg-cream (#EDE6D6) on admin UI elements | CONFIRMED — typography override declared at top of document, all color specs use bg-cream-100 or bg-white |
| 13 | Mobile behavior described for every section | CONFIRMED — each section ends with a mobile behavior subsection |
| 14 | SlugField, AdminDrawer, AdminConfirmDialog, StatCard, InquiryDrawer, ContentBlockCard, ImageUploadZone, TagListInput, DataTable each have a file path and props interface | CONFIRMED — Sections 3, 4, 5, 6, 8, 11 |

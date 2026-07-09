"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Factory, Settings, ShieldCheck, Leaf, Heart, Phone, Menu, X, ChevronDown, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/ui/Button"
import type { NavCategory } from "@/components/layout/SiteChrome"

/** Ratio locking the notch's curve inflection and side-bar height to the main bar height (see corner-path math below) */
const NOTCH_RATIO = 0.625
const NAV_H_TOP = 88
const NAV_H_SCROLLED = 64
const SCROLL_THRESHOLD = 32
/** Fixed probe line (px from top) used to sample the section behind the navbar */
const PROBE_Y = 28

const leftCornerPath = (h: number) =>
  `M0 0 H50 V${h} C25 ${h} 25 ${h * NOTCH_RATIO} 0 ${h * NOTCH_RATIO} Z`
const rightCornerPath = (h: number) =>
  `M0 0 H50 V${h * NOTCH_RATIO} C25 ${h * NOTCH_RATIO} 25 ${h} 0 ${h} Z`

// ── Backdrop-color detection ─────────────────────────────────────────────────
/** Parse any CSS rgb/rgba string into channels + alpha. */
function parseColor(c: string): { r: number; g: number; b: number; a: number } | null {
  const nums = c.match(/[\d.]+/g)
  if (!nums || nums.length < 3) return null
  const [r, g, b, a] = nums.map(Number)
  return { r, g, b, a: a === undefined ? 1 : a }
}

/** Relative luminance < 0.5 → the surface reads as dark. */
function isDarkColor(c: string): boolean | null {
  const p = parseColor(c)
  if (!p || p.a < 0.35) return null
  return (0.299 * p.r + 0.587 * p.g + 0.114 * p.b) / 255 < 0.5
}

/**
 * Returns whether the page section currently *behind* the navbar is dark.
 * Samples the topmost opaque background at a fixed probe line on every scroll
 * frame — skipping the navbar's own elements — so the bar can invert to the
 * opposite colour of whatever it's floating over, on any page automatically.
 */
function useBackdropDark(): boolean {
  const [dark, setDark] = useState(true) // pages open on a dark hero
  useEffect(() => {
    // getComputedStyle + elementsFromPoint force a layout read, so cap the
    // sampling rate (~10/s) with a trailing pass so the final colour settles.
    let scheduled = false
    let last = 0
    let trailing: ReturnType<typeof setTimeout>
    const sample = () => {
      scheduled = false
      last = performance.now()
      const x = Math.round(window.innerWidth / 2)
      const els = document.elementsFromPoint(x, PROBE_Y)
      for (const el of els) {
        if ((el as HTMLElement).closest("[data-navbar]")) continue
        const bg = getComputedStyle(el as HTMLElement).backgroundColor
        const verdict = isDarkColor(bg)
        if (verdict !== null) {
          setDark(verdict)
          return
        }
      }
    }
    const schedule = () => {
      if (!scheduled) {
        scheduled = true
        requestAnimationFrame(sample)
      }
    }
    const onScroll = () => {
      const since = performance.now() - last
      clearTimeout(trailing)
      if (since >= 100) schedule()
      else trailing = setTimeout(schedule, 100 - since)
    }
    sample()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      clearTimeout(trailing)
    }
  }, [])
  return dark
}

// Fixed h-9 matches the "Request a Quote" button's own box height (text-sm +
// py-2 = 36px). Every nav item — plain links and the Products trigger button
// alike — shares this height so each side's flex row centers its content
// identically; without it, the side containing the taller button silently
// inflates its own row height and every item on that side sits higher than
// the other side's text-only items.
const NavLink = ({ href, label, className }: { href: string; label: string; className?: string }) => (
  <Link
    href={href}
    className={cn("inline-flex h-9 items-center text-sm font-medium transition-colors whitespace-nowrap", className)}
  >
    {label}
  </Link>
)

const leftLinks = [
  { label: "About", href: "/about" },
  { label: "Manufacturing", href: "/manufacturing", icon: Factory },
]

// Quality lives with the left group so both sides balance in width and the
// notch logo sits perfectly centered.
const leftExtraLinks = [
  { label: "Quality", href: "/quality-assurance", icon: ShieldCheck },
]

// Contact sits last so it lands immediately before the "Request a Quote" CTA.
const rightLinks = [
  { label: "OEM Services", href: "/oem-services", icon: Settings },
  { label: "Sustainability", href: "/sustainability", icon: Leaf },
  { label: "Why Us", href: "/why-choose-us", icon: Heart },
  { label: "Contact", href: "/contact", icon: Phone },
]

export function NotchNavbar({
  className,
  categories = [],
  ...props
}: React.HTMLAttributes<HTMLElement> & { categories?: NavCategory[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>()
  const megaRef = useRef<HTMLDivElement>(null)

  // True when the section behind the bar is dark → bar takes the light palette.
  const backdropDark = useBackdropDark()

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > SCROLL_THRESHOLD)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mega menu on outside click / Escape
  useEffect(() => {
    if (!megaOpen) return
    const onClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaOpen(false)
    }
    document.addEventListener("mousedown", onClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [megaOpen])

  const navH = scrolled ? NAV_H_SCROLLED : NAV_H_TOP
  const sideH = navH * NOTCH_RATIO

  const openMega = () => {
    clearTimeout(closeTimer.current)
    setMegaOpen(true)
  }
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 180)
  }

  // ── Inverted palette ───────────────────────────────────────────────────────
  // backdrop dark → cream glass + navy ink; backdrop light → navy glass + white ink.
  // backdrop-blur is re-sampled every scroll frame across 4 stacked glass
  // surfaces, so keep the radius small (blur-sm) and drop the extra saturate
  // pass — the high bg opacity already carries the frosted look cheaply.
  const glass = cn(
    "backdrop-blur-sm transition-colors duration-500",
    backdropDark ? "bg-cream/85" : "bg-navy/80"
  )
  const textMuted = backdropDark ? "text-navy/70 hover:text-navy" : "text-white/80 hover:text-white"
  const dividerBorder = backdropDark ? "border-navy/15" : "border-white/15"
  const strokeClass = backdropDark ? "text-navy" : "text-white"
  const strokeOpacity = backdropDark ? 0.15 : 0.12
  // Logo mark is navy — it needs a light chip only when the bar itself is dark.
  const showChip = !backdropDark

  return (
    <>
      <header
        data-navbar
        className={cn(
          "fixed top-0 inset-x-0 z-50 flex px-0 transition-[height] duration-300 ease-out",
          className
        )}
        style={{ height: navH }}
        {...props}
      >
        {/* Left Side Bar */}
        <div className={cn("flex-1 z-20 relative min-w-0", glass)} style={{ height: sideH }}>
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="100%" x2="100%" y2="100%" stroke="currentColor" strokeOpacity={strokeOpacity} strokeWidth={0.5} className={strokeClass} />
          </svg>
        </div>

        {/* Notch Container */}
        <div className="flex relative z-10 shrink-0 -ml-px transition-[height] duration-300 ease-out" style={{ height: navH }}>
          {/* Left Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0">
            <div className={cn("absolute inset-0", glass)} style={{ clipPath: `path('${leftCornerPath(navH)}')` }} />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 50 ${navH}`} preserveAspectRatio="none">
              <path d={`M0 ${sideH - 0.5} C25 ${sideH - 0.5} 25 ${navH - 0.5} 50 ${navH - 0.5}`} fill="none" stroke="currentColor" strokeOpacity={strokeOpacity} strokeWidth={0.5} className={strokeClass} />
            </svg>
          </div>

          {/* Center Slice */}
          <div className="flex-1 h-full relative min-w-0 -ml-px">
            <div className={cn("absolute inset-0", glass)}>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <line x1="0" y1="100%" x2="100%" y2="100%" stroke="currentColor" strokeOpacity={strokeOpacity} strokeWidth={0.5} className={strokeClass} />
              </svg>
            </div>

            <div className="relative w-full h-full flex items-end justify-between pb-2 px-4 md:px-8">
              {/* Desktop Left Nav — equal min-width + inward (right) alignment mirrors the
                  right group so the logo stays truly centered with symmetric gaps. */}
              <nav className="hidden md:flex xl:justify-end items-center gap-7 mb-1 shrink-0 xl:min-w-[460px]" aria-label="Primary">
                {leftLinks.map((item) => (
                  <NavLink key={item.label} href={item.href} label={item.label} className={textMuted} />
                ))}

                {/* Products — mega-menu trigger */}
                <div
                  className="relative"
                  onMouseEnter={openMega}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={megaOpen}
                    onClick={() => setMegaOpen((v) => !v)}
                    className={cn("flex h-9 items-center gap-1 text-sm font-medium transition-colors", textMuted)}
                  >
                    Products
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", megaOpen && "rotate-180")} />
                  </button>
                </div>

                {leftExtraLinks.map((item) => (
                  <NavLink key={item.label} href={item.href} label={item.label} className={textMuted} />
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <button
                className={cn("md:hidden mb-1 p-1 transition-colors", textMuted)}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo — light chip added only when the bar itself is dark */}
              <div className="flex justify-center shrink-0 mx-2 md:mx-4 mt-1">
                <Link
                  href="/"
                  aria-label="MH Global Attire — Return to Homepage"
                  className={cn(
                    "flex items-center justify-center transition-all duration-300",
                    showChip && "rounded-md bg-cream-100 shadow-card",
                    scrolled ? "h-10 w-10 p-1" : "h-12 w-12 p-1.5"
                  )}
                >
                  <Image
                    src="/logo.png"
                    alt="MH Global Attire"
                    width={144}
                    height={144}
                    className="w-full h-full object-contain"
                    priority
                  />
                </Link>
              </div>

              {/* Desktop Right Nav — matching min-width; content stays left-aligned (toward the logo) */}
              <nav className="hidden md:flex gap-6 items-center mb-1 shrink-0 xl:min-w-[460px]" aria-label="Secondary">
                {rightLinks.map((item) => (
                  <NavLink key={item.label} href={item.href} label={item.label} className={textMuted} />
                ))}
                <div className={cn("pl-4 ml-1 border-l shrink-0", dividerBorder)}>
                  <Button asChild variant="primary" size="sm">
                    <Link href="/request-a-quote">Request a Quote</Link>
                  </Button>
                </div>
              </nav>

              {/* Mobile Right Actions */}
              <div className="md:hidden w-9" />
            </div>
          </div>

          {/* Right Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0 -ml-px">
            <div className={cn("absolute inset-0", glass)} style={{ clipPath: `path('${rightCornerPath(navH)}')` }} />
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 50 ${navH}`} preserveAspectRatio="none">
              <path d={`M0 ${navH - 0.5} C25 ${navH - 0.5} 25 ${sideH - 0.5} 50 ${sideH - 0.5}`} fill="none" stroke="currentColor" strokeOpacity={strokeOpacity} strokeWidth={0.5} className={strokeClass} />
            </svg>
          </div>
        </div>

        {/* Right Side Bar */}
        <div className={cn("flex-1 z-20 relative min-w-0 -ml-px", glass)} style={{ height: sideH }}>
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="100%" x2="100%" y2="100%" stroke="currentColor" strokeOpacity={strokeOpacity} strokeWidth={0.5} className={strokeClass} />
          </svg>
        </div>
      </header>

      {/* Mega Menu — product categories (always dark panel so thumbnails pop) */}
      <div ref={megaRef} data-navbar>
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onMouseEnter={openMega}
            onMouseLeave={scheduleClose}
            className="fixed inset-x-0 z-40 hidden md:block bg-navy/85 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/10 shadow-card-dark"
            style={{ top: navH }}
          >
            <div className="w-full max-w-[1280px] mx-auto px-8 lg:px-12 py-8">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-sans text-caption uppercase tracking-[0.14em] text-white/50">
                  Product Categories
                </h2>
                <Link
                  href="/products"
                  onClick={() => setMegaOpen(false)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-crimson hover:text-crimson-600 transition-colors"
                >
                  View All Products <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-5 gap-4">
                {categories.slice(0, 10).map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products/${cat.slug}`}
                    onClick={() => setMegaOpen(false)}
                    className="group"
                  >
                    <div className="relative aspect-[4/5] rounded-md overflow-hidden bg-navy-800 mb-2">
                      {cat.heroImage && (
                        <Image
                          src={cat.heroImage}
                          alt=""
                          fill
                          sizes="180px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/0 to-navy/0" />
                    </div>
                    <p className="font-sans text-sm font-semibold text-white group-hover:text-crimson transition-colors leading-tight">
                      {cat.name}
                    </p>
                    {cat.gsmRange && (
                      <p className="font-sans text-[0.7rem] text-white/50">{cat.gsmRange}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            data-navbar
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 z-40 bg-navy/95 backdrop-blur-xl border-b border-white/10 p-4 md:hidden shadow-lg overflow-y-auto"
            style={{ top: navH, maxHeight: `calc(100vh - ${navH}px)` }}
          >
            <nav className="flex flex-col gap-1">
              {[...leftLinks, { label: "Products", href: "/products" }, ...leftExtraLinks, ...rightLinks].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="font-medium text-white/90">{item.label}</span>
                </Link>
              ))}

              {categories.length > 0 && (
                <div className="mt-2 pt-3 border-t border-white/10">
                  <p className="px-3 pb-2 font-sans text-caption uppercase tracking-[0.1em] text-white/40">
                    Categories
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products/${cat.slug}`}
                        className="p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-white/70"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="h-px bg-white/10 my-2" />
              <Button asChild variant="primary" size="md" className="w-full">
                <Link href="/request-a-quote" onClick={() => setIsMobileMenuOpen(false)}>
                  Request a Quote
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

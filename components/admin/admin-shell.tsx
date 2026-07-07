"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HomeIcon,
  TagIcon,
  ShoppingBagIcon,
  InboxIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/admin/sign-out-action";
import { ToastProvider } from "@/components/admin/toast-notification";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * DEVIATION: The spec's AdminShellProps interface only declares children,
 * pageTitle, and activePath. AdminShell is a Client Component but its sidebar
 * must display AdminUser.name, AdminUser.email, and a count of NEW inquiries.
 * Since Client Components cannot query Prisma, these values are fetched by the
 * parent Server Component page and passed as props. This is the standard
 * Next.js 14 "lift server data to props" pattern.
 */
export interface AdminShellProps {
  children: React.ReactNode;
  pageTitle: string;
  activePath: string;
  /** Current signed-in admin user — fetched server-side by the page */
  user: { name: string | null; email: string };
  /** Count of Inquiry rows with status=NEW — fetched server-side by the page */
  newInquiryCount: number;
}

// ─── Navigation items ─────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Dashboard", icon: HomeIcon, href: "/admin", exact: true },
  { label: "Categories", icon: TagIcon, href: "/admin/categories", exact: false },
  { label: "Products", icon: ShoppingBagIcon, href: "/admin/products", exact: false },
  { label: "Inquiries", icon: InboxIcon, href: "/admin/inquiries", exact: false },
  { label: "Content", icon: DocumentTextIcon, href: "/admin/content", exact: false },
  { label: "SEO", icon: MagnifyingGlassIcon, href: "/admin/seo", exact: false },
  { label: "Settings", icon: Cog6ToothIcon, href: "/admin/settings", exact: false },
] as const;

function isActive(href: string, exact: boolean, activePath: string): boolean {
  if (exact) return activePath === href;
  return activePath.startsWith(href);
}

// ─── Shared sidebar content (used in both desktop sidebar and mobile drawer) ──

interface SidebarContentProps {
  activePath: string;
  newInquiryCount: number;
  user: { name: string | null; email: string };
  onNavClick?: () => void;
}

function SidebarContent({
  activePath,
  newInquiryCount,
  user,
  onNavClick,
}: SidebarContentProps) {
  const displayName = user.name ?? "Admin";
  const avatarLetter = (user.name ?? user.email)[0]?.toUpperCase() ?? "A";

  return (
    <>
      {/* Logo block */}
      <div className="px-6 py-5 border-b border-white/10">
        <div>
          <Image
            src="/logo.png"
            alt="MH Global Attire"
            width={120}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, href, exact }) => {
            const active = isActive(href, exact, activePath);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={onNavClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-btn text-sm font-medium font-sans",
                    "transition-colors duration-150 w-full",
                    active
                      ? "bg-navy-800 text-white"
                      : "text-white/80 hover:text-white hover:bg-navy-800"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  {label}
                  {label === "Inquiries" && newInquiryCount > 0 && (
                    <span className="ml-auto bg-crimson text-white font-sans text-[0.6875rem] font-semibold px-2 py-0.5 rounded-badge">
                      {newInquiryCount}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User block */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="h-8 w-8 rounded-full bg-navy-800 border border-white/20 flex items-center justify-center text-white font-sans text-sm font-semibold flex-shrink-0">
            {avatarLetter}
          </div>
          {/* Name / email */}
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-sans text-sm font-medium text-white truncate">
              {displayName}
            </span>
            <span className="font-sans text-caption text-white/60 truncate">
              {user.email}
            </span>
          </div>
          {/* Sign-out */}
          <form action={signOutAction}>
            <button
              type="submit"
              aria-label="Sign out"
              className="text-white/60 hover:text-white transition-colors duration-150"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── AdminShell ───────────────────────────────────────────────────────────────

/**
 * AdminShell — full-viewport layout with fixed sidebar (desktop) and
 * slide-in navigation drawer (mobile). Wraps all admin route pages.
 * Spec Section 1.
 *
 * Note: Wraps content in ToastProvider so all child components can call useToast().
 */
export default function AdminShell({
  children,
  pageTitle,
  activePath,
  user,
  newInquiryCount,
}: AdminShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const displayName = user.name ?? "Admin";
  const avatarLetter = (user.name ?? user.email)[0]?.toUpperCase() ?? "A";

  // Focus trap + Escape for mobile nav
  useEffect(() => {
    if (!mobileNavOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileNavOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key === "Tab") {
        const drawer = mobileDrawerRef.current;
        if (!drawer) return;
        const focusable = Array.from(
          drawer.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileNavOpen]);

  // Move focus into drawer on open
  useEffect(() => {
    if (mobileNavOpen) {
      requestAnimationFrame(() => {
        const focusable = mobileDrawerRef.current?.querySelector<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        focusable?.focus();
      });
    }
  }, [mobileNavOpen]);

  return (
    <ToastProvider>
      <div className="font-sans flex h-screen overflow-hidden bg-cream-100">
        {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
        <aside className="hidden lg:flex w-64 flex-shrink-0 bg-navy flex-col h-screen fixed left-0 top-0 z-nav">
          <SidebarContent
            activePath={activePath}
            newInquiryCount={newInquiryCount}
            user={user}
          />
        </aside>

        {/* ── Mobile Overlay ──────────────────────────────────────────────── */}
        {mobileNavOpen && (
          <div
            aria-hidden="true"
            onClick={() => setMobileNavOpen(false)}
            className="fixed inset-0 bg-navy/50 z-[98] lg:hidden"
          />
        )}

        {/* ── Mobile Nav Drawer ───────────────────────────────────────────── */}
        <div
          ref={mobileDrawerRef}
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={cn(
            "fixed inset-y-0 left-0 w-72 bg-navy z-[99] flex flex-col lg:hidden",
            "motion-safe:transform motion-safe:transition-transform motion-safe:duration-200 ease-in-out",
            mobileNavOpen ? "translate-x-0" : "translate-x-[-100%]"
          )}
        >
          <SidebarContent
            activePath={activePath}
            newInquiryCount={newInquiryCount}
            user={user}
            onNavClick={() => setMobileNavOpen(false)}
          />
        </div>

        {/* ── Right side: Header + Main ────────────────────────────────────── */}
        <div className="flex flex-col flex-1 lg:pl-64 min-w-0">
          {/* Header */}
          <header className="h-14 bg-white border-b border-line flex items-center px-4 lg:px-6 fixed top-0 right-0 left-0 lg:left-64 z-[49]">
            {/* Hamburger button (mobile only) */}
            <button
              ref={triggerRef}
              type="button"
              aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setMobileNavOpen((o) => !o)}
              className="flex lg:hidden items-center justify-center w-9 h-9 rounded-btn mr-3
                         text-navy hover:bg-cream-100 transition-colors duration-150
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy/20"
            >
              {mobileNavOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>

            {/* Page title */}
            <span className="font-sans text-sm font-semibold text-navy">
              {pageTitle}
            </span>

            {/* Desktop: user info */}
            <div className="hidden lg:flex items-center gap-3 ml-auto">
              <div className="h-8 w-8 rounded-full bg-navy-800 border border-white/20 flex items-center justify-center text-white font-sans text-sm font-semibold flex-shrink-0">
                {avatarLetter}
              </div>
              <span className="font-sans text-sm font-medium text-navy">
                {displayName}
              </span>
            </div>
          </header>

          {/* Main content */}
          {/* id + tabIndex={-1}: the root layout's skip-to-content link
              (href="#main-content") targets this id on every route,
              including /admin/**, so it must exist here too. */}
          <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto bg-cream-100 pt-14 outline-none">
            <div className="p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

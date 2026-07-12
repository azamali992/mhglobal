"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";

interface TabMedia {
  type: "video" | "image";
  src: string;
  alt: string;
}

interface TabData {
  key: string;
  tabLabel: string;
  heading: string;
  intro: string;
  items: string[];
  href: string;
  linkLabel: string;
  numbered: boolean;
  media: TabMedia;
  mediaTag: string;
}

interface HomeCapabilitiesTabsProps {
  manufacturing: { heading: string; intro: string; stages: string[] };
  quality: { heading: string; intro: string; points: string[] };
  oem: { heading: string; moqNote: string; services: string[] };
}

// Exponential ease-out — settles without bounce, matches the brand's
// "unhurried, precise" motion voice.
const EASE = [0.22, 1, 0.36, 1] as const;

export default function HomeCapabilitiesTabs({ manufacturing, quality, oem }: HomeCapabilitiesTabsProps) {
  const reduceRaw = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && reduceRaw;

  const tabs: TabData[] = [
    {
      key: "production",
      tabLabel: "Production Process",
      heading: manufacturing.heading,
      intro: manufacturing.intro,
      items: manufacturing.stages,
      href: "/manufacturing",
      linkLabel: "View the full manufacturing process",
      numbered: true,
      media: { type: "video", src: "/production.mp4", alt: "MH Global Attire production floor in Faisalabad" },
      mediaTag: "On the production floor",
    },
    {
      key: "quality",
      tabLabel: "Quality Control",
      heading: quality.heading,
      intro: quality.intro,
      items: quality.points,
      href: "/quality-assurance",
      linkLabel: "View quality assurance standards",
      numbered: false,
      media: { type: "image", src: "/quality.jpeg", alt: "Quality inspection of finished garments at MH Global Attire" },
      mediaTag: "In-house quality control",
    },
    {
      key: "oem",
      tabLabel: "OEM & Private Label",
      heading: oem.heading,
      intro: oem.moqNote,
      items: oem.services,
      href: "/oem-services",
      linkLabel: "View OEM & private-label services",
      numbered: false,
      media: { type: "image", src: "/oem.jpg", alt: "OEM and private-label apparel produced by MH Global Attire" },
      mediaTag: "Private-label & OEM",
    },
  ];

  const [active, setActive] = useState(0);
  const current = tabs[active];

  const listV: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.03, delayChildren: 0.08 } },
  };
  const rowV: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
      };

  return (
    <section
      aria-labelledby="home-capabilities-heading"
      className="relative w-full overflow-hidden bg-navy py-16 md:py-24"
    >
      {/* Warm ambient glow anchored behind the media plate — soft depth, not a gradient wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-1/3 h-[520px] w-[520px] rounded-full bg-crimson/20 blur-[130px]"
      />

      <Container className="relative">
        {/* ── Header ── */}
        <div className="max-w-3xl">
          <p className="mb-3 font-sans text-caption font-semibold uppercase tracking-[0.2em] text-crimson-light">
            Manufacturing Capabilities
          </p>
          <h2
            id="home-capabilities-heading"
            className="text-balance font-display text-h2 md:text-h1 text-white"
          >
            Built for Buyers Who Need Precision at Scale
          </h2>
        </div>

        {/* ── Index bar (tabs) ── */}
        <div
          role="tablist"
          aria-label="Manufacturing capability areas"
          className="mt-10 flex gap-7 overflow-x-auto border-b border-white/10 sm:gap-10"
        >
          {tabs.map((tab, i) => {
            const isActive = active === i;
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className="group relative -mb-px shrink-0 pb-4 pt-1 outline-none"
              >
                <span className="flex items-baseline gap-2">
                  <span
                    className={`font-sans text-sm font-semibold tracking-wide transition-colors duration-300 ${
                      isActive ? "text-white" : "text-white/50 group-hover:text-white/80"
                    }`}
                  >
                    {tab.tabLabel}
                  </span>
                  <span
                    className={`font-sans text-caption tabular-nums transition-colors duration-300 ${
                      isActive ? "text-crimson-light" : "text-white/30"
                    }`}
                  >
                    {String(tab.items.length).padStart(2, "0")}
                  </span>
                </span>
                {isActive && (
                  <motion.span
                    layoutId="capability-tab-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-crimson-light"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Spread ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="mt-12 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-[1fr_auto] lg:gap-16"
          >
            {/* Content column */}
            <div className="order-2 lg:order-1">
              <h3 className="max-w-xl text-balance font-display text-h3 md:text-h2 text-white">
                {current.heading}
              </h3>
              <p className="mt-4 max-w-xl font-sans text-body-lg text-white/70 leading-relaxed">
                {current.intro}
              </p>

              <motion.ul
                key={current.key + "-list"}
                variants={listV}
                initial="hidden"
                animate="show"
                className="mt-10 grid grid-cols-1 gap-x-12 sm:grid-cols-2"
              >
                {current.items.map((item, i) => (
                  <motion.li
                    key={item}
                    variants={rowV}
                    className="flex items-baseline gap-4 border-b border-white/10 py-3.5"
                  >
                    <span className="w-7 shrink-0" aria-hidden="true">
                      {current.numbered ? (
                        <span className="font-display text-[1.4rem] leading-none text-crimson-light tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      ) : (
                        <span className="mt-[0.4em] block h-1.5 w-1.5 rotate-45 bg-crimson-light/80" />
                      )}
                    </span>
                    <span className="font-sans text-[0.95rem] text-white/85 leading-snug">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <Link
                href={current.href}
                className="group mt-10 inline-flex items-center gap-2 font-sans text-sm font-semibold text-crimson-light outline-none transition-colors hover:text-white focus-visible:text-white"
              >
                {current.linkLabel}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Media plate — mounted, gallery-style */}
            <div className="relative order-1 mx-auto w-full max-w-[290px] lg:order-2 lg:mx-0 lg:max-w-none">
              {/* Offset backing panel — gives the photo a mounted depth */}
              <div
                aria-hidden="true"
                className="absolute inset-0 -translate-x-3 translate-y-3 rounded-card bg-navy-800 ring-1 ring-white/5"
              />
              <motion.div
                key={current.key + "-media"}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="relative overflow-hidden rounded-card shadow-card-dark ring-1 ring-white/10 lg:h-[470px] lg:w-auto"
                style={{ aspectRatio: current.media.type === "video" ? "9 / 16" : "4 / 5" }}
              >
                {current.media.type === "video" ? (
                  <>
                    <video
                      key={current.media.src}
                      className="absolute inset-0 h-full w-full object-cover"
                      autoPlay={!reduce}
                      muted
                      loop
                      playsInline
                      controls={reduce === true}
                      preload="metadata"
                      aria-label={current.media.alt}
                    >
                      <source src={current.media.src} type="video/mp4" />
                    </video>
                    {/* Tag caption — only on the plain footage; the branded stills
                        carry their own captions and shouldn't be overlaid. */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy via-navy/40 to-transparent p-5">
                      <span aria-hidden="true" className="mb-2 block h-0.5 w-8 bg-crimson-light" />
                      <span className="font-sans text-caption font-semibold uppercase tracking-[0.16em] text-white/90">
                        {current.mediaTag}
                      </span>
                    </div>
                  </>
                ) : (
                  <Image
                    src={current.media.src}
                    alt={current.media.alt}
                    fill
                    sizes="(max-width: 1024px) 290px, 380px"
                    className="object-cover"
                  />
                )}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";

interface TabData {
  key: string;
  tabLabel: string;
  heading: string;
  intro: string;
  items: string[];
  href: string;
  linkLabel: string;
  numbered: boolean;
}

interface HomeCapabilitiesTabsProps {
  manufacturing: { heading: string; intro: string; stages: string[] };
  quality: { heading: string; intro: string; points: string[] };
  oem: { heading: string; moqNote: string; services: string[] };
}

export default function HomeCapabilitiesTabs({ manufacturing, quality, oem }: HomeCapabilitiesTabsProps) {
  const shouldReduceMotionRaw = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const shouldReduceMotion = mounted && shouldReduceMotionRaw;

  const tabs: TabData[] = [
    {
      key: "production",
      tabLabel: "Production Process",
      heading: manufacturing.heading,
      intro: manufacturing.intro,
      items: manufacturing.stages,
      href: "/manufacturing",
      linkLabel: "View Full Manufacturing Process",
      numbered: true,
    },
    {
      key: "quality",
      tabLabel: "Quality Control",
      heading: quality.heading,
      intro: quality.intro,
      items: quality.points,
      href: "/quality-assurance",
      linkLabel: "View Quality Assurance Standards",
      numbered: false,
    },
    {
      key: "oem",
      tabLabel: "OEM & Private Label",
      heading: oem.heading,
      intro: oem.moqNote,
      items: oem.services,
      href: "/oem-services",
      linkLabel: "View OEM & Private-Label Services",
      numbered: false,
    },
  ];

  const [active, setActive] = useState(0);
  const current = tabs[active];

  return (
    <section aria-labelledby="home-capabilities-heading" className="w-full bg-navy py-12 md:py-16">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-2">
              Manufacturing Capabilities
            </p>
            <h2 id="home-capabilities-heading" className="font-display text-h3 md:text-h2 text-white">
              Built for Buyers Who Need Precision at Scale
            </h2>
          </div>

          {/* Tab switcher */}
          <div role="tablist" aria-label="Manufacturing capability areas" className="flex gap-1 bg-white/5 rounded-btn p-1 shrink-0">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={`relative font-sans text-sm font-semibold px-4 py-2 rounded-btn transition-colors whitespace-nowrap ${
                  active === i ? "text-navy" : "text-white/70 hover:text-white"
                }`}
              >
                {active === i && (
                  <motion.span
                    layoutId="capability-tab-pill"
                    className="absolute inset-0 bg-cream rounded-btn -z-10"
                    transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {tab.tabLabel}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-[minmax(0,340px)_1fr] gap-10 md:gap-16"
          >
            <div>
              <h3 className="font-display text-h3 text-white mb-3">{current.heading}</h3>
              <p className="font-sans text-body text-white/70 leading-relaxed mb-6">{current.intro}</p>
              <Link
                href={current.href}
                className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-crimson hover:text-crimson-600 transition-colors"
              >
                {current.linkLabel} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {current.items.map((item, i) => (
                <div
                  key={item}
                  className="rounded-card border border-white/10 bg-white/[0.03] px-4 py-4 flex items-start gap-3"
                >
                  {current.numbered && (
                    <span className="font-display text-h4 text-crimson/70 leading-none shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                  <span className="font-sans text-sm text-white/85 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}

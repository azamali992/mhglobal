"use client";

import { useReducedMotion, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { buildBreadcrumbSchema } from "@/lib/seo";

export interface PageHeroProps {
  eyebrow: string;
  title: string;
  lead?: string;
  breadcrumb: { label: string; href: string }[];
  /** Optional full-bleed background image (navy-scrimmed for legibility) */
  image?: string | null;
  /** Optional bottom meta strip — dense value/label pairs */
  meta?: { value: string; label: string }[];
}

/**
 * Shared premium interior-page hero. Left-aligned editorial layout on a navy
 * field, decorative dotted grid + crimson glow, breadcrumb for SEO/orientation,
 * and top padding that clears the taller glass navbar.
 */
export default function PageHero({ eyebrow, title, lead, breadcrumb, image, meta }: PageHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduce = mounted && shouldReduceMotion;

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, type: "spring" as const, stiffness: 80, damping: 20 },
        };

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumb);

  return (
    <section
      aria-labelledby="page-hero-heading"
      className="relative w-full bg-navy text-white overflow-hidden pt-28 md:pt-36 pb-12 md:pb-16"
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Background image (optional) + navy scrim */}
      {image && (
        <div className="absolute inset-0" aria-hidden="true">
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/60" />
        </div>
      )}

      {/* Decorative dotted grid + crimson radial glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse 80% 60% at 70% 30%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 70% 30%, black, transparent 75%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute -top-1/3 right-0 w-[55%] h-[120%] pointer-events-none"
        style={{ background: "radial-gradient(circle at 70% 30%, rgba(148,28,29,0.35), transparent 60%)" }}
      />

      <Container className="relative z-10">
        {/* Breadcrumb */}
        <motion.nav {...fade(0)} aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 font-sans text-caption text-white/50">
            {breadcrumb.map((c, i) => (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-white/30" aria-hidden="true" />}
                {i < breadcrumb.length - 1 ? (
                  <Link href={c.href} className="hover:text-white transition-colors">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-white/80" aria-current="page">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </motion.nav>

        <motion.p {...fade(0.08)} className="font-sans text-caption font-semibold uppercase tracking-[0.16em] text-crimson mb-4">
          {eyebrow}
        </motion.p>

        <motion.h1 {...fade(0.14)} id="page-hero-heading" className="font-display text-h2 md:text-h1 text-white max-w-4xl">
          {title}
        </motion.h1>

        {lead && (
          <motion.p {...fade(0.22)} className="font-sans text-body-lg text-white/80 max-w-2xl mt-6">
            {lead}
          </motion.p>
        )}

        {meta && meta.length > 0 && (
          <motion.dl {...fade(0.3)} className="grid grid-cols-2 sm:grid-cols-4 border-t border-white/15 mt-10">
            {meta.map((m, i) => (
              <div
                key={m.label}
                className={`py-5 pr-4 ${i > 0 ? "sm:border-l sm:border-white/15 sm:pl-5" : ""} ${
                  i % 2 === 1 ? "border-l border-white/15 pl-5 sm:pl-5" : ""
                } ${i >= 2 ? "border-t border-white/15 sm:border-t-0" : ""}`}
              >
                <dt className="font-display text-h4 text-white leading-none mb-1.5">{m.value}</dt>
                <dd className="font-sans text-caption text-white/55 uppercase tracking-[0.06em] leading-snug">
                  {m.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        )}
      </Container>
    </section>
  );
}

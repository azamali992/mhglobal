"use client";

import { useReducedMotion, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import TextGenerateEffect from "@/components/motion/TextGenerateEffect";
import { useIntroReady } from "@/components/motion/HomeIntro";

interface HomeHeroProps {
  heading: string;
  subheading: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

const SIGNALS = [
  { label: "Faisalabad, Pakistan" },
  { label: "Custom Fabric & GSM" },
  { label: "Private Label & OEM" },
  { label: "Worldwide Export" },
];

export default function HomeHero({ heading, subheading, ctaPrimary, ctaSecondary }: HomeHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Gated on `mounted` — see components/motion/TextGenerateEffect.tsx for why
  // this avoids a server/client hydration mismatch for reduced-motion users.
  const reduceMotion = mounted && shouldReduceMotion;

  // The hero holds its reveal until the intro loader clears — except for
  // reduced-motion users, who should never wait on any animation gate.
  const introReady = useIntroReady();
  const revealNow = reduceMotion || introReady;

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Gentle parallax: the branded backdrop and copy drift at slightly different
  // rates as the hero leaves the viewport. Disabled under reduced motion.
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "7%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: revealNow ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
          transition: { delay, type: "spring" as const, stiffness: 80, damping: 20 },
        };

  return (
    <Section
      ref={sectionRef}
      variant="light"
      id="home-hero"
      aria-labelledby="home-hero-heading"
      className="relative overflow-hidden min-h-[88vh] flex items-center !pt-28 md:!pt-[9rem] !pb-12 md:!pb-16"
    >
      {/* Branded backdrop image (light) — over-sized so the parallax never reveals edges */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-[-10%] h-[120%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealNow ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 1.2, ease: "easeOut" }}
        style={{ y: reduceMotion ? 0 : parallaxY }}
      >
        <Image
          src="/herosectionmhglobal.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] opacity-[0.14] md:opacity-100"
        />
      </motion.div>

      {/* Cream scrims — protect the navy copy on the left while letting the
          branded line-art and logo show through on the right, then blend the
          base into the page below. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-cream via-cream/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-cream/60 via-transparent to-transparent"
      />

      <Container className="relative z-10">
        <motion.div style={{ y: reduceMotion ? 0 : copyY, opacity: reduceMotion ? 1 : fade }}>
          <div className="max-w-3xl">
            <motion.p
              {...fadeUp(0)}
              className="font-sans text-caption font-semibold uppercase tracking-[0.16em] text-crimson mb-5"
            >
              Custom Apparel Manufacturing &amp; Export
            </motion.p>

            <h1
              id="home-hero-heading"
              className="font-display text-h2 md:text-display text-navy mb-6"
            >
              <TextGenerateEffect text={heading} start={revealNow} />
            </h1>

            <motion.p
              {...fadeUp(0.2)}
              className="font-sans text-body-lg text-ink-muted max-w-2xl mb-8"
            >
              {subheading}
            </motion.p>

            <motion.div {...fadeUp(0.32)} className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <Button asChild variant="primary" size="md">
                <Link href="/request-a-quote">{ctaPrimary}</Link>
              </Button>
              <Button asChild variant="secondary" secondaryContext="light" size="md">
                <Link href="/products">{ctaSecondary}</Link>
              </Button>
            </motion.div>
          </div>

          {/* Dense signal strip — fills the lower hero band instead of empty space */}
          <motion.div
            {...fadeUp(0.44)}
            className="grid grid-cols-2 sm:grid-cols-4 border-t border-navy/15"
          >
            {SIGNALS.map((s, i) => (
              <div
                key={s.label}
                className={`py-5 pr-4 ${i > 0 ? "sm:border-l border-navy/15" : ""} ${i % 2 === 1 ? "border-l sm:border-l-0" : ""}`}
              >
                <p className="font-sans text-sm font-semibold text-navy leading-tight">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}

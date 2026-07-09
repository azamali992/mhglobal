"use client";

import { useReducedMotion, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import MovingBorder from "@/components/aceternity/MovingBorder";

interface CtaBandProps {
  heading: string;
  ctaPrimary: string;
  whatsapp: string;
  sectionId?: string;
}

/**
 * Shared CTA band used on all interior pages.
 * Crimson panel inside a dark SectionWrapper.
 * Uses same MovingBorder + WhatsApp link pattern as HomeCtaBand.
 */
export default function CtaBand({
  heading,
  ctaPrimary,
  whatsapp,
  sectionId = "page-cta-heading",
}: CtaBandProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduceMotion = mounted && shouldReduceMotion;

  const fadeIn = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.5 },
        transition: { type: "spring" as const, stiffness: 70, damping: 20 },
      };

  const waNumber = whatsapp.replace(/\s/g, "").replace("+", "");
  const waHref = `https://wa.me/${waNumber}?text=Hello%2C%20I%20am%20interested%20in%20your%20apparel%20manufacturing%20services`;

  return (
    <Section variant="dark" aria-labelledby={sectionId}>
      <Container>
        <motion.div
          {...fadeIn}
          className="bg-crimson rounded-card p-10 md:p-16 text-center"
        >
          <h2 id={sectionId} className="font-display text-h2 text-white mb-8">
            {heading}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MovingBorder>
              <Button asChild variant="secondary" secondaryContext="light" size="md">
                <Link href="/request-a-quote">{ctaPrimary}</Link>
              </Button>
            </MovingBorder>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with MH Global Attire on WhatsApp"
              className="font-sans text-sm font-semibold text-white/80 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-btn px-2 py-1"
            >
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

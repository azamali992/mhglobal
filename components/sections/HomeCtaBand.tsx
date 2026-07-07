"use client";

import { useReducedMotion, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import MovingBorder from "@/components/aceternity/MovingBorder";

interface HomeCtaBandProps {
  heading: string;
  subheading: string;
  ctaPrimary: string;
  whatsapp: string;
}

export default function HomeCtaBand({
  heading,
  subheading,
  ctaPrimary,
  whatsapp,
}: HomeCtaBandProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Gated on `mounted` — see components/motion/TextGenerateEffect.tsx for why
  // this avoids a server/client hydration mismatch for reduced-motion users.
  const reduceMotion = mounted && shouldReduceMotion;

  const fadeIn = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.5 },
        transition: { type: "spring" as const, stiffness: 70, damping: 20 },
      };

  // Format WhatsApp number for wa.me (strip non-digits except leading +)
  const waNumber = whatsapp.replace(/\s/g, "").replace("+", "");
  const waHref = `https://wa.me/${waNumber}?text=Hello%2C%20I%20am%20interested%20in%20your%20apparel%20manufacturing%20services`;

  return (
    <Section
      variant="dark"
      aria-labelledby="home-cta-heading"
      className="!py-10 md:!py-14"
    >
      <Container>
        <motion.div
          {...fadeIn}
          className="bg-crimson rounded-card p-8 md:p-14 text-center"
        >
          <h2
            id="home-cta-heading"
            className="font-display text-h2 text-white mb-4"
          >
            {heading}
          </h2>
          <p className="font-sans text-body text-white/80 max-w-xl mx-auto mb-8 line-clamp-2">
            {subheading}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/request-a-quote">
              <MovingBorder>
                <Button variant="secondary" secondaryContext="dark" size="md">
                  {ctaPrimary}
                </Button>
              </MovingBorder>
            </Link>

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

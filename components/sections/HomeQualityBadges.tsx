"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BoltIcon,
  SwatchIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import Container from "@/components/ui/Container";

interface HomeQualityBadgesProps {
  qaIntro: string;
  qcPoints: string[];
  differentiators: string[];
}

const DIFF_ICONS = [BoltIcon, SwatchIcon, ChatBubbleLeftRightIcon];

export default function HomeQualityBadges({ qaIntro, qcPoints, differentiators }: HomeQualityBadgesProps) {
  const shouldReduceMotionRaw = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const shouldReduceMotion = mounted && shouldReduceMotionRaw;

  const fadeUp = (delay: number) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { delay, type: "spring" as const, stiffness: 90, damping: 22 },
        };

  return (
    <section aria-labelledby="home-quality-heading" className="w-full bg-white py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Left — QA intro + full QC checkpoint badge grid */}
          <motion.div {...fadeUp(0)}>
            <div className="flex items-center gap-2 mb-3">
              <CheckBadgeIcon className="w-5 h-5 text-crimson" aria-hidden="true" />
              <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson">
                Quality Assurance
              </p>
            </div>
            <h2 id="home-quality-heading" className="font-display text-h3 md:text-h2 text-navy mb-4">
              Quality Controlled at Every Checkpoint
            </h2>
            <p className="font-sans text-body text-ink-muted leading-relaxed mb-6">{qaIntro}</p>
            <div className="flex flex-wrap gap-2">
              {qcPoints.map((point) => (
                <span
                  key={point}
                  className="inline-flex items-center font-sans font-semibold uppercase tracking-[0.05em] text-[0.6875rem] px-3 py-1.5 rounded-badge bg-cream-100 border border-line text-navy"
                >
                  {point}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — differentiator rows */}
          <div className="flex flex-col divide-y divide-line">
            {differentiators.map((d, i) => {
              const Icon = DIFF_ICONS[i % DIFF_ICONS.length];
              return (
                <motion.div key={d} {...fadeUp(i * 0.1)} className="flex items-start gap-4 py-4 first:pt-0">
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-cream-100 flex items-center justify-center text-crimson">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <p className="font-sans text-body text-ink-muted pt-1.5">{d}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

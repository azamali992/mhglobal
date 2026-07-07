"use client";

import { useReducedMotion, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

interface Milestone {
  year: string;
  label: string;
  description: string;
}

interface AboutTimelineProps {
  milestones: Milestone[];
}

export default function AboutTimeline({ milestones }: AboutTimelineProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduceMotion = mounted && shouldReduceMotion;

  return (
    <Section variant="dark" aria-labelledby="about-timeline-heading">
      <Container>
        <h2
          id="about-timeline-heading"
          className="font-display text-h2 text-white text-center mb-16"
        >
          Our Journey
        </h2>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:block relative" role="list">
          {/* Horizontal connector line */}
          <motion.div
            className="absolute top-5 left-0 right-0 border-t border-cream-100/30"
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            style={{ transformOrigin: "left" }}
            aria-hidden="true"
          />
          <div className="grid grid-cols-3 gap-8">
            {milestones.map((m, i) => (
              <div key={m.year} className="relative flex flex-col items-center" role="listitem">
                {/* Dot */}
                <motion.div
                  className="relative z-10 w-3 h-3 rounded-full bg-crimson mb-6 shrink-0"
                  initial={reduceMotion ? false : { scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    delay: i * 0.2,
                  }}
                />
                <motion.div
                  className="text-center"
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 20,
                    delay: i * 0.2 + 0.1,
                  }}
                >
                  <time dateTime={m.year}>
                    <h4 className="font-display text-h4 text-white mb-2">{m.year}</h4>
                  </time>
                  <p className="font-sans text-caption text-white/60 uppercase tracking-[0.08em] mb-2">
                    {m.label}
                  </p>
                  <p className="font-sans text-body text-white/70 leading-relaxed">
                    {m.description}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden relative pl-8" role="list">
          <div
            className="absolute left-3 top-0 bottom-0 border-l-2 border-crimson/30"
            aria-hidden="true"
          />
          {milestones.map((m) => (
            <div key={m.year} className="relative mb-10 last:mb-0" role="listitem">
              <div
                className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-crimson"
                aria-hidden="true"
              />
              <time dateTime={m.year}>
                <h4 className="font-display text-h4 text-white mb-1">{m.year}</h4>
              </time>
              <p className="font-sans text-caption text-white/60 uppercase tracking-[0.08em] mb-2">
                {m.label}
              </p>
              <p className="font-sans text-body text-white/70 leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import StickyScrollReveal from "@/components/aceternity/StickyScrollReveal";
import {
  ClipboardDocumentCheckIcon,
  SwatchIcon,
  BeakerIcon,
  ScissorsIcon,
  SparklesIcon,
  PaintBrushIcon,
  StarIcon,
  MagnifyingGlassIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";

const STAGE_ICONS = [
  ClipboardDocumentCheckIcon,
  SwatchIcon,
  BeakerIcon,
  ScissorsIcon,
  SparklesIcon,
  PaintBrushIcon,
  StarIcon,
  MagnifyingGlassIcon,
  CubeIcon,
];

interface ManufacturingProcessProps {
  stages: string[];
  heading: string;
}

export default function ManufacturingProcess({
  stages,
  heading,
}: ManufacturingProcessProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Scroll-driven stage counter using IntersectionObserver on each panel
  useEffect(() => {
    if (!containerRef.current) return;
    const panels = containerRef.current.querySelectorAll("[data-stage-panel]");
    if (panels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.stagePanel);
            setCurrentStage(idx);
          }
        });
      },
      { threshold: 0.5 }
    );

    panels.forEach((panel) => observer.observe(panel));
    return () => observer.disconnect();
  }, [mounted]);

  const reduceMotion = mounted && shouldReduceMotion;

  const items = stages.map((name, i) => {
    const Icon = STAGE_ICONS[i] ?? ClipboardDocumentCheckIcon;
    return {
      label: name,
      content: (
        <div
          className="relative flex items-center gap-6"
          role="article"
          aria-label={`Stage ${i + 1}: ${name}`}
          data-stage-panel={String(i + 1)}
        >
          <span
            aria-hidden="true"
            className="font-display text-[7rem] leading-none text-white/10 select-none shrink-0"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <Card variant="dark" as="div" className="p-8 flex-1">
            <p className="font-sans text-caption text-white/50 uppercase tracking-[0.08em] mb-3">
              Stage {i + 1} of {stages.length}
            </p>
            <h2 className="font-display text-h3 text-white mb-4">{name}</h2>
            <Icon className="w-16 h-16 text-crimson/60" aria-hidden="true" />
          </Card>
        </div>
      ),
    };
  });

  const stickyContent = (
    <div
      role="region"
      aria-label="Nine-stage manufacturing process"
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="font-sans text-caption text-ink-muted uppercase tracking-[0.08em] mb-3">
        Manufacturing Process
      </p>
      <p className="font-sans text-body-lg text-navy mb-2">
        Stage{" "}
        <span className="font-semibold text-crimson">
          {reduceMotion ? "1" : String(currentStage)}
        </span>{" "}
        of {stages.length}
      </p>
      <h3
        id="mfg-process-heading"
        className="font-display text-h3 text-navy mb-4"
      >
        {stages[currentStage - 1] ?? heading}
      </h3>
      <p className="font-sans text-caption text-ink-muted uppercase tracking-[0.08em]">
        {heading}
      </p>
    </div>
  );

  return (
    <Section
      variant="white"
      aria-labelledby="mfg-process-heading"
    >
      <Container>
        <div ref={containerRef}>
          <StickyScrollReveal items={items} stickyContent={stickyContent} />
        </div>
      </Container>
    </Section>
  );
}

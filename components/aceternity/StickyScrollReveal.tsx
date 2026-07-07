"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface StickyScrollItem {
  label: string;
  content: React.ReactNode;
}

export interface StickyScrollRevealProps {
  items: StickyScrollItem[];
  /** Content for the sticky left panel */
  stickyContent: React.ReactNode;
  className?: string;
}

/**
 * Aceternity-inspired Sticky Scroll Reveal.
 * Desktop: left column sticks while right column scrolls through panels.
 * Reduced-motion fallback: flat vertical list with border-b border-line dividers.
 *
 * Scroll-position tracking is implemented by the consuming page using Framer Motion
 * useScroll/useTransform. This component provides the structural layout only.
 */
export default function StickyScrollReveal({
  items,
  stickyContent,
  className = "",
}: StickyScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Gated on `mounted` — see TextGenerateEffect.tsx for why this avoids a
  // server/client hydration mismatch for OS-level reduced-motion users.
  if (mounted && shouldReduceMotion) {
    return (
      <div className={cn("w-full", className)}>
        <div className="mb-8">{stickyContent}</div>
        <ol className="divide-y divide-line">
          {items.map((item, i) => (
            <li key={i} className="py-6 border-b border-line last:border-b-0">
              <h4 className="font-display text-h4 text-navy mb-2">
                {i + 1}. {item.label}
              </h4>
              <div>{item.content}</div>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  return (
    <div className={cn("relative flex gap-16", className)}>
      {/* Left sticky column */}
      <div className="hidden md:block w-[35%] shrink-0">
        <div className="sticky top-[4.5rem] h-[calc(100vh-4.5rem)] flex flex-col justify-center">
          {stickyContent}
        </div>
      </div>

      {/* Right scrolling column */}
      <div className="flex-1 min-w-0">
        {items.map((item, i) => (
          <div
            key={i}
            className="min-h-[65vh] flex flex-col justify-center py-16 border-b border-line/30 last:border-b-0"
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}

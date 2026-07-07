"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export interface InfiniteMovingCardsProps {
  items: string[];
  className?: string;
}

/**
 * Aceternity-inspired Infinite Moving Cards.
 * Cards scroll left in an infinite CSS animation loop.
 * Static overflow-x-auto row when prefers-reduced-motion.
 */
export default function InfiniteMovingCards({
  items,
  className = "",
}: InfiniteMovingCardsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const containerRef = useRef<HTMLDivElement>(null);

  const cardClass =
    "flex-shrink-0 bg-cream-100 rounded-card shadow-card px-6 py-4 font-sans text-body text-ink-muted whitespace-nowrap";

  // Gated on `mounted` — see TextGenerateEffect.tsx for why this avoids a
  // server/client hydration mismatch for OS-level reduced-motion users.
  if (mounted && shouldReduceMotion) {
    return (
      <div
        className={`overflow-x-auto ${className}`}
        aria-label="Scrolling trust indicators"
      >
        <div className="flex gap-4 px-4 py-2">
          {items.map((item, i) => (
            <div key={i} className={cardClass}>
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      aria-label="Scrolling trust indicators"
      aria-live="off"
    >
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .infinite-track {
          animation: infinite-scroll 50s linear infinite;
          display: flex;
          gap: 1rem;
          width: max-content;
        }
        .infinite-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .infinite-track { animation: none; }
        }
      `}</style>
      <div className="infinite-track px-4 py-2">
        {/* Original set */}
        {items.map((item, i) => (
          <div key={`a-${i}`} className={cardClass}>
            {item}
          </div>
        ))}
        {/* Clone set for seamless loop */}
        {items.map((item, i) => (
          <div key={`b-${i}`} aria-hidden="true" className={cardClass}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

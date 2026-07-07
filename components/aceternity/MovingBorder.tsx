"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface MovingBorderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Aceternity-inspired Moving Border.
 * A gradient ring travels around the button perimeter at 3s linear infinite.
 * Static state (no animation) when prefers-reduced-motion.
 * Wraps the button in a relative container; the animated ring is absolute behind it.
 */
export default function MovingBorder({ children, className = "" }: MovingBorderProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Gated on `mounted` — see TextGenerateEffect.tsx for why this avoids a
  // server/client hydration mismatch for OS-level reduced-motion users.
  if (mounted && shouldReduceMotion) {
    return <div className={cn("relative inline-flex", className)}>{children}</div>;
  }

  return (
    <div className={cn("relative inline-flex p-[2px] rounded-btn overflow-hidden", className)}>
      <style>{`
        @keyframes moving-border {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .moving-border-ring {
          background: linear-gradient(270deg, #FFFFFF, #EDE6D6, #FFFFFF);
          background-size: 200% 200%;
          animation: moving-border 3s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .moving-border-ring { animation: none; }
        }
      `}</style>
      {/* Animated ring layer */}
      <span
        aria-hidden="true"
        className="moving-border-ring absolute inset-0 rounded-btn"
      />
      {/* Content sits above the ring */}
      <span className="relative z-10 inline-flex">{children}</span>
    </div>
  );
}

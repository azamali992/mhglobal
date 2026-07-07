"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export interface BackgroundBeamsProps {
  className?: string;
}

/**
 * Aceternity-inspired Background Beams.
 * Three SVG paths with stroke-dashoffset animations.
 * Static (no animation) when prefers-reduced-motion.
 * aria-hidden="true" — purely decorative.
 */
export default function BackgroundBeams({ className = "" }: BackgroundBeamsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Gated on `mounted` — see TextGenerateEffect.tsx for why this avoids a
  // server/client hydration mismatch for OS-level reduced-motion users. The
  // @media rule below still enforces reduced motion instantly regardless.
  const reduceMotion = mounted && shouldReduceMotion;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full z-behind ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        <style>{`
          @keyframes beam1 {
            0%   { stroke-dashoffset: 2000; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes beam2 {
            0%   { stroke-dashoffset: 3000; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes beam3 {
            0%   { stroke-dashoffset: 2500; }
            100% { stroke-dashoffset: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            .beam { animation: none !important; }
          }
        `}</style>
      </defs>

      {/* Path 1 — cream at 6% opacity */}
      <path
        className="beam"
        d="M 0 200 Q 360 400 720 300 Q 1080 200 1440 400"
        stroke="#EDE6D6"
        strokeOpacity="0.06"
        strokeWidth="1.5"
        strokeDasharray="2000"
        strokeDashoffset={reduceMotion ? 0 : 2000}
        style={reduceMotion ? {} : { animation: "beam1 8s linear infinite" }}
      />

      {/* Path 2 — crimson at 4% opacity */}
      <path
        className="beam"
        d="M 0 600 Q 480 200 960 500 Q 1200 650 1440 300"
        stroke="#941C1D"
        strokeOpacity="0.04"
        strokeWidth="1"
        strokeDasharray="3000"
        strokeDashoffset={reduceMotion ? 0 : 3000}
        style={reduceMotion ? {} : { animation: "beam2 12s linear infinite" }}
      />

      {/* Path 3 — cream at 3% opacity */}
      <path
        className="beam"
        d="M 200 0 Q 600 400 1000 100 Q 1300 -50 1440 500"
        stroke="#EDE6D6"
        strokeOpacity="0.03"
        strokeWidth="1"
        strokeDasharray="2500"
        strokeDashoffset={reduceMotion ? 0 : 2500}
        style={reduceMotion ? {} : { animation: "beam3 16s linear infinite" }}
      />
    </svg>
  );
}

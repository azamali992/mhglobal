"use client";

import { useReducedMotion, motion } from "framer-motion";
import { useEffect, useState } from "react";

export interface TextGenerateEffectProps {
  text: string;
  className?: string;
  /** HTML tag to render — defaults to span */
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
  /**
   * When false, holds the animated branch at its initial (hidden) state
   * instead of revealing — used to gate the reveal behind an external event
   * (e.g. an intro loader finishing) rather than firing on mount. Defaults
   * to true (reveal immediately, the original behavior).
   */
  start?: boolean;
}

/**
 * Aceternity-inspired Text Generate Effect.
 * Each character fades in with a small Y offset, staggered 18ms per char.
 * Full text rendered immediately at opacity:1 when prefers-reduced-motion.
 */
export default function TextGenerateEffect({
  text,
  className = "",
  as: Tag = "span",
  start = true,
}: TextGenerateEffectProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Gate on `mounted` so the server render and the first client render always
  // agree (both render the animated branch) — the reduced-motion swap then
  // happens as a safe client-only update after hydration, avoiding a
  // server/client markup mismatch for users with OS-level reduced motion on.
  if (mounted && shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  // Split into words first, then characters within each word. Each word is
  // wrapped in its own inline-block span so the browser only ever wraps the
  // line between words — giving every individual character its own
  // inline-block box (the naive approach) removes the word's atomicity and
  // lets the browser break mid-word at any character boundary.
  const words = text.split(" ");
  let charIndex = 0;

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, wi) => {
        const wordChars = word.split("").map((char) => {
          const i = charIndex++;
          return (
            <motion.span
              key={i}
              aria-hidden="true"
              initial={{ opacity: 0, y: 4 }}
              animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
              transition={{
                delay: i * 0.018,
                type: "spring",
                stiffness: 40,
                damping: 12,
              }}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          );
        });
        charIndex++; // account for the space consumed between words
        return (
          <span key={wi} style={{ display: "inline-block" }}>
            {wordChars}
            {wi < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </Tag>
  );
}

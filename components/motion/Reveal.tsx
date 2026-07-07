"use client";

import React, { useEffect, useState, ReactNode } from "react";
import { motion, Variants } from "framer-motion";

interface RevealProps {
  children: ReactNode;
  /** Delay before the animation starts (seconds) */
  delay?: number;
  /** Animation duration (seconds) */
  duration?: number;
  /** Direction the element slides in from */
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

const OFFSET = 32;

/**
 * Scroll-triggered reveal wrapper using Framer Motion.
 * Animates once (viewport: { once: true }) from the specified direction.
 * Renders children immediately (no animation) when prefers-reduced-motion is set.
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  className,
}: RevealProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const directionMap: Record<string, { x?: number; y?: number }> = {
    up: { y: OFFSET },
    down: { y: -OFFSET },
    left: { x: OFFSET },
    right: { x: -OFFSET },
  };

  const variants: Variants = {
    hidden: { opacity: 0, ...directionMap[direction] },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

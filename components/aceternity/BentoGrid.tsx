"use client";

import { useReducedMotion, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
  /** Number of columns at desktop — defaults to 4 */
  cols?: 3 | 4;
}

export interface BentoGridItemProps {
  children: React.ReactNode;
  className?: string;
  /** Grid column span */
  colSpan?: 1 | 2;
  /** Grid row span */
  rowSpan?: 1 | 2;
  /** Stagger index — controls delay */
  index?: number;
}

/**
 * Aceternity-inspired Bento Grid.
 * Staggered fade-up reveal on scroll entry.
 * Instant, no-stagger render when prefers-reduced-motion.
 */
export function BentoGrid({ children, className = "", cols = 4 }: BentoGridProps) {
  const colClass = cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    // grid-flow-dense backfills gaps left by col-span-2/row-span-2 items with
    // later smaller items — without it, the browser's sparse placement
    // algorithm leaves large empty tracts wherever a 2x2 item can't fit in
    // the remaining space of its row.
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 grid-flow-dense", colClass, className)}>
      {children}
    </div>
  );
}

export function BentoGridItem({
  children,
  className = "",
  colSpan = 1,
  rowSpan = 1,
  index = 0,
}: BentoGridItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const colClass = colSpan === 2 ? "md:col-span-2" : "";
  const rowClass = rowSpan === 2 ? "md:row-span-2" : "";

  // Gated on `mounted` — see TextGenerateEffect.tsx for why this avoids a
  // server/client hydration mismatch for OS-level reduced-motion users.
  if (mounted && shouldReduceMotion) {
    return (
      <div className={cn(colClass, rowClass, className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(colClass, rowClass, className)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        delay: index * 0.08,
        type: "spring",
        stiffness: 80,
        damping: 22,
      }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { useReducedMotion, motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedTooltipProps {
  /** The element that triggers the tooltip */
  trigger: React.ReactNode;
  /** Tooltip content */
  content: React.ReactNode;
  /** Tooltip id — used for aria-describedby */
  id: string;
  className?: string;
}

/**
 * Aceternity-inspired Animated Tooltip.
 * Appears above trigger on hover/focus with a spring animation.
 * Reduced-motion fallback: tooltip content shown as a visible static span below the trigger.
 */
export default function AnimatedTooltip({
  trigger,
  content,
  id,
  className = "",
}: AnimatedTooltipProps) {
  const shouldReduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Gated on `mounted` — see TextGenerateEffect.tsx for why this avoids a
  // server/client hydration mismatch for OS-level reduced-motion users.
  if (mounted && shouldReduceMotion) {
    return (
      <div className={cn("inline-block", className)}>
        <span tabIndex={0}>{trigger}</span>
        <span
          id={id}
          role="tooltip"
          className="block mt-1 font-sans text-caption text-ink-muted"
        >
          {content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span
        tabIndex={0}
        aria-describedby={id}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 rounded-sm"
      >
        {trigger}
      </span>

      <AnimatePresence>
        {visible && (
          <motion.div
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-tooltip"
          >
            <div className="bg-navy-800 text-white font-sans text-caption rounded-badge py-1 px-3 shadow-card-dark whitespace-nowrap">
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useReducedMotion, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, MouseEvent as ReactMouseEvent } from "react";

export interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Aceternity-inspired 3D Card tilt-on-hover.
 * Applies perspective + rotateX/rotateY based on pointer offset.
 * Children render flat (no transform) when prefers-reduced-motion.
 */
export default function ThreeDCard({ children, className = "" }: ThreeDCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 30,
  });

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if ((mounted && shouldReduceMotion) || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  // Gated on `mounted` — see TextGenerateEffect.tsx for why this avoids a
  // server/client hydration mismatch for OS-level reduced-motion users.
  if (mounted && shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

export interface SpotlightProps {
  className?: string;
}

/**
 * Aceternity-inspired Spotlight component.
 * Renders a radial-gradient canvas that follows mouse position.
 * Static fallback (top-center gradient, no tracking) when prefers-reduced-motion.
 * aria-hidden="true" — purely decorative.
 */
export default function Spotlight({ className = "" }: SpotlightProps) {
  const shouldReduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const inViewRef = useRef(false);

  const draw = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 400);
    gradient.addColorStop(0, "rgba(255,255,255,0.12)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (shouldReduceMotion) {
        draw(canvas.width / 2, 0);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (shouldReduceMotion) {
      return () => ro.disconnect();
    }

    // Only track the mouse (and only redraw) while the canvas is actually
    // on-screen — an off-screen hero has no business costing main-thread
    // time. This also means a scrolled-away hero draws nothing at all.
    const io = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
    });
    io.observe(canvas);

    // Redraw at most once per animation frame, driven only by actual
    // mousemove events — never a self-perpetuating rAF loop. The previous
    // implementation redrew the full canvas every single frame forever
    // (60fps, indefinitely, even with a stationary mouse or an off-screen
    // canvas), which competed with the browser's scroll compositing work
    // and produced visible scroll jank.
    let ticking = false;
    let pendingX = 0;
    let pendingY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!inViewRef.current) return;
      const rect = canvas.getBoundingClientRect();
      pendingX = e.clientX - rect.left;
      pendingY = e.clientY - rect.top;
      if (!ticking) {
        ticking = true;
        rafRef.current = requestAnimationFrame(() => {
          draw(pendingX, pendingY);
          ticking = false;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [draw, shouldReduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full z-behind ${className}`}
    />
  );
}

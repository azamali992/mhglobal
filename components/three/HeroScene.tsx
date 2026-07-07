"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import GlobalExportScene from "./GlobalExportScene";

/**
 * Canvas wrapper only — imported via next/dynamic(ssr:false) from HomeHero
 * since @react-three/fiber touches window/canvas APIs unavailable during SSR.
 * Rendering is gated to when the hero is on screen AND the tab is visible, so
 * the scene stops eating GPU/CPU the moment you scroll past it.
 */
export default function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.01,
    });
    io.observe(el);
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const active = inView && !hidden;

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 4.4], fov: 42 }}
        dpr={[1, 1.25]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        frameloop={active ? "always" : "never"}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <GlobalExportScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

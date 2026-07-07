"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

const IntroReadyContext = createContext(true);

/** Hero (and any future intro-gated section) reads this to know when the
 * loader curtain has cleared and it's safe to start its own reveal. */
export function useIntroReady() {
  return useContext(IntroReadyContext);
}

const MIN_VISIBLE_MS = 1200;
const MAX_VISIBLE_MS = 2400;
const EXIT_MS = 700;
const FILL_DELAY_MS = 120;

/**
 * One-time page-load curtain for the Home page: shows the wordmark and a
 * filling progress bar, then slides up once the page has actually loaded
 * (or MAX_VISIBLE_MS elapses, whichever comes first) — never gating on load
 * indefinitely. Locks native scroll while visible. Everything wrapped
 * in `<HomeIntro>` can read `useIntroReady()` to delay its own entrance
 * animation until the curtain has cleared.
 */
export default function HomeIntro({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Gated on `mounted` — see components/motion/TextGenerateEffect.tsx for why:
  // useReducedMotion() resolves synchronously on the client's very first
  // render (before hydration completes) but the server always assumes
  // non-reduced motion, so using the raw hook value directly in timing
  // constants that feed inline styles produces a server/client mismatch.
  const reduceMotion = mounted && shouldReduceMotion;

  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showCurtain, setShowCurtain] = useState(true);
  const [fillStarted, setFillStarted] = useState(false);
  const finishedRef = useRef(false);

  const minVisible = reduceMotion ? 150 : MIN_VISIBLE_MS;
  const exitMs = reduceMotion ? 0 : EXIT_MS;
  const fillDelay = reduceMotion ? 0 : FILL_DELAY_MS;
  const fillDuration = reduceMotion ? 0 : Math.max(0, minVisible - FILL_DELAY_MS);

  useEffect(() => {
    // Read the raw hook value here (not the `mounted`-gated `reduceMotion`
    // above) — this effect only ever runs client-side after mount, so there
    // is no hydration risk, and reading the gated value here would instead
    // cause a real functional bug: this effect has an empty dependency array
    // and therefore only runs once, so it would permanently capture
    // `reduceMotion`'s pre-mount value (always false on the first render)
    // and never see it flip true, leaving reduced-motion users stuck with
    // the full-length timers despite the (correctly) instant-looking styles.
    const reduceMotionNow = shouldReduceMotion ?? false;
    const effMinVisible = reduceMotionNow ? 150 : MIN_VISIBLE_MS;
    const effMaxVisible = reduceMotionNow ? 150 : MAX_VISIBLE_MS;
    const effExitMs = reduceMotionNow ? 0 : EXIT_MS;

    // Lock native scroll while the curtain is up.
    document.body.style.overflow = "hidden";

    const fillTimer = setTimeout(() => setFillStarted(true), 20);

    function finish() {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setReady(true);
      document.body.style.overflow = "";
      setExiting(true);
      setTimeout(() => setShowCurtain(false), effExitMs);
    }

    let minTimer: ReturnType<typeof setTimeout> | undefined;
    function onLoad() {
      minTimer = setTimeout(finish, effMinVisible);
    }

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }
    const maxTimer = setTimeout(finish, effMaxVisible);

    return () => {
      clearTimeout(fillTimer);
      clearTimeout(maxTimer);
      if (minTimer) clearTimeout(minTimer);
      window.removeEventListener("load", onLoad);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const curtain = showCurtain && (
    <motion.div
      aria-hidden="true"
      className="fixed inset-0 z-[999] bg-navy flex flex-col items-center justify-center gap-8"
      initial={false}
      animate={{ y: exiting ? "-105%" : "0%" }}
      transition={{ duration: exitMs / 1000, ease: [0.65, 0, 0.35, 1] }}
    >
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
      >
        <Image
          src="/logo.png"
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 object-contain rounded-badge"
        />
        <span className="font-sans text-2xl font-medium uppercase tracking-[0.2em] text-white">
          MH Global Attire
        </span>
      </motion.div>
      <div className="w-40 h-px rounded-pill bg-white/20 overflow-hidden">
        <div
          className="h-full bg-white origin-left"
          style={{
            transform: fillStarted ? "scaleX(1)" : "scaleX(0)",
            transitionProperty: "transform",
            transitionDuration: `${fillDuration}ms`,
            transitionTimingFunction: "cubic-bezier(0.65,0,0.35,1)",
            transitionDelay: `${fillDelay}ms`,
          }}
        />
      </div>
    </motion.div>
  );

  // Rendering the curtain as a normal descendant (inside <main>/PageTransition)
  // traps it inside whatever stacking context its ancestors happen to
  // create — in particular PageTransition's own fade-in wrapper briefly has
  // opacity < 1 while it animates in, which per the CSS spec creates a new
  // stacking context; a z-index set inside that subtree is then capped at
  // the ancestor's stacking level no matter its own value, so the curtain
  // would render BELOW the header for that ~350ms window. A body-level
  // portal sidesteps ancestor stacking entirely — but portals can't render
  // during SSR (no `document`), so we render inline for the very first
  // paint (server and pre-mount client agree, no hydration mismatch) and
  // swap to the portal the instant we're mounted, well before
  // PageTransition's fade has time to matter.
  return (
    <IntroReadyContext.Provider value={ready}>
      {children}
      {mounted ? (curtain ? createPortal(curtain, document.body) : null) : curtain}
    </IntroReadyContext.Provider>
  );
}

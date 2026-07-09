"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface Stat {
  value?: number;
  display?: string;
  suffix?: string;
  prefix?: string;
  label: string;
}

interface HomeQuickStatsProps {
  stagesCount: number;
  qcCount: number;
  oemServicesCount: number;
}

function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) {
      setDisplay(value);
      return;
    }
    const duration = 1100;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, shouldReduceMotion]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export default function HomeQuickStats({
  stagesCount,
  qcCount,
  oemServicesCount,
}: HomeQuickStatsProps) {
  const stats: Stat[] = [
    { display: "Various", label: "Product Categories" },
    { value: stagesCount, label: "Managed Production Stages" },
    { value: qcCount, label: "Quality Control Checkpoints" },
    { value: oemServicesCount, suffix: "+", label: "OEM & Private-Label Services" },
  ];

  return (
    <section aria-labelledby="home-stats-heading" className="w-full bg-navy-800 border-y border-white/10">
      <h2 id="home-stats-heading" className="sr-only">
        MH Global Attire at a Glance
      </h2>
      <div className="w-full max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => {
          const mobileBorderL = i % 2 === 1;
          const mobileBorderT = i >= 2;
          return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className={[
              "px-5 py-7 md:py-9 border-white/10",
              mobileBorderL ? "border-l" : "",
              mobileBorderT ? "border-t" : "",
              "md:border-t-0 md:border-l md:first:border-l-0",
            ].join(" ")}
          >
            <p className="font-display text-h2 md:text-h1 text-white leading-none mb-2">
              {stat.display !== undefined ? (
                stat.display
              ) : (
                <CountUp value={stat.value ?? 0} suffix={stat.suffix} prefix={stat.prefix} />
              )}
            </p>
            <p className="font-sans text-caption text-white/60 uppercase tracking-[0.06em] leading-snug">
              {stat.label}
            </p>
          </motion.div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useReducedMotion, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

interface WorkflowStep {
  label: string;
  description: string;
}

interface OemWorkflowProps {
  steps: WorkflowStep[];
}

export default function OemWorkflow({ steps }: OemWorkflowProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduceMotion = mounted && shouldReduceMotion;

  return (
    <Section variant="white" aria-labelledby="oem-workflow-heading">
      <Container>
        <h2
          id="oem-workflow-heading"
          className="font-display text-h2 text-navy mb-12 text-center"
        >
          Our Process
        </h2>

        <div className="max-w-3xl mx-auto">
          {/* Animated left border line */}
          {!reduceMotion ? (
            <motion.div
              className="relative"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-crimson/30 origin-top" aria-hidden="true" />
              <ol className="space-y-0" aria-label="Ten-step OEM workflow">
                {steps.map((step, i) => (
                  <li key={step.label} className="relative flex gap-6 pb-10 last:pb-0 pl-12">
                    {/* Crimson circle badge */}
                    <motion.span
                      className="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-crimson text-white font-sans font-semibold text-sm shrink-0"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 25,
                        delay: i * 0.12,
                      }}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </motion.span>

                    {/* Step content */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        type: "spring",
                        stiffness: 80,
                        damping: 20,
                        delay: i * 0.12 + 0.1,
                      }}
                    >
                      <h4 className="font-display text-h4 text-navy mb-1">{step.label}</h4>
                      <p className="font-sans text-body text-ink-muted leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  </li>
                ))}
              </ol>
            </motion.div>
          ) : (
            /* Reduced-motion fallback */
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-crimson/30" aria-hidden="true" />
              <ol className="space-y-0" aria-label="Ten-step OEM workflow">
                {steps.map((step, i) => (
                  <li key={step.label} className="relative flex gap-6 pb-10 last:pb-0 pl-12">
                    <span
                      className="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-crimson text-white font-sans font-semibold text-sm shrink-0"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="font-display text-h4 text-navy mb-1">{step.label}</h4>
                      <p className="font-sans text-body text-ink-muted leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

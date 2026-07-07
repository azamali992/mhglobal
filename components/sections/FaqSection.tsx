"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import type { FaqItem } from "@/lib/seo";

interface FaqSectionProps {
  items: FaqItem[];
}

export default function FaqSection({ items }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section variant="light" aria-labelledby="faq-heading" className="!py-12 md:!py-16">
      <Container>
        <div className="mb-8 max-w-2xl">
          <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-2">
            Frequently Asked Questions
          </p>
          <h2 id="faq-heading" className="font-display text-h3 md:text-h2 text-navy">
            Common Questions From Buyers
          </h2>
        </div>

        <div className="flex flex-col gap-3 max-w-3xl">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.question} className="rounded-card border border-line bg-cream-100 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-sans text-body font-semibold text-navy">{item.question}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-ink-muted"
                  >
                    <ChevronDown className="h-5 w-5" aria-hidden="true" />
                  </motion.span>
                </button>
                {isOpen && (
                  <div id={`faq-answer-${i}`} className="px-5 pb-4">
                    <p className="font-sans text-body text-ink-muted leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

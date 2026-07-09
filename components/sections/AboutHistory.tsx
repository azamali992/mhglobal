import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

interface AboutHistoryProps {
  /** Split on \n\n from the about.history ContentBlock */
  paragraphs: string[];
}

export default function AboutHistory({ paragraphs }: AboutHistoryProps) {
  return (
    <Section
      variant="light"
      aria-labelledby="about-history-heading"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16 items-start">
          {/* Left column — history text */}
          <Reveal direction="up">
            <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-2">
              Who We Are
            </p>
            <h2 id="about-history-heading" className="font-display text-h3 md:text-h2 text-navy mb-6">
              A Faisalabad-Based Manufacturing Partner
            </h2>
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="font-sans text-body text-ink-muted leading-relaxed mb-6 last:mb-0"
              >
                {para}
              </p>
            ))}
          </Reveal>

          {/* Right column — editorial image */}
          <Reveal direction="left" delay={0.15}>
            <div className="relative w-full aspect-[3/4] rounded-card overflow-hidden shadow-card">
              <Image
                src="/images/site/manufacturing.jpg"
                alt="MH Global Attire manufacturing facility in Faisalabad, Pakistan"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

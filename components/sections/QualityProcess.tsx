import Image from "next/image";
import { CheckIcon } from "@heroicons/react/24/outline";
import Reveal from "@/components/motion/Reveal";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

export interface QualityPhase {
  /** Short kicker, e.g. "Before Production". */
  phase: string;
  title: string;
  blurb: string;
  image: string;
  alt: string;
  /** The checkpoint labels that belong to this phase. */
  points: string[];
}

interface QualityProcessProps {
  phases: QualityPhase[];
}

export default function QualityProcess({ phases }: QualityProcessProps) {
  return (
    <Section variant="light" aria-labelledby="qc-process-heading">
      <Container>
        <div className="mb-14 max-w-2xl md:mb-20">
          <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-2">
            How We Control Quality
          </p>
          <h2
            id="qc-process-heading"
            className="font-display text-h3 md:text-h2 text-navy mb-4"
          >
            Checked Before, During and After Production
          </h2>
          <p className="font-sans text-body-lg text-ink-muted leading-relaxed">
            Quality is not a single inspection at the end — it is built in at
            every stage. Each phase below carries its own checkpoints, so
            problems are caught early and what ships matches what you approved.
          </p>
        </div>

        <div className="space-y-16 md:space-y-28">
          {phases.map((phase, i) => {
            const flip = i % 2 === 1;
            return (
              <div
                key={phase.title}
                className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14 lg:gap-20"
              >
                {/* Photo */}
                <Reveal
                  direction={flip ? "left" : "right"}
                  className={flip ? "md:order-2" : ""}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card shadow-card">
                    <Image
                      src={phase.image}
                      alt={phase.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute left-5 top-4 font-display text-[3.5rem] leading-none text-white drop-shadow-[0_2px_10px_rgba(10,34,64,0.55)] md:text-[4.5rem]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </Reveal>

                {/* Copy + checkpoints */}
                <Reveal
                  direction="up"
                  delay={0.08}
                  className={flip ? "md:order-1" : ""}
                >
                  <div>
                    <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-2">
                      {phase.phase}
                    </p>
                    <h3 className="font-display text-h3 text-navy mb-3">
                      {phase.title}
                    </h3>
                    <p className="font-sans text-body text-ink-muted leading-relaxed mb-6">
                      {phase.blurb}
                    </p>
                    <ul className="space-y-2.5" aria-label={`${phase.title} checkpoints`}>
                      {phase.points.map((point) => (
                        <li key={point} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-crimson text-white">
                            <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                          </span>
                          <span className="font-sans text-body text-navy font-medium">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

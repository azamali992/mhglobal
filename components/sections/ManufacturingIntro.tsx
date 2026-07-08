import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

interface ManufacturingIntroProps {
  intro: string;
}

export default function ManufacturingIntro({ intro }: ManufacturingIntroProps) {
  return (
    <Section variant="light" aria-labelledby="mfg-intro-heading">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-16 items-center">
          <Reveal direction="up">
            <h2 id="mfg-intro-heading" className="sr-only">
              Manufacturing Process Introduction
            </h2>
            <p className="font-sans text-body-lg text-ink-muted leading-relaxed">
              {intro}
            </p>
          </Reveal>
          <Reveal direction="left" delay={0.15}>
            <div className="relative w-full aspect-[4/3] rounded-card overflow-hidden shadow-card">
              <Image
                src="/images/manufacturing/05-stitching.jpg"
                alt="MH Global Attire production floor in Faisalabad with operators at industrial sewing machines"
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

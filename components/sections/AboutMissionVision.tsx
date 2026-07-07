import Reveal from "@/components/motion/Reveal";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";

interface AboutMissionVisionProps {
  mission: string;
  vision: string;
}

export default function AboutMissionVision({ mission, vision }: AboutMissionVisionProps) {
  return (
    <Section
      variant="white"
      aria-labelledby="about-mv-heading"
    >
      <Container>
        <h2 id="about-mv-heading" className="sr-only">
          Mission and Vision
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reveal direction="up">
            <Card as="article" className="h-full">
              <h3 className="font-display text-h3 text-navy mb-4">Our Mission</h3>
              <p className="font-sans text-body text-ink-muted leading-relaxed">{mission}</p>
            </Card>
          </Reveal>
          <Reveal direction="up" delay={0.1}>
            <Card as="article" className="h-full">
              <h3 className="font-display text-h3 text-navy mb-4">Our Vision</h3>
              <p className="font-sans text-body text-ink-muted leading-relaxed">{vision}</p>
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

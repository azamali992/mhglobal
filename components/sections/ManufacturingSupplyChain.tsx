import Reveal from "@/components/motion/Reveal";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

interface ManufacturingSupplyChainProps {
  /** The supply chain paragraph extracted from about.history */
  text: string;
}

export default function ManufacturingSupplyChain({ text }: ManufacturingSupplyChainProps) {
  return (
    <Section variant="light" aria-label="Supply chain context">
      <Container>
        <Reveal direction="up">
          <p className="font-sans text-body-lg text-ink-muted max-w-3xl mx-auto text-center leading-relaxed">
            {text}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

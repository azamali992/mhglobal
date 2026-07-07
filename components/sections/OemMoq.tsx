import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

interface OemMoqProps {
  preamble: string;
  moqDetail: string;
}

export default function OemMoq({ preamble, moqDetail }: OemMoqProps) {
  return (
    <Section variant="light" aria-label="MOQ information">
      <Container>
        <Reveal direction="up">
          <div className="max-w-xl mx-auto text-center">
            <p className="font-sans text-body-lg text-ink-muted mb-4">
              {preamble}
            </p>
            <p className="font-sans text-body text-ink-muted mb-6">{moqDetail}</p>
            <Link
              href="/contact"
              className="font-sans text-sm font-semibold text-crimson hover:text-crimson-600 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 rounded-btn"
            >
              Contact Us →
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

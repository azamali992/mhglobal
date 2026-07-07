import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

interface CategoryMoqCtaProps {
  moqNote: string;
  ctaPrimary: string;
  whatsapp: string;
}

export default function CategoryMoqCta({
  moqNote,
  ctaPrimary,
  whatsapp,
}: CategoryMoqCtaProps) {
  const waNumber = whatsapp.replace(/\s/g, "").replace("+", "");
  const waHref = `https://wa.me/${waNumber}?text=Hello%2C%20I%20am%20interested%20in%20your%20apparel%20manufacturing%20services`;

  return (
    <Section variant="dark" aria-label="MOQ and inquiry">
      <Container>
        <Reveal direction="up">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-sans text-body-lg text-white/80 mb-8">
              {moqNote}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/request-a-quote">
                <Button variant="primary" size="md">
                  {ctaPrimary}
                </Button>
              </Link>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with MH Global Attire on WhatsApp"
                className="font-sans text-sm font-semibold text-white/80 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-btn px-2 py-1"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

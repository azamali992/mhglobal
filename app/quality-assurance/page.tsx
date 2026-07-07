import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo-metadata";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import CtaBand from "@/components/sections/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const [heading, intro] = await Promise.all([
    prisma.contentBlock.findUniqueOrThrow({ where: { page_key: { page: "quality", key: "hero.heading" } } }),
    prisma.contentBlock.findUniqueOrThrow({ where: { page_key: { page: "quality", key: "quality.intro" } } }),
  ]);
  return buildMetadata({
    title: heading.value,
    description: intro.value.split(".")[0] + ".",
    path: "/quality-assurance",
  });
}

export default async function QualityAssurancePage() {
  const [qualityBlocks, homeBlocks, whatsapp] = await Promise.all([
    prisma.contentBlock.findMany({ where: { page: "quality" } }),
    prisma.contentBlock.findMany({ where: { page: "home", key: { in: ["hero.heading", "hero.cta.primary"] } } }),
    prisma.siteSetting.findUniqueOrThrow({ where: { key: "whatsapp" } }),
  ]);

  const cb = Object.fromEntries(qualityBlocks.map((b) => [b.key, b.value]));
  const home = Object.fromEntries(homeBlocks.map((b) => [b.key, b.value]));

  const points = qualityBlocks
    .filter((b) => b.key.startsWith("qc.point."))
    .sort((a, b) => a.order - b.order)
    .map((b) => b.value);

  return (
    <>
      <PageHero
        eyebrow="Quality Assurance"
        title={cb["hero.heading"]}
        lead={cb["quality.intro"]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Quality Assurance", href: "/quality-assurance" },
        ]}
        image="/images/site/quality-control.jpg"
        meta={[
          { value: `${points.length}`, label: "Control Checkpoints" },
          { value: "Pre-Production", label: "Spec & Sample Review" },
          { value: "In-Process", label: "Inline Inspection" },
          { value: "Final", label: "Packing Verification" },
        ]}
      />

      <Section variant="light" aria-labelledby="qc-checkpoints-heading" className="!py-12 md:!py-16">
        <Container>
          <div className="mb-8">
            <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-2">
              Control Points
            </p>
            <h2 id="qc-checkpoints-heading" className="font-display text-h3 md:text-h2 text-navy max-w-2xl">
              Checked at Every Important Stage
            </h2>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Quality control checkpoints">
            {points.map((point, i) => (
              <Reveal
                key={point}
                as="li"
                direction="up"
                delay={(i % 3) * 0.05}
                className="flex h-full items-start gap-4 rounded-card border border-line bg-cream-100 p-5 transition-shadow duration-200 hover:shadow-card"
              >
                <span className="font-display text-h3 leading-none text-crimson/70 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-sans text-body text-navy font-medium pt-1">{point}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      <CtaBand
        heading={home["hero.heading"]}
        ctaPrimary={home["hero.cta.primary"]}
        whatsapp={whatsapp.value}
        sectionId="quality-cta-heading"
      />
    </>
  );
}

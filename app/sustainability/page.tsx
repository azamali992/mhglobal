import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo-metadata";
import {
  ArrowPathIcon,
  CubeTransparentIcon,
  BoltIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  EyeIcon,
  BeakerIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import CtaBand from "@/components/sections/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const [heading, body] = await Promise.all([
    prisma.contentBlock.findUniqueOrThrow({ where: { page_key: { page: "sustainability", key: "hero.heading" } } }),
    prisma.contentBlock.findUniqueOrThrow({ where: { page_key: { page: "sustainability", key: "sustainability.body" } } }),
  ]);
  return buildMetadata({
    title: heading.value,
    description: body.value.split(".")[0] + ".",
    path: "/sustainability",
  });
}

const ICONS = [
  ArrowPathIcon,
  CubeTransparentIcon,
  BoltIcon,
  ShieldCheckIcon,
  AcademicCapIcon,
  EyeIcon,
  BeakerIcon,
  SparklesIcon,
];

export default async function SustainabilityPage() {
  const [susBlocks, homeBlocks, whatsapp] = await Promise.all([
    prisma.contentBlock.findMany({ where: { page: "sustainability" } }),
    prisma.contentBlock.findMany({ where: { page: "home", key: { in: ["hero.heading", "hero.cta.primary"] } } }),
    prisma.siteSetting.findUniqueOrThrow({ where: { key: "whatsapp" } }),
  ]);

  const cb = Object.fromEntries(susBlocks.map((b) => [b.key, b.value]));
  const home = Object.fromEntries(homeBlocks.map((b) => [b.key, b.value]));

  const initiatives = susBlocks
    .filter((b) => b.key.startsWith("initiative."))
    .sort((a, b) => a.order - b.order)
    .map((b) => b.value);

  return (
    <>
      <PageHero
        eyebrow="Responsible Manufacturing"
        title={cb["hero.heading"]}
        lead={cb["sustainability.body"]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Sustainability", href: "/sustainability" },
        ]}
      />

      <Section variant="light" aria-labelledby="sustainability-initiatives-heading" className="!py-12 md:!py-16">
        <Container>
          <div className="mb-8 max-w-2xl">
            <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-2">
              Areas of Focus
            </p>
            <h2 id="sustainability-initiatives-heading" className="font-display text-h3 md:text-h2 text-navy mb-3">
              Practices We Are Building
            </h2>
            <p className="font-sans text-body text-ink-muted leading-relaxed">
              These are forward-looking practices in development — applied and expanded as our operations grow, and
              available to buyers on request.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list">
            {initiatives.map((item, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <Reveal key={item} direction="up" delay={(i % 4) * 0.05}>
                  <div role="listitem" className="h-full rounded-card border border-line bg-cream-100 p-6">
                    <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-btn bg-navy text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-sans text-body font-semibold text-navy leading-snug">{item}</h3>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <CtaBand
        heading={home["hero.heading"]}
        ctaPrimary={home["hero.cta.primary"]}
        whatsapp={whatsapp.value}
        sectionId="sustainability-cta-heading"
      />
    </>
  );
}

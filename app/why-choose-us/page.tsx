import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo-metadata";
import { CheckIcon } from "@heroicons/react/24/outline";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import CtaBand from "@/components/sections/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const heading = await prisma.contentBlock.findUniqueOrThrow({
    where: { page_key: { page: "why", key: "hero.heading" } },
  });
  return buildMetadata({
    title: heading.value,
    description:
      "A customization-focused apparel manufacturing partner in Faisalabad — flexible development, buyer-specific specs, quality monitoring and a long-term partnership approach.",
    path: "/why-choose-us",
  });
}

export default async function WhyChooseUsPage() {
  const [whyBlocks, homeBlocks, whatsapp] = await Promise.all([
    prisma.contentBlock.findMany({ where: { page: "why" } }),
    prisma.contentBlock.findMany({ where: { page: "home", key: { in: ["hero.heading", "hero.cta.primary"] } } }),
    prisma.siteSetting.findUniqueOrThrow({ where: { key: "whatsapp" } }),
  ]);

  const cb = Object.fromEntries(whyBlocks.map((b) => [b.key, b.value]));
  const home = Object.fromEntries(homeBlocks.map((b) => [b.key, b.value]));

  const differentiators = whyBlocks
    .filter((b) => b.key.startsWith("differentiator."))
    .sort((a, b) => a.order - b.order)
    .map((b) => b.value);

  return (
    <>
      <PageHero
        eyebrow="Why Choose Us"
        title={cb["hero.heading"]}
        lead="A manufacturing partner focused on your requirements — from flexible product development to buyer-specific fabric, sizing and branding, backed by quality monitoring at every stage."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Why Choose Us", href: "/why-choose-us" },
        ]}
        meta={[
          { value: "2022", label: "Manufacturing Since" },
          { value: "OEM", label: "Private Label" },
          { value: "Buyer-Spec", label: "Fabric & Sizing" },
          { value: "Long-Term", label: "Partnership Focus" },
        ]}
      />

      <Section variant="light" aria-labelledby="why-list-heading" className="!py-12 md:!py-16">
        <Container>
          <div className="mb-8 max-w-2xl">
            <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-2">
              What Sets Us Apart
            </p>
            <h2 id="why-list-heading" className="font-display text-h3 md:text-h2 text-navy">
              Ten Reasons Buyers Work With Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3" role="list">
            {differentiators.map((d, i) => (
              <Reveal key={d} direction="up" delay={(i % 2) * 0.05}>
                <div role="listitem" className="flex h-full items-center gap-4 rounded-card border border-line bg-cream-100 px-5 py-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crimson text-white">
                    <CheckIcon className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <p className="font-sans text-body text-navy font-medium">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        heading={home["hero.heading"]}
        ctaPrimary={home["hero.cta.primary"]}
        whatsapp={whatsapp.value}
        sectionId="why-cta-heading"
      />
    </>
  );
}

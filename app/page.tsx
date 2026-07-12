import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo-metadata";
import { buildFaqSchema } from "@/lib/seo";
import { PRODUCTS_FAQ } from "@/lib/faq-data";
import FaqSection from "@/components/sections/FaqSection";
import HomeHero from "@/components/sections/HomeHero";
import HomeQuickStats from "@/components/sections/HomeQuickStats";
import HomeTrustStrip from "@/components/sections/HomeTrustStrip";
import HomeCylinderCarousel from "@/components/sections/HomeCylinderCarousel";
import HomeCapabilitiesTabs from "@/components/sections/HomeCapabilitiesTabs";
import HomeQualityBadges from "@/components/sections/HomeQualityBadges";
import HomeCtaBand from "@/components/sections/HomeCtaBand";
import HomeIntro from "@/components/motion/HomeIntro";

export async function generateMetadata(): Promise<Metadata> {
  const heading = await prisma.contentBlock.findUniqueOrThrow({
    where: { page_key: { page: "home", key: "hero.heading" } },
  });
  const sub = await prisma.contentBlock.findUniqueOrThrow({
    where: { page_key: { page: "home", key: "hero.subheading" } },
  });
  return buildMetadata({
    title: heading.value,
    description: sub.value.split(".")[0] + ".",
    path: "/",
  });
}

export default async function HomePage() {
  // ── Server data fetches ─────────────────────────────────────────────────────
  const [
    heroCbs,
    trustCbs,
    mfgCbs,
    qualityCbs,
    whyCbs,
    oemCbs,
    categories,
    whatsappSetting,
  ] = await Promise.all([
    prisma.contentBlock.findMany({
      where: {
        page: "home",
        key: { in: ["hero.heading", "hero.subheading", "hero.cta.primary", "hero.cta.secondary", "contact.message"] },
      },
    }),
    prisma.contentBlock.findMany({
      where: {
        page: "why",
        key: { in: ["differentiator.1", "differentiator.2", "differentiator.3", "differentiator.8", "differentiator.10"] },
      },
    }),
    prisma.contentBlock.findMany({
      where: { page: "manufacturing" },
    }),
    prisma.contentBlock.findMany({
      where: { page: "quality" },
    }),
    prisma.contentBlock.findMany({
      where: {
        page: "why",
        key: { in: ["differentiator.4", "differentiator.6", "differentiator.9"] },
      },
    }),
    prisma.contentBlock.findMany({
      where: { page: "oem-services" },
    }),
    prisma.category.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    prisma.siteSetting.findUniqueOrThrow({ where: { key: "whatsapp" } }),
  ]);

  const home = Object.fromEntries(heroCbs.map((b) => [b.key, b.value]));
  const trust = Object.fromEntries(trustCbs.map((b) => [b.key, b.value]));
  const mfg = Object.fromEntries(mfgCbs.map((b) => [b.key, b.value]));
  const quality = Object.fromEntries(qualityCbs.map((b) => [b.key, b.value]));
  const why = Object.fromEntries(whyCbs.map((b) => [b.key, b.value]));
  const oem = Object.fromEntries(oemCbs.map((b) => [b.key, b.value]));

  const trustItems = [
    trust["differentiator.1"],
    trust["differentiator.2"],
    trust["differentiator.3"],
    trust["differentiator.8"],
    trust["differentiator.10"],
  ].filter(Boolean);

  const stages = mfgCbs
    .filter((b) => /^stage\.\d+$/.test(b.key))
    .sort((a, b) => a.order - b.order)
    .map((b) => b.value);

  const qcPoints = qualityCbs
    .filter((b) => b.key.startsWith("qc.point."))
    .sort((a, b) => a.order - b.order)
    .map((b) => b.value);

  const oemServices = oemCbs
    .filter((b) => b.key.startsWith("service."))
    .sort((a, b) => a.order - b.order)
    .map((b) => b.value);

  const differentiators = [why["differentiator.4"], why["differentiator.6"], why["differentiator.9"]].filter(
    Boolean
  );

  return (
    <HomeIntro>
      <HomeHero
        heading={home["hero.heading"]}
        subheading={home["hero.subheading"]}
        ctaPrimary={home["hero.cta.primary"]}
        ctaSecondary={home["hero.cta.secondary"]}
      />

      <HomeQuickStats
        stagesCount={stages.length}
        qcCount={qcPoints.length}
        oemServicesCount={oemServices.length}
      />

      <HomeTrustStrip items={trustItems} />

      <HomeCylinderCarousel
        images={categories
          .filter((c) => c.heroImage)
          .map((c) => ({
            src: c.heroImage!,
            alt: c.name,
          }))}
        title="Our Product Categories"
      />

      <HomeCapabilitiesTabs
        manufacturing={{
          heading: mfg["hero.heading"],
          intro: mfg["manufacturing.intro"],
          stages,
        }}
        quality={{
          heading: quality["hero.heading"],
          intro: quality["quality.intro"],
          points: qcPoints,
        }}
        oem={{
          heading: oem["hero.heading"],
          moqNote: oem["oem.moq"],
          services: oemServices,
        }}
      />

      <HomeQualityBadges qaIntro={quality["quality.intro"]} qcPoints={qcPoints} differentiators={differentiators} />

      <FaqSection items={PRODUCTS_FAQ} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(PRODUCTS_FAQ)) }}
      />

      <HomeCtaBand
        heading={home["hero.heading"]}
        subheading={home["hero.subheading"]}
        ctaPrimary={home["hero.cta.primary"]}
        whatsapp={whatsappSetting.value}
      />
    </HomeIntro>
  );
}

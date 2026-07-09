import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { buildServiceSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo-metadata";
import PageHero from "@/components/sections/PageHero";
import ManufacturingIntro from "@/components/sections/ManufacturingIntro";
import ManufacturingCapabilities from "@/components/sections/ManufacturingCapabilities";
import ManufacturingJourney, { type JourneyStage } from "@/components/sections/ManufacturingJourney";
import ManufacturingSupplyChain from "@/components/sections/ManufacturingSupplyChain";
import CtaBand from "@/components/sections/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const heading = await prisma.contentBlock.findUniqueOrThrow({
    where: { page_key: { page: "manufacturing", key: "hero.heading" } },
  });
  const intro = await prisma.contentBlock.findUniqueOrThrow({
    where: { page_key: { page: "manufacturing", key: "manufacturing.intro" } },
  });
  return buildMetadata({
    title: heading.value,
    description: intro.value.split(".")[0] + ".",
    path: "/services",
  });
}

export default async function ServicesPage() {
  const [mfgBlocks, homeBlocks, aboutHistory, whatsapp] = await Promise.all([
    prisma.contentBlock.findMany({ where: { page: "manufacturing" } }),
    prisma.contentBlock.findMany({
      where: {
        page: "home",
        key: { in: ["hero.heading", "hero.cta.primary"] },
      },
    }),
    prisma.contentBlock.findUniqueOrThrow({
      where: { page_key: { page: "about", key: "about.history" } },
    }),
    prisma.siteSetting.findUniqueOrThrow({ where: { key: "whatsapp" } }),
  ]);

  const cb = Object.fromEntries(mfgBlocks.map((b) => [b.key, b.value]));
  const imgMap = Object.fromEntries(mfgBlocks.map((b) => [b.key, b.imageUrl]));
  const home = Object.fromEntries(homeBlocks.map((b) => [b.key, b.value]));

  // Nine stages: label from stage.N, with optional CMS overrides for the
  // description (stage.N.desc) and photo (stage.N.image — imageUrl + alt value).
  const stages: JourneyStage[] = [];
  for (let n = 1; n <= 9; n++) {
    const label = cb[`stage.${n}`];
    if (!label) continue;
    stages.push({
      label,
      description: cb[`stage.${n}.desc`] ?? null,
      image: imgMap[`stage.${n}.image`] ?? null,
      alt: cb[`stage.${n}.image`] ?? null,
    });
  }

  // Extract the supply chain sentence from about.history (third sentence of paragraph 4)
  const historyParagraphs = aboutHistory.value.split("\n\n");
  const lastParagraph = historyParagraphs[historyParagraphs.length - 1] ?? "";
  const supplyChainSentence =
    lastParagraph
      .split(". ")
      .find((s) => s.includes("manufacturing operations") && s.includes("supply chain")) ??
    lastParagraph.split(". ")[0] ??
    lastParagraph;

  const serviceSchema = buildServiceSchema({
    name: "Apparel Manufacturing",
    description: cb["manufacturing.intro"],
    path: "/services",
  });

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <PageHero
        eyebrow="Manufacturing Capabilities"
        title={cb["hero.heading"]}
        lead={cb["manufacturing.intro"]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
        ]}
        image="/images/site/manufacturing.jpg"
        meta={[
          { value: `${stages.length}`, label: "Production Stages" },
          { value: "In-House", label: "Quality Control" },
          { value: "Faisalabad", label: "Manufacturing Base" },
          { value: "Export", label: "Packing & Shipment" },
        ]}
      />
      <ManufacturingIntro intro={cb["manufacturing.intro"]} />
      <ManufacturingCapabilities />
      <ManufacturingJourney stages={stages} />
      <ManufacturingSupplyChain
        text={
          supplyChainSentence.endsWith(".")
            ? supplyChainSentence
            : supplyChainSentence + "."
        }
      />
      <CtaBand
        heading={home["hero.heading"]}
        ctaPrimary={home["hero.cta.primary"]}
        whatsapp={whatsapp.value}
        sectionId="mfg-cta-heading"
      />
    </>
  );
}

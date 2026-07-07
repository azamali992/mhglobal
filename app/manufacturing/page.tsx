import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { buildServiceSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo-metadata";
import PageHero from "@/components/sections/PageHero";
import ManufacturingIntro from "@/components/sections/ManufacturingIntro";
import ManufacturingCapabilities from "@/components/sections/ManufacturingCapabilities";
import ManufacturingProcess from "@/components/sections/ManufacturingProcess";
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
    path: "/manufacturing",
  });
}

export default async function ManufacturingPage() {
  const [mfgBlocks, homeBlocks, aboutHistory, whatsapp] = await Promise.all([
    prisma.contentBlock.findMany({
      where: {
        page: "manufacturing",
        key: {
          in: [
            "hero.heading",
            "manufacturing.intro",
            "stage.1",
            "stage.2",
            "stage.3",
            "stage.4",
            "stage.5",
            "stage.6",
            "stage.7",
            "stage.8",
            "stage.9",
          ],
        },
      },
    }),
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
  const home = Object.fromEntries(homeBlocks.map((b) => [b.key, b.value]));

  const stages = [
    cb["stage.1"],
    cb["stage.2"],
    cb["stage.3"],
    cb["stage.4"],
    cb["stage.5"],
    cb["stage.6"],
    cb["stage.7"],
    cb["stage.8"],
    cb["stage.9"],
  ].filter(Boolean);

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
    path: "/manufacturing",
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
          { label: "Manufacturing", href: "/manufacturing" },
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
      <ManufacturingProcess
        stages={stages}
        heading={cb["hero.heading"]}
      />
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

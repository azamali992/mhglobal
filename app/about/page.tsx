import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo-metadata";
import PageHero from "@/components/sections/PageHero";
import AboutHistory from "@/components/sections/AboutHistory";
import AboutMissionVision from "@/components/sections/AboutMissionVision";
import AboutCoreValues from "@/components/sections/AboutCoreValues";
import AboutTimeline from "@/components/sections/AboutTimeline";
import CtaBand from "@/components/sections/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const [heading, intro] = await Promise.all([
    prisma.contentBlock.findUniqueOrThrow({
      where: { page_key: { page: "about", key: "hero.heading" } },
    }),
    prisma.contentBlock.findUniqueOrThrow({
      where: { page_key: { page: "about", key: "about.intro" } },
    }),
  ]);
  return buildMetadata({
    title: heading.value,
    description: intro.value.split(".")[0] + ".",
    path: "/about",
  });
}

export default async function AboutPage() {
  const [aboutBlocks, homeBlocks, whatsapp, founded] = await Promise.all([
    prisma.contentBlock.findMany({
      where: {
        page: "about",
        key: {
          in: [
            "hero.heading",
            "about.intro",
            "about.history",
            "about.mission",
            "about.vision",
            "values.quality",
            "values.reliability",
            "values.transparency",
            "values.customization",
            "values.partnership",
            "values.continuous-improvement",
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
    prisma.siteSetting.findUniqueOrThrow({ where: { key: "whatsapp" } }),
    prisma.siteSetting.findUniqueOrThrow({ where: { key: "founded" } }),
  ]);

  const cb = Object.fromEntries(aboutBlocks.map((b) => [b.key, b.value]));
  const home = Object.fromEntries(homeBlocks.map((b) => [b.key, b.value]));

  const historyParagraphs = cb["about.history"].split("\n\n");

  const coreValues = [
    { name: "Quality", description: cb["values.quality"] },
    { name: "Reliability", description: cb["values.reliability"] },
    { name: "Transparency", description: cb["values.transparency"] },
    { name: "Customization", description: cb["values.customization"] },
    { name: "Partnership", description: cb["values.partnership"] },
    { name: "Continuous Improvement", description: cb["values.continuous-improvement"] },
  ];

  // Extract milestone sentences from the history ContentBlock
  const historySentences = historyParagraphs.flatMap((p) =>
    p.split(". ").filter(Boolean)
  );
  const foundingDesc =
    historySentences.find((s) =>
      s.includes("founded with the objective")
    ) ?? historyParagraphs[1] ?? "";
  const operationsDesc =
    historySentences.find((s) =>
      s.includes("manufacturing operations")
    ) ?? historyParagraphs[3] ?? "";

  const milestones = [
    {
      year: founded.value,
      label: "Founded",
      description: foundingDesc.replace(/\.$/, "") + ".",
    },
    {
      year: String(Number(founded.value) + 1),
      label: "Operations",
      description: operationsDesc.replace(/\.$/, "") + ".",
    },
    {
      year: "Today",
      label: "Growth",
      description: cb["about.vision"],
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="About MH Global Attire"
        title={cb["hero.heading"]}
        lead={cb["about.intro"]}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
        ]}
        meta={[
          { value: founded.value, label: "Founded" },
          { value: "Faisalabad", label: "Punjab, Pakistan" },
          { value: "OEM", label: "Private Label" },
          { value: "Export", label: "Worldwide" },
        ]}
      />
      <AboutHistory paragraphs={historyParagraphs} />
      <AboutMissionVision mission={cb["about.mission"]} vision={cb["about.vision"]} />
      <AboutCoreValues values={coreValues} />
      <AboutTimeline milestones={milestones} />
      <CtaBand
        heading={home["hero.heading"]}
        ctaPrimary={home["hero.cta.primary"]}
        whatsapp={whatsapp.value}
        sectionId="about-cta-heading"
      />
    </>
  );
}

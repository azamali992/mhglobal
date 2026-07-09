import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo-metadata";
import PageHero from "@/components/sections/PageHero";
import AboutHistory from "@/components/sections/AboutHistory";
import AboutMissionVision from "@/components/sections/AboutMissionVision";
import AboutCoreValues from "@/components/sections/AboutCoreValues";
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
  const [aboutBlocks, homeBlocks, whatsapp] = await Promise.all([
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
  ]);

  const cb = Object.fromEntries(aboutBlocks.map((b) => [b.key, b.value]));
  const home = Object.fromEntries(homeBlocks.map((b) => [b.key, b.value]));

  // The hero already carries the intro paragraph, and history paragraphs 1 & 3
  // (opening + customization list) restate it almost verbatim — so show only the
  // paragraphs that add new information (founding story + operations) to avoid
  // the page feeling repetitive.
  const allHistory = cb["about.history"].split("\n\n");
  const historyParagraphs = [allHistory[1], allHistory[3]].filter(Boolean);

  const coreValues = [
    { name: "Quality", description: cb["values.quality"] },
    { name: "Reliability", description: cb["values.reliability"] },
    { name: "Transparency", description: cb["values.transparency"] },
    { name: "Customization", description: cb["values.customization"] },
    { name: "Partnership", description: cb["values.partnership"] },
    { name: "Continuous Improvement", description: cb["values.continuous-improvement"] },
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
          { value: "In-House", label: "Quality Control" },
          { value: "Faisalabad", label: "Punjab, Pakistan" },
          { value: "OEM", label: "Private Label" },
          { value: "Export", label: "Worldwide" },
        ]}
      />
      <AboutHistory paragraphs={historyParagraphs} />
      <AboutMissionVision mission={cb["about.mission"]} vision={cb["about.vision"]} />
      <AboutCoreValues values={coreValues} />
      <CtaBand
        heading={home["hero.heading"]}
        ctaPrimary={home["hero.cta.primary"]}
        whatsapp={whatsapp.value}
        sectionId="about-cta-heading"
      />
    </>
  );
}

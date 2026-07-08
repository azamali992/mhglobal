import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo-metadata";
import PageHero from "@/components/sections/PageHero";
import QualityProcess, { type QualityPhase } from "@/components/sections/QualityProcess";
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
  const imgMap = Object.fromEntries(qualityBlocks.map((b) => [b.key, b.imageUrl]));
  const home = Object.fromEntries(homeBlocks.map((b) => [b.key, b.value]));

  const points = qualityBlocks
    .filter((b) => b.key.startsWith("qc.point."))
    .sort((a, b) => a.order - b.order)
    .map((b) => b.value);

  // Three narrative phases. Title/description/photo fall back to the defaults
  // below but can be overridden from the CMS (qc.phase.N.title / .blurb /
  // .image). Checkpoints are sliced from the editable qc.point list.
  const PHASE_DEFAULTS: (Omit<QualityPhase, "points"> & { range: [number, number?] })[] = [
    {
      phase: "Before Production",
      title: "Agreeing the Standard",
      blurb:
        "Quality is decided before the first stitch. We confirm your written specification, inspect incoming fabric and trims, and verify colour and GSM against your approved standards — then lock everything in a pre-production meeting so the line starts from an agreed reference, not an assumption.",
      image: "/images/manufacturing/01-requirement-review.jpg",
      alt: "Fabric swatches and colour references reviewed against the buyer specification",
      range: [0, 5],
    },
    {
      phase: "During Production",
      title: "Checks at the Machine",
      blurb:
        "As the order runs, checks happen at the machine. Cutting is verified against the marker, stitching and measurements are monitored inline, and printing, embroidery and finishing are inspected as they are applied — so issues are corrected in-process, not discovered at the end.",
      image: "/images/quality/quality-inline.jpg",
      alt: "Inline quality checks at an industrial sewing machine during production",
      range: [5, 10],
    },
    {
      phase: "Before It Ships",
      title: "The Final Word",
      blurb:
        "Nothing leaves without a final look. Finished garments are inspected for overall appearance, workmanship and shade, and every carton's quantity and assortment is verified against your order before the shipment is sealed.",
      image: "/images/quality/quality-final-appearance.jpg",
      alt: "Finished folded garments checked for appearance before packing",
      range: [10],
    },
  ];

  const phases: QualityPhase[] = PHASE_DEFAULTS.map((d, idx) => {
    const p = idx + 1;
    const title = cb[`qc.phase.${p}.title`]?.trim() ? cb[`qc.phase.${p}.title`] : d.title;
    const blurb = cb[`qc.phase.${p}.blurb`]?.trim() ? cb[`qc.phase.${p}.blurb`] : d.blurb;
    const image = imgMap[`qc.phase.${p}.image`] ?? d.image;
    const alt = cb[`qc.phase.${p}.image`]?.trim() ? cb[`qc.phase.${p}.image`] : d.alt;
    return {
      phase: d.phase,
      title,
      blurb,
      image,
      alt,
      points: points.slice(d.range[0], d.range[1]),
    };
  });

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

      <QualityProcess phases={phases} />

      <CtaBand
        heading={home["hero.heading"]}
        ctaPrimary={home["hero.cta.primary"]}
        whatsapp={whatsapp.value}
        sectionId="quality-cta-heading"
      />
    </>
  );
}

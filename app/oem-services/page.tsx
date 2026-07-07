import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { buildServiceSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo-metadata";
import PageHero from "@/components/sections/PageHero";
import OemServices from "@/components/sections/OemServices";
import OemWorkflow from "@/components/sections/OemWorkflow";
import OemMoq from "@/components/sections/OemMoq";
import CtaBand from "@/components/sections/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  const heading = await prisma.contentBlock.findUniqueOrThrow({
    where: { page_key: { page: "oem-services", key: "hero.heading" } },
  });
  return buildMetadata({
    title: heading.value,
    description:
      "MH Global Attire offers comprehensive private label and OEM apparel manufacturing services including product development, sampling, printing, labelling and export coordination.",
    path: "/oem-services",
  });
}

export default async function OemServicesPage() {
  const [oemBlocks, homeBlocks, whatsapp] = await Promise.all([
    prisma.contentBlock.findMany({
      where: {
        page: "oem-services",
        key: {
          in: [
            "hero.heading",
            "oem.moq",
            "service.1",  "service.2",  "service.3",  "service.4",  "service.5",
            "service.6",  "service.7",  "service.8",  "service.9",  "service.10",
            "service.11", "service.12", "service.13", "service.14", "service.15",
            "service.16", "service.17", "service.18", "service.19",
            "workflow.step.1",  "workflow.step.2",  "workflow.step.3",  "workflow.step.4",
            "workflow.step.5",  "workflow.step.6",  "workflow.step.7",  "workflow.step.8",
            "workflow.step.9",  "workflow.step.10",
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

  const cb = Object.fromEntries(oemBlocks.map((b) => [b.key, b.value]));
  const home = Object.fromEntries(homeBlocks.map((b) => [b.key, b.value]));

  const services = [
    cb["service.1"],  cb["service.2"],  cb["service.3"],  cb["service.4"],
    cb["service.5"],  cb["service.6"],  cb["service.7"],  cb["service.8"],
    cb["service.9"],  cb["service.10"], cb["service.11"], cb["service.12"],
    cb["service.13"], cb["service.14"], cb["service.15"], cb["service.16"],
    cb["service.17"], cb["service.18"], cb["service.19"],
  ].filter(Boolean);

  // Parse workflow steps: "Short Label — Description" → { label, description }
  const workflowSteps = Array.from({ length: 10 }, (_, i) => {
    const raw = cb[`workflow.step.${i + 1}`] ?? "";
    const separatorIdx = raw.indexOf(" — ");
    if (separatorIdx === -1) return { label: raw, description: "" };
    return {
      label: raw.slice(0, separatorIdx),
      description: raw.slice(separatorIdx + 3),
    };
  });

  const MOQ_PREAMBLE =
    "Please contact us with your product and quantity requirements to receive a suitable MOQ and quotation.";

  const serviceSchema = buildServiceSchema({
    name: "OEM & Private Label Apparel Manufacturing",
    description:
      "Full private-label and OEM manufacturing — from product development, fabric sourcing and sampling to printing, labelling, packaging and export coordination.",
    path: "/oem-services",
  });

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <PageHero
        eyebrow="Private Label & OEM"
        title={cb["hero.heading"]}
        lead="Full private-label and OEM manufacturing — from product development, fabric sourcing and sampling to printing, labelling, packaging and export coordination."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "OEM Services", href: "/oem-services" },
        ]}
        meta={[
          { value: `${services.length}`, label: "Services Offered" },
          { value: `${workflowSteps.length}`, label: "Workflow Steps" },
          { value: "Custom", label: "Labels & Packaging" },
          { value: "Export", label: "Shipment Coordination" },
        ]}
      />
      <OemServices services={services} />
      <OemWorkflow steps={workflowSteps} />
      <OemMoq preamble={MOQ_PREAMBLE} moqDetail={cb["oem.moq"]} />
      <CtaBand
        heading={home["hero.heading"]}
        ctaPrimary={home["hero.cta.primary"]}
        whatsapp={whatsapp.value}
        sectionId="oem-cta-heading"
      />
    </>
  );
}

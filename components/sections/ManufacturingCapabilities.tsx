import {
  BeakerIcon,
  SwatchIcon,
  ScissorsIcon,
  PaintBrushIcon,
  TagIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import Reveal from "@/components/motion/Reveal";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

/**
 * Capability areas — each summarizes documented services/QC stages from the
 * master data (sampling, sourcing, cutting/stitching, printing, labelling,
 * inspection/export). Copy is factual, not promotional.
 */
const CAPABILITIES = [
  {
    icon: BeakerIcon,
    title: "Product Development & Sampling",
    body: "Pattern development, sample development and buyer approval are completed before any bulk production begins.",
    wide: true,
  },
  {
    icon: SwatchIcon,
    title: "Fabric & Materials",
    body: "Buyer-specified fabric, GSM and colour sourced through Faisalabad's textile supply chain.",
  },
  {
    icon: ScissorsIcon,
    title: "Cutting & Stitching",
    body: "Cutting inspection, inline stitching inspection and measurement checks throughout production.",
  },
  {
    icon: PaintBrushIcon,
    title: "Printing & Embroidery",
    body: "Printing and embroidery applied to approved artwork and colour references.",
  },
  {
    icon: TagIcon,
    title: "Labels & Packaging",
    body: "Custom labels, care labels, hangtags, barcode labelling and private packaging.",
  },
  {
    icon: TruckIcon,
    title: "Inspection & Export",
    body: "Final inspection, packing, quantity verification and shipment coordination.",
  },
];

export default function ManufacturingCapabilities() {
  return (
    <Section variant="white" aria-labelledby="mfg-capabilities-heading" className="!py-12 md:!py-16">
      <Container>
        <div className="mb-8">
          <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-2">
            Managed Manufacturing Capabilities
          </p>
          <h2 id="mfg-capabilities-heading" className="font-display text-h3 md:text-h2 text-navy max-w-2xl">
            One Managed Line, From Tech Pack to Shipment
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPABILITIES.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <Reveal key={cap.title} direction="up" delay={(i % 3) * 0.06} className={cap.wide ? "sm:col-span-2" : ""}>
                <div className="h-full rounded-card border border-line bg-cream-100 p-6 transition-shadow duration-200 hover:shadow-card">
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-btn bg-navy text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-h4 text-navy mb-2">{cap.title}</h3>
                  <p className="font-sans text-body text-ink-muted leading-relaxed">{cap.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

import Image from "next/image";
import {
  ClipboardDocumentCheckIcon,
  SwatchIcon,
  PencilSquareIcon,
  ScissorsIcon,
  Cog6ToothIcon,
  PaintBrushIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import Reveal from "@/components/motion/Reveal";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

/**
 * The nine-stage production story. Everything here is a *fallback*: the CMS
 * (ContentBlock page "manufacturing") can override each stage's label
 * (stage.N), description (stage.N.desc) and photo (stage.N.image). When an
 * override is absent or blank, the default below is used. The icon is fixed
 * per stage and is not editable.
 */
const STAGE_DEFAULTS: {
  description: string;
  image: string;
  alt: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}[] = [
  {
    description:
      "Every order begins with your specification. We review your tech pack, target fabric and GSM, colour standards, sizing, quantities and any printing, embroidery or private-label requirements — confirming feasibility and MOQ before a single metre of cloth is committed.",
    image: "/images/manufacturing/01-requirement-review.jpg",
    alt: "Fabric swatch book and colour reference fan used to confirm buyer specifications",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    description:
      "Once the specification is locked, we source the exact knit or woven quality, GSM and shade you have approved through Faisalabad's textile supply base. Fabric is inspected and prepared so that hand-feel, weight and colour stay consistent across the entire lot.",
    image: "/images/manufacturing/02-fabric-preparation.jpg",
    alt: "Stacked rolls of coloured fabric prepared for a production run",
    icon: SwatchIcon,
  },
  {
    description:
      "Before bulk, we develop the pattern and stitch a physical sample to your measurements. You review fit, construction and finishing on a real garment — and nothing moves forward until that sample is signed off, so the production run matches what you approved.",
    image: "/images/manufacturing/03-sampling.jpg",
    alt: "Pattern-making studio with a dress form, paper patterns and sampling machines",
    icon: PencilSquareIcon,
  },
  {
    description:
      "Approved fabric is laid, marked and cut to the graded pattern. Cutting is checked against the size set and marker so that panels are accurate, grain is correct and every bundle that reaches the sewing line is consistent.",
    image: "/images/manufacturing/04-cutting.jpg",
    alt: "Cutting fabric to a marked pattern on the cutting table",
    icon: ScissorsIcon,
  },
  {
    description:
      "Bundles move onto the sewing line, where operators assemble the garment on industrial machines. Seams, measurements and workmanship are monitored inline throughout the run — catching any deviation at the machine rather than at the end.",
    image: "/images/manufacturing/05-stitching.jpg",
    alt: "Operator stitching garments on an industrial sewing machine on the production line",
    icon: Cog6ToothIcon,
  },
  {
    description:
      "This is where your brand goes on the garment — screen or transfer printing, embroidery, custom neck and care labels, hangtags and barcode labelling — all applied to your approved artwork, thread colours and placement.",
    image: "/images/manufacturing/06-customization.jpg",
    alt: "Organised embroidery thread colours used for garment customization",
    icon: PaintBrushIcon,
  },
  {
    description:
      "Sewn garments are trimmed, pressed and steamed to their final shape, then checked for loose threads, spots and shade variation. This is the stage that turns a stitched garment into a presentable, retail-ready product.",
    image: "/images/manufacturing/07-finishing.jpg",
    alt: "Finishing floor where garments are pressed and prepared on the overhead line",
    icon: SparklesIcon,
  },
  {
    description:
      "A dedicated QC team checks finished pieces against your approved specification — measurements, workmanship, print and embroidery quality, shade and overall appearance — so that what ships is what you signed off.",
    image: "/images/manufacturing/08-inspection.jpg",
    alt: "Quality-control team inspecting finished knitted goods against specification",
    icon: MagnifyingGlassIcon,
  },
  {
    description:
      "Approved garments are folded, poly-bagged, tagged and cartoned to your packing instructions. Quantities and assortments are verified against the order before the shipment is closed and handed to export coordination.",
    image: "/images/manufacturing/09-packing.jpg",
    alt: "Neatly folded finished garments stacked and ready for packing",
    icon: CubeIcon,
  },
];

export interface JourneyStage {
  /** Stage label (CMS stage.N). */
  label: string;
  /** Optional description override (CMS stage.N.desc). */
  description?: string | null;
  /** Optional photo override (CMS stage.N.image imageUrl). */
  image?: string | null;
  /** Optional alt-text override for the photo. */
  alt?: string | null;
}

interface ManufacturingJourneyProps {
  stages: JourneyStage[];
}

export default function ManufacturingJourney({ stages }: ManufacturingJourneyProps) {
  return (
    <Section variant="white" aria-labelledby="mfg-journey-heading">
      <Container>
        <div className="mb-14 max-w-2xl md:mb-20">
          <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-2">
            The Production Journey
          </p>
          <h2
            id="mfg-journey-heading"
            className="font-display text-h3 md:text-h2 text-navy mb-4"
          >
            Nine Stages, One Managed Line
          </h2>
          <p className="font-sans text-body-lg text-ink-muted leading-relaxed">
            From the first specification to a sealed export carton, your order
            passes through nine defined stages — each with its own checks — all
            managed under one roof in Faisalabad.
          </p>
        </div>

        <ol className="space-y-16 md:space-y-28">
          {stages.map((stage, i) => {
            const detail = STAGE_DEFAULTS[i];
            if (!detail) return null;
            const Icon = detail.icon;
            const flip = i % 2 === 1;
            const description = stage.description?.trim() ? stage.description : detail.description;
            const image = stage.image?.trim() ? stage.image : detail.image;
            const alt = stage.alt?.trim() ? stage.alt : detail.alt;

            return (
              <li
                key={stage.label}
                className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-14 lg:gap-20"
              >
                {/* Photo */}
                <Reveal
                  direction={flip ? "left" : "right"}
                  className={flip ? "md:order-2" : ""}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card shadow-card">
                    <Image
                      src={image}
                      alt={alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute left-5 top-4 font-display text-[3.5rem] leading-none text-white drop-shadow-[0_2px_10px_rgba(10,34,64,0.55)] md:text-[4.5rem]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </Reveal>

                {/* Copy */}
                <Reveal
                  direction="up"
                  delay={0.08}
                  className={flip ? "md:order-1" : ""}
                >
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-navy text-white">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson">
                        Stage {String(i + 1).padStart(2, "0")} of {stages.length}
                      </span>
                    </div>
                    <h3 className="font-display text-h3 text-navy mb-3">{stage.label}</h3>
                    <p className="font-sans text-body text-ink-muted leading-relaxed">
                      {description}
                    </p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}

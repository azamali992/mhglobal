import Image from "next/image";
import {
  SwatchIcon,
  BeakerIcon,
  ScissorsIcon,
  PaintBrushIcon,
  SparklesIcon,
  Cog6ToothIcon,
  FireIcon,
  MagnifyingGlassIcon,
  TruckIcon,
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
      "Production begins in the knitting section, where yarn is knitted into greige fabric to the exact construction, gauge and GSM your order requires. Drawing on Faisalabad's established textile base, we produce single jersey, interlock, pique, fleece and rib qualities to consistent, buyer-approved standards.",
    image: "/images/manufacturing/knitting.png",
    alt: "Freshly knitted greige fabric produced to the required construction and GSM",
    icon: SwatchIcon,
  },
  {
    description:
      "Greige fabric is scoured and dyed to your approved shade under controlled temperature and time, with lab-dips and shade approval completed before bulk. Every lot is checked for colour fastness, shade continuity and GSM so the fabric entering cutting matches the standard you signed off.",
    image: "/images/manufacturing/dyeing.png",
    alt: "Fabric dyed to the buyer's approved shade under controlled conditions",
    icon: BeakerIcon,
  },
  {
    description:
      "Approved fabric is relaxed, laid and marked, then cut to graded patterns for every size in the ratio. Cutting is verified against the marker and tech-pack measurements, and panels are bundled and numbered to keep shade and size consistent through the line.",
    image: "/images/manufacturing/cutting.png",
    alt: "Fabric laid, marked and cut to graded patterns",
    icon: ScissorsIcon,
  },
  {
    description:
      "Artwork is colour-matched and applied using screen, transfer or the print technique your design calls for, on approved strike-offs before any bulk run. Placement, registration, hand-feel and wash durability are checked so branding holds to specification through the garment's life.",
    image: "/images/manufacturing/printing.png",
    alt: "Approved artwork printed onto garment panels",
    icon: PaintBrushIcon,
  },
  {
    description:
      "Logos and motifs are digitised and embroidered to your approved sample, with thread shades matched to your brand colours. Stitch density, backing and placement are controlled so every piece is clean, consistent and true to the approved artwork.",
    image: "/images/manufacturing/embroidery.png",
    alt: "Branded embroidery stitched to the approved artwork",
    icon: SparklesIcon,
  },
  {
    description:
      "Cut panels move onto the sewing lines, where trained operators assemble the garment on industrial machines to the agreed construction and stitch density. In-line inspection and measurement checks run throughout the line, so faults are caught early rather than at the end.",
    image: "/images/manufacturing/stitching.png",
    alt: "Operators assembling garments on the industrial sewing line",
    icon: Cog6ToothIcon,
  },
  {
    description:
      "Assembled garments are trimmed, pressed and steamed to their final shape and finish. Each piece is checked for loose threads, open seams and overall appearance so it reaches its intended fit and presentation before final inspection.",
    image: "/images/manufacturing/pressing.png",
    alt: "Garments pressed and steamed to their final finish",
    icon: FireIcon,
  },
  {
    description:
      "A dedicated quality team checks finished garments against your approved specification — measurements, construction, print and embroidery, shade and overall finish. Pieces are assessed to an AQL sampling standard, and anything outside tolerance is pulled for correction.",
    image: "/images/manufacturing/qualitycheck.png",
    alt: "Quality team checking finished garments against the approved specification",
    icon: MagnifyingGlassIcon,
  },
  {
    description:
      "Passed garments are folded, tagged, poly-bagged and cartoned to your packing instructions, with a final quantity and carton audit before dispatch. We prepare the shipment and coordinate documentation for on-time export to your market.",
    image: "/images/manufacturing/export.png",
    alt: "Finished garments packed and audited ready for export",
    icon: TruckIcon,
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

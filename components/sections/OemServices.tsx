import Reveal from "@/components/motion/Reveal";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import {
  PencilSquareIcon,
  SwatchIcon,
  Squares2X2Icon,
  BeakerIcon,
  ArrowsPointingOutIcon,
  PaintBrushIcon,
  PrinterIcon,
  SparklesIcon,
  TagIcon,
  HeartIcon,
  DocumentTextIcon,
  BookmarkIcon,
  ScissorsIcon,
  ArchiveBoxIcon,
  QrCodeIcon,
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
  CubeIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const SERVICE_ICONS = [
  PencilSquareIcon,     // Product development
  SwatchIcon,           // Fabric sourcing
  Squares2X2Icon,       // Pattern development
  BeakerIcon,           // Sample development
  ArrowsPointingOutIcon,// Custom sizing
  PaintBrushIcon,       // Custom colours
  PrinterIcon,          // Printing
  SparklesIcon,         // Embroidery
  TagIcon,              // Custom labels
  HeartIcon,            // Care labels
  DocumentTextIcon,     // Size labels
  BookmarkIcon,         // Hangtags
  ScissorsIcon,         // Custom trims
  ArchiveBoxIcon,       // Private packaging
  QrCodeIcon,           // Barcode labelling
  BuildingOffice2Icon,  // Bulk production
  MagnifyingGlassIcon,  // Quality inspection
  CubeIcon,             // Export packing
  TruckIcon,            // Shipment coordination
];

interface OemServicesProps {
  services: string[];
}

export default function OemServices({ services }: OemServicesProps) {
  return (
    <Section variant="light" aria-labelledby="oem-services-heading">
      <Container>
        <h2
          id="oem-services-heading"
          className="font-display text-h2 text-navy mb-10 text-center"
        >
          Services Offered
        </h2>
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          role="list"
        >
          {services.map((service, i) => {
            const Icon = SERVICE_ICONS[i] ?? TagIcon;
            return (
              <Reveal key={service} direction="up" delay={i * 0.05}>
                <div role="listitem">
                  <Card as="div" className="p-6 h-full flex flex-col items-start gap-3">
                    <Icon className="w-6 h-6 text-crimson shrink-0" aria-hidden="true" />
                    <h4 className="font-display text-h4 text-navy">{service}</h4>
                  </Card>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

import Section from "@/components/ui/Section";
import InfiniteMovingCards from "@/components/motion/InfiniteMovingCards";

interface HomeTrustStripProps {
  items: string[];
}

export default function HomeTrustStrip({ items }: HomeTrustStripProps) {
  return (
    <Section
      variant="dark"
      aria-label="Company credentials"
      className="!py-5 md:!py-5 overflow-hidden border-t border-white/10"
    >
      <InfiniteMovingCards items={items} />
    </Section>
  );
}

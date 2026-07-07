import Reveal from "@/components/motion/Reveal";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

interface Product {
  name: string;
  fabricOptions: string[];
  gsmRange: string | null;
  sizes: string | null;
  customization: string[];
}

interface CategorySpecsProps {
  product: Product;
}

function SpecList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((f) => (
        <li key={f} className="font-sans text-body text-ink-muted flex items-start gap-2.5">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-crimson shrink-0" aria-hidden="true" />
          {f}
        </li>
      ))}
    </ul>
  );
}

export default function CategorySpecs({ product }: CategorySpecsProps) {
  return (
    <Section variant="white" aria-labelledby="category-specs-heading" className="!py-12 md:!py-16">
      <Container>
        <div className="mb-8">
          <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-2">
            Specifications
          </p>
          <h2 id="category-specs-heading" className="font-display text-h3 md:text-h2 text-navy">
            Manufactured to Your Requirements
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Fabric */}
          <Reveal direction="up">
            <div className="h-full rounded-card border border-line bg-cream-100 p-6">
              <h3 className="font-display text-h4 text-navy mb-4">Fabric Options</h3>
              <SpecList items={product.fabricOptions} />
            </div>
          </Reveal>

          {/* GSM + sizes */}
          <Reveal direction="up" delay={0.08}>
            <div className="h-full rounded-card border border-line bg-cream-100 p-6 flex flex-col gap-6">
              {product.gsmRange && (
                <div>
                  <h3 className="font-display text-h4 text-navy mb-2">GSM Range</h3>
                  <p className="font-sans text-body text-ink-muted">{product.gsmRange}</p>
                </div>
              )}
              {product.sizes && (
                <div>
                  <h3 className="font-display text-h4 text-navy mb-2">Available Sizes</h3>
                  <p className="font-sans text-body text-ink-muted">{product.sizes}</p>
                </div>
              )}
            </div>
          </Reveal>

          {/* Customization */}
          <Reveal direction="up" delay={0.16}>
            <div className="h-full rounded-card border border-line bg-cream-100 p-6">
              <h3 className="font-display text-h4 text-navy mb-4">Customization</h3>
              <SpecList items={product.customization} />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

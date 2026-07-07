import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ProductItem {
  id: string;
  name: string;
  description: string | null;
  fabricOptions: string[];
  gsmRange: string | null;
  slug: string;
  image: string | null;
}

interface CategoryProductsProps {
  products: ProductItem[];
}

export default function CategoryProducts({ products }: CategoryProductsProps) {
  if (products.length === 0) return null;

  return (
    <Section variant="light" aria-labelledby="category-products-heading">
      <Container>
        <div className="mb-10">
          <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-2">
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </p>
          <h2 id="category-products-heading" className="font-display text-h3 md:text-h2 text-navy">
            Products in This Category
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <Reveal key={product.id} direction="up" delay={(i % 3) * 0.06} className="h-full">
              <Card as="article" className="h-full flex flex-col overflow-hidden !p-0">
                {/* Image */}
                <div className="relative aspect-[4/3] w-full bg-cream-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={`${product.name} — ${product.fabricOptions[0] ?? "custom apparel"}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink-muted/40">
                      <ImageOff className="h-8 w-8" aria-hidden="true" />
                    </div>
                  )}
                  {product.gsmRange && (
                    <span className="absolute top-3 left-3 inline-flex items-center font-sans font-semibold uppercase tracking-[0.06em] text-[0.65rem] px-2.5 py-1 rounded-badge bg-white/90 text-navy backdrop-blur">
                      {product.gsmRange}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-h4 text-navy mb-2">{product.name}</h3>
                  {product.description && (
                    <p className="font-sans text-body text-ink-muted leading-relaxed mb-4 flex-1">
                      {product.description}
                    </p>
                  )}
                  {product.fabricOptions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.fabricOptions.slice(0, 4).map((f) => (
                        <span
                          key={f}
                          className="inline-flex items-center font-sans text-caption font-semibold px-2.5 py-0.5 rounded-badge bg-cream-100 text-ink-muted"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                  <Button
                    asChild
                    variant="primary"
                    size="sm"
                    className="w-full mt-auto"
                    aria-label={`Request a quote for ${product.name}`}
                  >
                    <Link href="/request-a-quote">
                      Request a Quote
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

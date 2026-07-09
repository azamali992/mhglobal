import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

interface CategoryCard {
  name: string;
  slug: string;
  gsmRange: string | null;
  description: string | null;
  heroImage: string | null;
}

interface ProductsGridProps {
  categories: CategoryCard[];
}

export default function ProductsGrid({ categories }: ProductsGridProps) {
  return (
    <Section variant="light" aria-labelledby="products-grid-heading" className="!py-12 md:!py-16">
      <Container>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-2">
              Manufacturing Categories
            </p>
            <h2 id="products-grid-heading" className="font-display text-h3 md:text-h2 text-navy">
              Every Category, Built to Your Spec
            </h2>
          </div>
          <p className="hidden md:block font-sans text-caption text-ink-muted max-w-xs text-right">
            Various categories · full fabric, GSM, colour, sizing &amp; branding control
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" role="list">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} direction="up" delay={(i % 3) * 0.06} className="h-full">
              <article role="listitem" className="h-full">
                <Link
                  href={`/products/${cat.slug}`}
                  aria-label={`${cat.name} — view product category`}
                  className="group relative flex h-full min-h-[340px] flex-col justify-end overflow-hidden rounded-card border border-line shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2"
                >
                  {/* Image */}
                  {cat.heroImage ? (
                    <Image
                      src={cat.heroImage}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-navy/20" />
                  )}
                  {/* Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-navy/5 transition-opacity duration-300 group-hover:from-navy" />

                  {/* GSM badge */}
                  {cat.gsmRange && (
                    <span className="absolute top-4 left-4 z-10 inline-flex items-center font-sans font-semibold uppercase tracking-[0.06em] text-[0.65rem] px-2.5 py-1 rounded-badge bg-white/90 text-navy backdrop-blur">
                      {cat.gsmRange}
                    </span>
                  )}
                  <span className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-all duration-300 group-hover:bg-crimson">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>

                  {/* Content */}
                  <div className="relative z-10 p-5">
                    <h3 className="font-display text-h4 text-white mb-1.5">{cat.name}</h3>
                    {cat.description && (
                      <p className="font-sans text-sm text-white/70 leading-relaxed line-clamp-2 max-h-0 opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

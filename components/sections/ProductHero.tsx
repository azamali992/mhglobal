import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export interface ProductHeroBreadcrumbItem {
  label: string;
  href: string;
}

interface ProductHeroProps {
  name: string;
  description: string | null;
  gsmRange: string | null;
  image: string | null;
  breadcrumb: ProductHeroBreadcrumbItem[];
}

export default function ProductHero({ name, description, gsmRange, image, breadcrumb }: ProductHeroProps) {
  return (
    <section
      aria-labelledby="product-hero-heading"
      className="relative w-full bg-navy text-white overflow-hidden pt-28 md:pt-36 pb-12 md:pb-16"
    >
      {image && (
        <div className="absolute inset-0" aria-hidden="true">
          <Image src={image} alt="" fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-navy/50" />
        </div>
      )}

      <Container className="relative z-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 font-sans text-caption text-white/50">
            {breadcrumb.map((item, i) => {
              const isLast = i === breadcrumb.length - 1;
              return (
                <li key={item.href} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-white/30" aria-hidden="true" />}
                  {isLast ? (
                    <span className="text-white/80" aria-current="page">{item.label}</span>
                  ) : (
                    <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <p className="font-sans text-caption font-semibold uppercase tracking-[0.16em] text-crimson mb-4">
          Product
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-5">
          <h1 id="product-hero-heading" className="font-display text-h2 md:text-h1 text-white">
            {name}
          </h1>
          {gsmRange && (
            <span className="inline-flex items-center font-sans font-semibold uppercase tracking-[0.06em] text-[0.7rem] px-3 py-1 rounded-badge bg-white/10 text-white backdrop-blur">
              {gsmRange}
            </span>
          )}
        </div>

        {description && (
          <p className="font-sans text-body-lg text-white/80 max-w-3xl mb-8">{description}</p>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button asChild variant="primary" size="md">
            <Link href="/request-a-quote">Request a Quote</Link>
          </Button>
          <Link
            href={breadcrumb[breadcrumb.length - 2]?.href ?? "/products"}
            className="font-sans text-sm font-semibold text-white/80 hover:text-white transition-colors"
          >
            ← Back to {breadcrumb[breadcrumb.length - 2]?.label ?? "Products"}
          </Link>
        </div>
      </Container>
    </section>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import { BentoGrid, BentoGridItem } from "@/components/aceternity/BentoGrid";
import ThreeDCard from "@/components/aceternity/ThreeDCard";

interface CategoryItem {
  name: string;
  slug: string;
  gsmRange: string | null;
  heroImage: string | null;
  order: number;
}

interface HomeBentoGridProps {
  categories: CategoryItem[];
  ctaSecondary: string;
}

/** Returns Cloudinary-transformed URL if applicable, or passes through local paths */
function imgSrc(src: string | null, ar: string, w: number): string {
  if (!src) return "/images/categories/t-shirts.jpg";
  if (src.startsWith("/")) return src;
  // Cloudinary transform
  if (src.includes("cloudinary")) {
    return src.replace("/upload/", `/upload/f_auto,q_auto,c_fill,g_center,ar_${ar},w_${w}/`);
  }
  return src;
}

export default function HomeBentoGrid({ categories, ctaSecondary }: HomeBentoGridProps) {
  return (
    <Section
      variant="light"
      aria-labelledby="home-categories-heading"
    >
      <Container>
        <div className="mb-10 text-center">
          <h2
            id="home-categories-heading"
            className="font-display text-h2 text-navy mb-3"
          >
            Products
          </h2>
        </div>

        <BentoGrid cols={4} className="auto-rows-[260px] lg:auto-rows-[260px]">
          {categories.map((cat, i) => {
            // Only the first category gets the large 2x2 hero cell — a
            // single featured cell plus a uniform grid tessellates with zero
            // gaps; two independent 2x2 cells among 6 items fights CSS
            // Grid's auto-placement (even with grid-flow-dense) and produces
            // unpredictable dead space depending on item order.
            const isLarge = cat.order === 0;
            const ar = isLarge ? "16:9" : "4:3";
            const w = isLarge ? 800 : 600;

            return (
              <BentoGridItem
                key={cat.slug}
                colSpan={isLarge ? 2 : 1}
                rowSpan={isLarge ? 2 : 1}
                index={i}
                className={isLarge ? "lg:row-span-2 lg:h-[360px] h-[260px]" : "h-[260px]"}
              >
                <ThreeDCard className="h-full">
                  <Link
                    href={`/products/${cat.slug}`}
                    className="group relative block w-full h-full overflow-hidden rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2"
                    aria-label={`${cat.name} — view category`}
                  >
                    {cat.heroImage && (
                      <Image
                        src={imgSrc(cat.heroImage, ar, w)}
                        alt={cat.name}
                        fill
                        sizes={isLarge ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    {/* Navy gradient overlay */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-navy/40 to-navy/70"
                    />
                    {/* Card text */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {cat.gsmRange && (
                        <span className="inline-flex items-center font-sans font-semibold uppercase tracking-[0.08em] text-[0.6875rem] px-3 py-1 rounded-badge bg-navy text-white mb-2">
                          {cat.gsmRange}
                        </span>
                      )}
                      <h3 className="font-display text-h4 text-white m-0">{cat.name}</h3>
                    </div>
                  </Link>
                </ThreeDCard>
              </BentoGridItem>
            );
          })}
        </BentoGrid>

        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="font-sans font-semibold text-crimson hover:text-crimson-600 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson rounded-btn px-2"
          >
            {ctaSecondary} →
          </Link>
        </div>
      </Container>
    </Section>
  );
}

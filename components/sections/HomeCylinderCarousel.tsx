"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CylinderCarousel, CarouselImage } from "@/components/ui/cylinder-carousel";
import Container from "@/components/ui/Container";

interface HomeCylinderCarouselProps {
  images: CarouselImage[];
  title?: string;
}

export default function HomeCylinderCarousel({ images, title }: HomeCylinderCarouselProps) {
  // Pause the infinite CSS rotation while the carousel is off-screen so it
  // stops occupying the compositor during unrelated scrolling.
  const wrapRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="home-carousel-heading" className="w-full bg-cream overflow-hidden py-12 md:py-16">
      <Container className="flex items-end justify-between mb-6 md:mb-8">
        <div>
          <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-2">
            Full Product Range
          </p>
          {title && (
            <h2 id="home-carousel-heading" className="text-h3 md:text-h2 text-navy">
              {title}
            </h2>
          )}
        </div>
        <Link
          href="/products"
          className="hidden sm:inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-navy hover:text-crimson transition-colors whitespace-nowrap"
        >
          View All Categories <ArrowRight className="w-4 h-4" />
        </Link>
      </Container>
      <div ref={wrapRef} className={`w-full ${onScreen ? "" : "[&_*]:![animation-play-state:paused]"}`}>
        <CylinderCarousel
          images={images}
          cardWidth={440}
          animationDuration={44}
          className="min-h-[560px] md:min-h-[680px]"
        />
      </div>
    </section>
  );
}

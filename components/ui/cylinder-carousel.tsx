/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CarouselImage {
  src: string;
  alt?: string;
}

export interface CylinderCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: CarouselImage[];
  containerClassName?: string;
  cardClassName?: string;
  animationDuration?: number;
  cardWidth?: number;
}

/**
 * vengenceui Cylinder Carousel — https://www.vengenceui.com
 * A pure-CSS 3D cylinder of cards that auto-rotates on the Y axis.
 * Registry item added manually (registry URL currently returns 404).
 */
export const CylinderCarousel = React.forwardRef<HTMLDivElement, CylinderCarouselProps>(
  (
    {
      images,
      className,
      containerClassName,
      cardClassName,
      animationDuration = 32,
      cardWidth = 250,
      ...props
    },
    ref
  ) => {
    const N = images.length;
    const cylinderRadius = (0.5 * cardWidth + 8) / Math.tan(Math.PI / N);

    const customStyle = {
      "--n": N,
      "--w": `${cardWidth}px`,
      "--r": `${cylinderRadius}px`,
      "--anim-dur": `${animationDuration}s`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn("w-full min-h-[600px] grid place-items-center overflow-hidden", className)}
        style={{ perspective: `${cylinderRadius * 4}px` }}
        {...props}
      >
        <div
          className={cn(
            "grid place-items-center [transform-style:preserve-3d] motion-reduce:!animate-[ry_128s_linear_infinite]",
            containerClassName
          )}
          style={{ ...customStyle, animation: "ry var(--anim-dur) linear infinite" }}
        >
          <style>{`
            @keyframes ry {
              to { transform: rotateY(1turn); }
            }
          `}</style>

          {images.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt || `Carousel image ${i}`}
              className={cn(
                "[grid-area:1/1] object-cover rounded-2xl [backface-visibility:hidden]",
                cardClassName
              )}
              style={
                {
                  width: "var(--w)",
                  aspectRatio: "7/10",
                  "--i": i,
                  transform: `rotateY(${(360 / N) * i}deg) translateZ(${-cylinderRadius}px)`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>
    );
  }
);

CylinderCarousel.displayName = "CylinderCarousel";

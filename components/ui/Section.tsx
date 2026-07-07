import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Visual variant:
   * - 'light'  → cream background
   * - 'dark'   → navy background with white text overrides
   * - 'white'  → white background
   */
  variant?: "light" | "dark" | "white";
}

/**
 * Full-viewport-width section strip.
 * Always used as a direct child of the page; place a Container inside for content.
 * Implements design-system-spec-0A §3.6 (SectionWrapper).
 */
const Section = forwardRef<HTMLElement, SectionProps>(
  ({ variant = "light", className, children, ...props }, ref) => {
    const variantClasses = {
      light: "w-full bg-cream py-10 md:py-section-y",
      dark: "w-full bg-navy py-10 md:py-section-y text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white",
      white: "w-full bg-white py-10 md:py-section-y",
    };

    return (
      <section
        ref={ref as React.Ref<HTMLElement>}
        className={cn(variantClasses[variant], className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";

export default Section;

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual variant — 'default' for cream-100 surface, 'dark' for navy-800 surface */
  variant?: "default" | "dark";
  /** When true, adds hover shadow and cursor-pointer for interactive cards */
  interactive?: boolean;
  /** Render as article (content entity) or div (layout container). Defaults to 'article'. */
  as?: "article" | "div";
}

/**
 * MH Global Attire card primitive.
 * Implements all variants/states from design-system-spec-0A §3.2.
 */
const Card = forwardRef<HTMLElement, CardProps>(
  (
    { variant = "default", interactive = false, as: Tag = "article", className, children, ...props },
    ref
  ) => {
    const base = "rounded-card p-8";

    const variantClasses =
      variant === "dark"
        ? "bg-navy-800 shadow-card-dark text-white [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white"
        : "bg-cream-100 border border-line shadow-card";

    const interactiveClasses =
      interactive
        ? "cursor-pointer transition-shadow duration-200 hover:shadow-[0_4px_20px_rgba(10,34,64,0.14)]"
        : "";

    return (
      <Tag
        // forwardRef type cast — HTMLElement covers both article and div
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(base, variantClasses, interactiveClasses, className)}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Card.displayName = "Card";

export default Card;

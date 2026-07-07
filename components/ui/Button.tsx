"use client";

import React, { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

/** Controls the color/border treatment based on background context */
type SecondaryContext = "light" | "dark";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant */
  variant?: "primary" | "secondary" | "ghost";
  /** Size scale */
  size?: "sm" | "md" | "lg";
  /**
   * Only relevant when variant === 'secondary'.
   * Use 'light' on cream/white SectionWrapper; use 'dark' on navy SectionWrapper.
   * Defaults to 'light'.
   */
  secondaryContext?: SecondaryContext;
  /** Shows aria-busy and renders children with loading affordance */
  isLoading?: boolean;
  /** Render as an anchor tag while keeping button styles */
  asChild?: boolean;
}

const BASE =
  "inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide " +
  "rounded-btn transition-colors duration-150 ease-in-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

const VARIANTS: Record<string, Record<SecondaryContext, string> | string> = {
  primary:
    "bg-crimson text-white hover:bg-crimson-600 active:bg-crimson-600 focus-visible:ring-crimson",
  secondary: {
    light:
      "bg-transparent border-2 border-navy text-navy hover:bg-navy hover:text-white active:bg-navy active:text-white focus-visible:ring-navy",
    dark: "bg-transparent border-2 border-white text-white hover:bg-white hover:text-navy active:bg-white active:text-navy focus-visible:ring-white",
  },
  ghost:
    "bg-transparent text-crimson hover:bg-cream-100 active:bg-line focus-visible:ring-crimson",
};

const SIZES: Record<string, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-body px-6 py-3",
  lg: "text-body-lg px-8 py-4",
};

/**
 * MH Global Attire button primitive.
 * Implements all variants/sizes/states from design-system-spec-0A §3.1.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      secondaryContext = "light",
      isLoading = false,
      className,
      children,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const variantClasses =
      variant === "secondary"
        ? (VARIANTS.secondary as Record<SecondaryContext, string>)[
            secondaryContext
          ]
        : (VARIANTS[variant] as string);

    const isDisabled = disabled || isLoading;

    // asChild merges these classes + props onto the single child element
    // (typically a Next.js <Link>) instead of rendering a second, nested
    // <button> — nesting a real <button> inside a real <a> both leaves two
    // independently-focusable elements in the tab order for one visual
    // control, and is invalid HTML (interactive content inside interactive
    // content). type/disabled are button-only attributes, so they're only
    // applied on the real <button> branch; the asChild branch uses
    // aria-disabled instead, which works on any element.
    if (asChild) {
      return (
        <Slot
          ref={ref}
          aria-busy={isLoading ? "true" : undefined}
          aria-disabled={isDisabled ? "true" : undefined}
          className={cn(BASE, variantClasses, SIZES[size], className)}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-busy={isLoading ? "true" : undefined}
        className={cn(BASE, variantClasses, SIZES[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

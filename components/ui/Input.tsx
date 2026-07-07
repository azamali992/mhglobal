import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Input label text */
  label: string;
  /** Unique id used for label association and aria attributes */
  id: string;
  /** Error message to display below the input; also triggers error styling */
  error?: string;
  /**
   * Label color context — 'light' (default) for navy text on cream/white
   * surfaces, 'dark' for white text when the Input sits on a navy/navy-800
   * surface (e.g. the admin login card). The input field itself is always
   * a white box either way, so only the label needs to adapt.
   */
  variant?: "light" | "dark";
}

/**
 * MH Global Attire Input primitive.
 * Implements design-system-spec-0A §3.4 verbatim.
 *
 * Renders:
 *   <div wrapper>
 *     <label>
 *     <input>
 *     <p role="alert"> (when error is present)
 *   </div>
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, error, className, required, variant = "light", ...props }, ref) => {
    const hasError = !!error;
    const errorId = `${id}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className={cn(
            "font-sans text-sm font-medium",
            variant === "dark" ? "text-white" : "text-navy"
          )}
        >
          {label}
          {required && (
            <span aria-hidden="true" className={cn("ml-0.5", variant === "dark" ? "text-crimson-light" : "text-crimson")}>
              *
            </span>
          )}
        </label>

        <input
          ref={ref}
          id={id}
          aria-invalid={hasError ? "true" : "false"}
          aria-describedby={hasError ? errorId : undefined}
          aria-required={required ? "true" : undefined}
          required={required}
          className={cn(
            // Base — rest state (§3.4)
            "w-full bg-white font-sans text-body text-navy rounded-input",
            "border border-line px-4 py-3",
            "placeholder:text-ink-muted/50",
            "transition-colors duration-150 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy",
            // Disabled state
            "disabled:border-line disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-cream",
            // Error state — overrides border and focus ring colours
            hasError && "border-crimson focus:ring-crimson/20 focus:border-crimson",
            className
          )}
          {...props}
        />

        {hasError && (
          <p id={errorId} role="alert" className="font-sans text-caption text-crimson">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

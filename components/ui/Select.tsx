import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Input label text — pass empty string and use aria-label for sr-only scenarios */
  label: string;
  /** Unique id used for label association and aria attributes */
  id: string;
  /** Error message to display below the select; also triggers error styling */
  error?: string;
  /** When true, label is visually hidden but still accessible */
  srOnlyLabel?: boolean;
}

export const SELECT_CLASS =
  "w-full bg-white font-sans text-sm text-navy rounded-input " +
  "border border-line px-4 py-3 " +
  "transition-colors duration-150 ease-in-out " +
  "focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy " +
  "disabled:border-line disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-cream-100 " +
  "appearance-none cursor-pointer";

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, error, className, required, srOnlyLabel, ...props }, ref) => {
    const hasError = !!error;
    const errorId = `${id}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className={cn(
            "font-sans text-sm font-medium text-navy",
            srOnlyLabel && "sr-only"
          )}
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-crimson">
              *
            </span>
          )}
        </label>

        <div className="relative">
          <select
            ref={ref}
            id={id}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? errorId : undefined}
            aria-required={required ? "true" : undefined}
            required={required}
            className={cn(SELECT_CLASS, hasError && "border-crimson focus:ring-crimson/20 focus:border-crimson", className)}
            {...props}
          />
          {/* Chevron icon */}
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ink-muted">
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </span>
        </div>

        {hasError && (
          <p id={errorId} role="alert" className="font-sans text-caption text-crimson">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;

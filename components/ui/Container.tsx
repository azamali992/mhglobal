import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Layout container providing max-width constraint and responsive horizontal gutters.
 * Always the first and only direct child of a SectionWrapper.
 * Implements design-system-spec-0A §3.7.
 */
const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-[1280px] mx-auto px-container-x md:px-8 lg:px-12",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export default Container;

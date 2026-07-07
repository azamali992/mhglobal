"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Floating WhatsApp contact button.
 * - Fixed bottom-right, z-index above nav (z-[60]).
 * - Links to wa.me/923213995224 — exact number from master plan §14.
 * - Pulse animation disabled under prefers-reduced-motion.
 * - Hidden on any /admin route (guard for future admin panel).
 * - WhatsApp brand green (#25D366) is the sole exception to the site palette
 *   as it is a third-party brand mark, not a UI design token.
 */
export default function WhatsAppButton() {
  const pathname = usePathname();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Do not render on any /admin route
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      href="https://wa.me/923213995224?text=Hello%2C%20I%20am%20interested%20in%20your%20apparel%20manufacturing%20services"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-[60] flex items-center justify-center w-14 h-14 rounded-full shadow-card-dark"
      style={{ backgroundColor: "#25D366" }}
    >
      {/* Pulse ring — brand green, suppressed under prefers-reduced-motion */}
      {!prefersReducedMotion && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-40"
          style={{ backgroundColor: "#25D366" }}
          aria-hidden="true"
        />
      )}

      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-7 h-7 relative z-10"
        fill="white"
        aria-hidden="true"
      >
        <path d="M16.001 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.347.636 4.637 1.844 6.64L2.667 29.333l6.88-1.804A13.27 13.27 0 0 0 16.001 29.333C23.363 29.333 29.333 23.363 29.333 16S23.363 2.667 16.001 2.667zm0 2.4c5.99 0 10.932 4.942 10.932 10.933 0 5.99-4.942 10.933-10.932 10.933a10.9 10.9 0 0 1-5.547-1.511l-.397-.237-4.083 1.07 1.09-3.978-.26-.414A10.9 10.9 0 0 1 5.07 16c0-5.99 4.942-10.933 10.931-10.933zm-3.045 5.6c-.2 0-.526.074-.8.37-.274.296-1.047 1.022-1.047 2.493s1.07 2.893 1.22 3.093c.148.2 2.07 3.26 5.08 4.44 2.508.99 3.016.793 3.56.744.544-.05 1.754-.716 2.002-1.407.248-.69.248-1.282.174-1.406-.074-.124-.274-.2-.573-.348-.3-.148-1.754-.866-2.028-.963-.274-.1-.474-.148-.673.149-.2.296-.77.963-.944 1.163-.174.198-.348.223-.647.074-.3-.15-1.264-.465-2.41-1.483-.89-.794-1.492-1.773-1.666-2.072-.174-.298-.018-.459.131-.607.134-.133.3-.347.448-.52.148-.175.197-.3.296-.5.099-.2.05-.373-.025-.522-.074-.148-.66-1.627-.916-2.226-.24-.578-.49-.496-.673-.505-.174-.008-.373-.01-.572-.01z" />
      </svg>
    </a>
  );
}

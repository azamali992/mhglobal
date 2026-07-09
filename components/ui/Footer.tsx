import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import type { NavCategory } from "@/components/layout/SiteChrome";

/** lucide-react ships no brand glyphs — inline SVGs, same convention as WhatsAppButton.tsx */
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.25h4.5V23H.24V8.25zM8.25 8.25h4.31v2.01h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V23h-4.5v-6.93c0-1.65-.03-3.78-2.3-3.78-2.3 0-2.66 1.8-2.66 3.66V23h-4.5V8.25z" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
    <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
  </svg>
);

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "OEM Services", href: "/oem-services" },
  { label: "Quality Assurance", href: "/quality-assurance" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Why Choose Us", href: "/why-choose-us" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Request a Quote", href: "/request-a-quote" },
  { label: "Contact", href: "/contact" },
];

/**
 * Site footer — company/contact copy sourced verbatim from master plan §14/§15.
 * Facebook profile URL not found in master plan data; using '#' placeholder.
 */
export default function Footer({ categories }: { categories: NavCategory[] }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="w-full bg-navy text-white">
      <Container className="py-12 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-10">
          {/* Brand + contact — spans 2 columns on desktop */}
          <div className="col-span-2">
            <div className="h-16 w-16 rounded-md bg-cream-100 shadow-card p-2 mb-4">
              <Image
                src="/logo.png"
                alt="MH Global Attire"
                width={144}
                height={144}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="font-sans text-sm text-white/70 leading-relaxed mb-5 max-w-xs">
              Custom apparel manufacturing and export for international brands, importers,
              wholesalers and private-label businesses — from Faisalabad, Pakistan.
            </p>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5 text-sm text-white/70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-crimson" aria-hidden="true" />
                <span>Head Office and MH Global Attire Mill, Faisalabad, Pakistan</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Phone className="w-4 h-4 shrink-0 text-crimson" aria-hidden="true" />
                <a href="tel:+923213995224" className="text-white/70 hover:text-crimson transition-colors">
                  +92 321 3995224
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Mail className="w-4 h-4 shrink-0 text-crimson" aria-hidden="true" />
                <a href="mailto:info@mhglobalattire.com" className="text-white/70 hover:text-crimson transition-colors">
                  info@mhglobalattire.com
                </a>
              </li>
            </ul>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://www.instagram.com/mhglobalattire"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MH Global Attire on Instagram"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.linkedin.com/company/mh-global-attire/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MH Global Attire on LinkedIn"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                <LinkedinIcon />
              </a>
              <a
                href="https://www.facebook.com/share/1BSreyW39j/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MH Global Attire on Facebook"
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Product Categories — live from CMS */}
          <div>
            <h3 className="font-sans text-sm font-semibold text-white uppercase tracking-[0.08em] mb-4">
              Products
            </h3>
            <ul className="space-y-2">
              {categories.slice(0, 8).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/products/${cat.slug}`}
                    className="font-sans text-sm text-white/70 hover:text-crimson-light transition-colors duration-150"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="font-sans text-sm font-semibold text-crimson-light hover:text-white transition-colors duration-150">
                  View All →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-sans text-sm font-semibold text-white uppercase tracking-[0.08em] mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-sans text-sm text-white/70 hover:text-crimson transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Founder */}
          <div>
            <h3 className="font-sans text-sm font-semibold text-white uppercase tracking-[0.08em] mb-4">
              Resources
            </h3>
            <ul className="space-y-2 mb-5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-sans text-sm text-white/70 hover:text-crimson transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="font-sans text-sm text-white/70 leading-relaxed">
              Ahmad Hassan
              <br />
              <span className="text-white/50">Founder &amp; Managing Director</span>
            </p>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <Container>
          <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3 font-sans text-caption text-white/50">
            <p>&copy; {currentYear} MH Global Attire Ltd. All rights reserved.</p>
            <p>Faisalabad, Punjab, Pakistan</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}

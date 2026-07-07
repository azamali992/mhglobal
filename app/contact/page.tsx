import { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, User, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Contact MH Global Attire — apparel manufacturing and export in Faisalabad, Pakistan. Call, WhatsApp or email our team to discuss your order.",
  path: "/contact",
});

export default async function ContactPage() {
  const settings = await prisma.siteSetting.findMany();
  const s = Object.fromEntries(settings.map((x) => [x.key, x.value]));

  const wa = (s["whatsapp"] ?? "").replace(/\s/g, "").replace("+", "");
  const waHref = `https://wa.me/${wa}?text=Hello%2C%20I%20am%20interested%20in%20your%20apparel%20manufacturing%20services`;

  const methods = [
    {
      icon: Phone,
      label: "Call Us",
      value: s["phone"],
      href: `tel:${(s["phone"] ?? "").replace(/\s/g, "")}`,
    },
    { icon: MessageCircle, label: "WhatsApp", value: s["whatsapp"], href: waHref, external: true },
    { icon: Mail, label: "General Enquiries", value: s["email.info"], href: `mailto:${s["email.info"]}` },
    { icon: Mail, label: "Sales", value: s["email.sales"], href: `mailto:${s["email.sales"]}` },
  ];

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Let's Talk About Your Order"
        lead="Tell us about your product category, quantity, fabric, GSM, colours, sizes, printing, embroidery, labels, packaging and required delivery timeline — our team will review and respond with next steps."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      <Section variant="light" aria-labelledby="contact-methods-heading" className="!py-12 md:!py-16">
        <Container>
          <h2 id="contact-methods-heading" className="sr-only">
            Contact methods
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
            {/* Left — contact method cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {methods.map((m, i) => {
                const Icon = m.icon;
                return (
                  <Reveal key={m.label} direction="up" delay={(i % 2) * 0.06}>
                    <a
                      href={m.href}
                      target={m.external ? "_blank" : undefined}
                      rel={m.external ? "noopener noreferrer" : undefined}
                      className="group flex h-full flex-col gap-3 rounded-card border border-line bg-cream-100 p-6 transition-shadow duration-200 hover:shadow-card"
                    >
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-btn bg-navy text-white transition-colors group-hover:bg-crimson">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="font-sans text-caption uppercase tracking-[0.08em] text-ink-muted">
                        {m.label}
                      </span>
                      <span className="font-display text-h4 text-navy break-words">{m.value}</span>
                    </a>
                  </Reveal>
                );
              })}

              {/* Address — full width */}
              <Reveal direction="up" delay={0.12} className="sm:col-span-2">
                <div className="flex h-full items-start gap-4 rounded-card border border-line bg-cream-100 p-6">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-navy text-white">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <span className="font-sans text-caption uppercase tracking-[0.08em] text-ink-muted">
                      Manufacturing Base
                    </span>
                    <p className="font-sans text-body text-navy mt-1">{s["address"]}</p>
                    <p className="mt-3 flex items-center gap-2 font-sans text-sm text-ink-muted">
                      <User className="h-4 w-4 text-crimson" aria-hidden="true" />
                      {s["founder"]} · Founder &amp; Managing Director
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right — inquiry CTA panel */}
            <Reveal direction="left" delay={0.1}>
              <div className="flex h-full flex-col justify-center rounded-card bg-navy p-8 text-white">
                <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-3">
                  Fastest Way to Start
                </p>
                <h3 className="font-display text-h3 text-white mb-3">Send a Detailed Inquiry</h3>
                <p className="font-sans text-body text-white/70 leading-relaxed mb-6">
                  Share your specifications through our inquiry form and receive a suitable MOQ and quotation.
                </p>
                <div className="flex flex-col gap-3">
                  <Link href="/request-a-quote">
                    <Button variant="primary" size="md" className="w-full">
                      Request a Quote
                    </Button>
                  </Link>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-btn border-2 border-white/30 px-6 py-3 font-sans text-sm font-semibold text-white transition-colors hover:border-white"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}

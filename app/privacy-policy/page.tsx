import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How MH Global Attire Ltd. collects, uses and protects the information you share through our website and inquiry forms.",
  path: "/privacy-policy",
});

const SECTIONS = [
  {
    h: "Information We Collect",
    p: [
      "When you submit an inquiry or request a quotation, we collect the details you provide — such as your name, company, country, email, phone number and the product requirements described in your message (product category, quantity, fabric, GSM, colours, sizing, customization and any files you attach).",
      "We do not collect payment information through this website. Any commercial terms are arranged separately once an inquiry has been reviewed.",
    ],
  },
  {
    h: "How We Use Your Information",
    p: [
      "We use the information you provide solely to respond to your inquiry, prepare quotations, develop samples and manage any resulting production and shipment. We may contact you by email, phone or WhatsApp using the details you supply.",
    ],
  },
  {
    h: "Sharing & Third Parties",
    p: [
      "We do not sell your information. We share it only with service providers that help us operate — for example email delivery and file hosting — and only to the extent necessary to respond to your inquiry. These providers are required to protect your information.",
    ],
  },
  {
    h: "Data Retention",
    p: [
      "We retain inquiry records for as long as needed to serve you and to maintain our business records. You may ask us to update or delete your information at any time using the contact details below.",
    ],
  },
  {
    h: "Your Choices",
    p: [
      "You can request access to, correction of, or deletion of the information you have shared with us. To make a request, contact us at info@mhglobalattire.com.",
    ],
  },
  {
    h: "Contact",
    p: [
      "MH Global Attire Ltd., Hassan Dall Mills, New Mandi Road, Faisalabad, Punjab, Pakistan — 38000. Email: info@mhglobalattire.com.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        lead="How we handle the information you share with us. Last updated July 2026."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy", href: "/privacy-policy" },
        ]}
      />
      <Section variant="light" className="!py-12 md:!py-16">
        <Container>
          <div className="max-w-3xl space-y-10">
            {SECTIONS.map((s) => (
              <section key={s.h}>
                <h2 className="font-display text-h3 text-navy mb-3">{s.h}</h2>
                {s.p.map((para, i) => (
                  <p key={i} className="font-sans text-body text-ink-muted leading-relaxed mb-3 last:mb-0">
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description: "The terms that govern use of the MH Global Attire website and the submission of inquiries and quotation requests.",
  path: "/terms",
});

const SECTIONS = [
  {
    h: "Use of This Website",
    p: [
      "This website presents information about MH Global Attire Ltd. and its apparel manufacturing and export services. Content is provided for general information and may be updated at any time without notice.",
    ],
  },
  {
    h: "Inquiries & Quotations",
    p: [
      "Submitting an inquiry does not create a contract. Product requirements, pricing, minimum order quantities, lead times and other commercial terms are confirmed separately in writing after an inquiry has been reviewed.",
      "Any samples, quotations or specifications we provide are subject to buyer approval before bulk production begins.",
    ],
  },
  {
    h: "Product Specifications",
    p: [
      "Fabric, GSM, colours, sizing, printing, embroidery, labelling and packaging are manufactured to the specifications agreed with each buyer. Descriptions and images on this website are indicative and may vary from final production according to agreed requirements.",
    ],
  },
  {
    h: "Intellectual Property",
    p: [
      "Designs, artwork, tech packs and brand materials that you provide remain your property and are used only to fulfil your order. The MH Global Attire name, logo and website content remain our property.",
    ],
  },
  {
    h: "Limitation of Liability",
    p: [
      "We aim to keep information on this website accurate but make no warranty that it is complete or error-free. To the extent permitted by law, we are not liable for any loss arising from reliance on website content alone, separate from a confirmed order agreement.",
    ],
  },
  {
    h: "Governing Law",
    p: [
      "These terms are governed by the laws of Pakistan. Any confirmed order is additionally governed by the specific terms agreed between the parties.",
    ],
  },
  {
    h: "Contact",
    p: [
      "MH Global Attire Ltd., Hassan Dall Mills, New Mandi Road, Faisalabad, Punjab, Pakistan — 38000. Email: info@mhglobalattire.com.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        lead="The terms that govern use of this website and our inquiry process. Last updated July 2026."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Terms & Conditions", href: "/terms" },
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

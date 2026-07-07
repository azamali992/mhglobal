import { Metadata } from "next";
import { ClipboardList, MessagesSquare, PackageCheck } from "lucide-react";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Reveal from "@/components/motion/Reveal";
import InquiryForm from "@/components/sections/InquiryForm";

export const metadata: Metadata = buildMetadata({
  title: "Request a Quote",
  description:
    "Submit your apparel manufacturing requirements — product, quantity, fabric, GSM, colours, sizing and customization — to receive a suitable MOQ and quotation.",
  path: "/request-a-quote",
});

const STEPS = [
  { icon: ClipboardList, title: "Submit Requirements", body: "Share your product, quantity, fabric, GSM, colours, sizing and customization." },
  { icon: MessagesSquare, title: "Review & Quotation", body: "We review your specs and respond with a suitable MOQ, costing and next steps." },
  { icon: PackageCheck, title: "Sample to Bulk", body: "On approval we develop a sample, then move to bulk with in-process quality checks." },
];

export default async function RequestAQuotePage() {
  const categories = await prisma.category.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    select: { name: true, slug: true },
  });

  return (
    <>
      <PageHero
        eyebrow="Buyer Inquiry"
        title="Request a Quote"
        lead="The more detail you share, the faster we can respond with an accurate MOQ and quotation. Every field beyond name and email is optional."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Request a Quote", href: "/request-a-quote" },
        ]}
      />

      <Section variant="light" aria-labelledby="quote-form-heading" className="!py-12 md:!py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
            {/* Form */}
            <div>
              <h2 id="quote-form-heading" className="sr-only">
                Inquiry form
              </h2>
              <InquiryForm categories={categories} />
            </div>

            {/* How it works */}
            <aside aria-label="What happens next">
              <p className="font-sans text-caption font-semibold uppercase tracking-[0.14em] text-crimson mb-2">
                What Happens Next
              </p>
              <h3 className="font-display text-h3 text-navy mb-6">A Clear, Managed Process</h3>
              <ol className="space-y-4">
                {STEPS.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <Reveal key={step.title} direction="up" delay={i * 0.08}>
                      <li className="flex gap-4 rounded-card border border-line bg-cream-100 p-5">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-navy text-white">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div>
                          <h4 className="font-display text-h4 text-navy mb-1">
                            {i + 1}. {step.title}
                          </h4>
                          <p className="font-sans text-body text-ink-muted leading-relaxed">{step.body}</p>
                        </div>
                      </li>
                    </Reveal>
                  );
                })}
              </ol>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}

import type { FaqItem } from "@/lib/seo";

/**
 * Draft FAQ copy derived from facts already established in the master build
 * plan (§14 approved content library) — MOQ wording, OEM workflow, fabric/GSM/
 * size ranges, customization list. No lead-time, pricing or certification
 * claims are invented here; flag for the client to review/edit before launch.
 *
 * Kept in a plain (non "use client") module so both the server-rendered
 * Products page (schema builder) and the client FaqSection component
 * (visible accordion) can import the same data without crossing the
 * client/server module boundary.
 */
export const PRODUCTS_FAQ: FaqItem[] = [
  {
    question: "What is your minimum order quantity (MOQ)?",
    answer:
      "MOQ depends on the product, fabric and customization involved. Please contact us with your product and quantity requirements to receive a suitable MOQ and quotation.",
  },
  {
    question: "Can you manufacture custom or private-label apparel?",
    answer:
      "Yes. We offer full OEM and private-label manufacturing, including custom fabric and GSM, Pantone colour matching, screen/digital/heat-transfer/sublimation printing, embroidery, woven and printed labels, hangtags, private packaging and barcode labelling.",
  },
  {
    question: "What products do you manufacture?",
    answer:
      "T-shirts, polo shirts, hoodies, sweatshirts, joggers, shorts, sportswear, workwear, and other custom knit and woven apparel.",
  },
  {
    question: "What fabrics and GSM ranges do you work with?",
    answer:
      "100% cotton, cotton-poly blends, CVC/PC, single jersey, piqué, interlock, French terry, fleece, rib, polyester performance and stretch/spandex fabrics, plus buyer-specified materials. GSM typically ranges from 140 for tees up to 400 for hoodies and sweatshirts, depending on the product.",
  },
  {
    question: "Do you provide samples before bulk production?",
    answer:
      "Yes. Sampling and buyer approval are a standard part of our process, confirmed after specs and costing are agreed and before bulk production begins.",
  },
  {
    question: "What sizes do you offer?",
    answer: "XS–5XL, subject to the pattern and size chart agreed for your order.",
  },
  {
    question: "How do I get a quotation or start an order?",
    answer:
      "Share your product category, quantity, fabric, GSM, colours, sizes, printing, embroidery, labels, packaging and delivery timeline through our inquiry form. Our team reviews every submission and responds with next steps.",
  },
  {
    question: "Do you export internationally?",
    answer:
      "Yes. We manufacture for brands, importers, wholesalers and private-label businesses worldwide from our facility in Faisalabad, Pakistan.",
  },
];

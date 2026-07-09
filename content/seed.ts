/**
 * MH Global Attire — Database Seed Script
 * Phase 1 · content/seed.ts
 *
 * Run: npx tsx content/seed.ts
 *
 * All upserts are idempotent — safe to run multiple times.
 * All ContentBlock values are sourced verbatim from datadoc.docx.
 */

// Load .env.local before any module that reads process.env.
// tsx does not auto-load Next.js env files, so we do it explicitly.
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { prisma } from "@/lib/db";
import * as bcrypt from "bcryptjs";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function upsertSiteSetting(key: string, value: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

async function upsertContentBlock(
  page: string,
  key: string,
  value: string,
  order = 0
) {
  await prisma.contentBlock.upsert({
    where: { page_key: { page, key } },
    update: { value, order },
    create: { page, key, value, order },
  });
}

// ─── 6A. SiteSettings ────────────────────────────────────────────────────────

async function seedSiteSettings() {
  console.log("Seeding SiteSettings…");

  const settings: [string, string][] = [
    ["phone", "+92 321 3995224"],
    ["whatsapp", "+92 321 3995224"],
    ["email.info", "info@mhglobalattire.com"],
    ["email.sales", "sales@mhglobalattire.com"],
    ["email.ahmad", "ahmad@mhglobalattire.com"],
    ["social.instagram", "https://www.instagram.com/mhglobalattire/"],
    [
      "social.linkedin",
      "https://www.linkedin.com/company/mh-global-attire/",
    ],
    ["social.facebook", "#"],
    [
      "address",
      "Hassan Dall Mills, New Mandi Road, Faisalabad, Punjab, Pakistan — 38000",
    ],
    ["founder", "Ahmad Hassan"],
    ["founded", "2022"],
  ];

  for (const [key, value] of settings) {
    await upsertSiteSetting(key, value);
  }

  console.log(`  ✓ ${settings.length} SiteSettings upserted`);
}

// ─── 6B. AdminUser ───────────────────────────────────────────────────────────

async function seedAdminUser() {
  console.log("Seeding AdminUser…");

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email) {
    throw new Error(
      "ADMIN_EMAIL environment variable is not set. Add it to .env.local."
    );
  }
  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD environment variable is not set. Add it to .env.local."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name: "Ahmad Hassan", role: "admin" },
    create: {
      email,
      passwordHash,
      name: "Ahmad Hassan",
      role: "admin",
    },
  });

  console.log(`  ✓ AdminUser upserted: ${email}`);
}

// ─── 6C. ContentBlocks ───────────────────────────────────────────────────────

async function seedContentBlocks() {
  console.log("Seeding ContentBlocks…");

  // ── Cleanup: remove mis-placed workflow steps from manufacturing page ─────
  // These were incorrectly seeded under manufacturing in Phase 1.
  // They belong to oem-services (see §9 of master plan). Delete them so the
  // DB stays clean; the same data is re-inserted under oem-services below.
  // This deleteMany is idempotent — a no-op when rows no longer exist.
  await prisma.contentBlock.deleteMany({
    where: {
      page: "manufacturing",
      key: {
        in: [
          "workflow.step.1",
          "workflow.step.2",
          "workflow.step.3",
          "workflow.step.4",
          "workflow.step.5",
          "workflow.step.6",
          "workflow.step.7",
          "workflow.step.8",
          "workflow.step.9",
          "workflow.step.10",
        ],
      },
    },
  });

  // ── Page: home ────────────────────────────────────────────────────────────
  await upsertContentBlock(
    "home",
    "hero.heading",
    "Custom Apparel Manufacturing for Global Brands",
    0
  );

  await upsertContentBlock(
    "home",
    "hero.subheading",
    "MH Global Attire manufactures customized apparel for brands, importers, wholesalers and private-label businesses, with support from product development and fabric selection to production, quality control, packing and shipment.",
    1
  );

  await upsertContentBlock("home", "hero.cta.primary", "Request a Quote", 2);

  await upsertContentBlock(
    "home",
    "hero.cta.secondary",
    "Explore Our Products",
    3
  );

  await upsertContentBlock(
    "home",
    "contact.message",
    "Tell us about your product category, quantity, fabric, GSM, colours, sizes, printing, embroidery, labels, packaging and required delivery timeline. Our team will review your inquiry and respond with the next steps.",
    4
  );

  // ── Page: about ───────────────────────────────────────────────────────────
  await upsertContentBlock(
    "about",
    "hero.heading",
    "Manufacturing Apparel with Quality, Flexibility and Professional Commitment",
    0
  );

  await upsertContentBlock(
    "about",
    "about.intro",
    "MH Global Attire Ltd. is an apparel manufacturing and export company based in Faisalabad, Pakistan. We manufacture customized garments for international buyers according to their fabric, sizing, design, labelling, printing, embroidery and packaging requirements.",
    1
  );

  await upsertContentBlock(
    "about",
    "about.history",
    "MH Global Attire Ltd. is a professional apparel manufacturing and export company based in Faisalabad, Pakistan, one of the country's most established textile and garment manufacturing centres.\n\nEstablished in 2022, the company was founded with the objective of providing international brands, importers, wholesalers and private-label businesses with reliable and flexible apparel manufacturing solutions.\n\nMH Global Attire manufactures customized garments according to buyer specifications, including fabric selection, sizing, GSM, colours, printing, embroidery, labels, packaging and other private-label requirements.\n\nOur manufacturing operations are supported by experienced production professionals, quality-control procedures and access to Faisalabad's strong textile supply chain. From product development and sampling to bulk production, finishing, packing and shipment coordination, we aim to provide buyers with a professionally managed and dependable service.",
    2
  );

  await upsertContentBlock(
    "about",
    "about.mission",
    "To manufacture high-quality customized apparel for international buyers through professional production management, transparent communication, reliable quality control and continuous improvement.",
    3
  );

  await upsertContentBlock(
    "about",
    "about.vision",
    "To develop MH Global Attire into a trusted international apparel manufacturing and export company recognized for quality, customization, reliability and long-term business partnerships.",
    4
  );

  await upsertContentBlock(
    "about",
    "values.quality",
    "We focus on fabric quality, accurate measurements, workmanship, finishing and product presentation.",
    5
  );

  await upsertContentBlock(
    "about",
    "values.reliability",
    "We aim to meet agreed product requirements, production schedules and buyer expectations.",
    6
  );

  await upsertContentBlock(
    "about",
    "values.transparency",
    "We communicate honestly regarding specifications, pricing, timelines and production status.",
    7
  );

  await upsertContentBlock(
    "about",
    "values.customization",
    "We support buyer-specific designs, materials, labels, colours, sizing and packaging requirements.",
    8
  );

  await upsertContentBlock(
    "about",
    "values.partnership",
    "We focus on developing long-term relationships with brands and buyers instead of only completing individual orders.",
    9
  );

  await upsertContentBlock(
    "about",
    "values.continuous-improvement",
    "We continue improving our manufacturing systems, team capabilities and quality standards as the company grows.",
    10
  );

  // ── Page: manufacturing ───────────────────────────────────────────────────
  // Hero heading and intro from datadoc.docx "MANUFACTURING CAPABILITIES HEADING"
  // and "MANUFACTURING INTRODUCTION" sections.
  await upsertContentBlock(
    "manufacturing",
    "hero.heading",
    "From Product Development to Final Packing",
    0
  );

  await upsertContentBlock(
    "manufacturing",
    "manufacturing.intro",
    "Our manufacturing process is managed through defined production stages, including requirement review, fabric preparation, sampling, cutting, stitching, customization, finishing, inspection and packing.",
    1
  );

  // 9 production stages — derived from the stage names in manufacturing.intro
  // above (datadoc.docx "MANUFACTURING INTRODUCTION"). Title Case labels only;
  // these are neutral identifiers, not marketing claims.
  const manufacturingStages: [string, string][] = [
    ["stage.1", "Knitting"],
    ["stage.2", "Dyeing"],
    ["stage.3", "Cutting"],
    ["stage.4", "Printing"],
    ["stage.5", "Embroidery"],
    ["stage.6", "Stitching"],
    ["stage.7", "Pressing"],
    ["stage.8", "Quality Check"],
    ["stage.9", "Inspection & Export"],
  ];

  for (let i = 0; i < manufacturingStages.length; i++) {
    const [key, value] = manufacturingStages[i];
    await upsertContentBlock("manufacturing", key, value, i + 2);
  }

  // ── Page: oem-services ────────────────────────────────────────────────────
  // Heading uses the document's own section title, not invented marketing copy.
  await upsertContentBlock(
    "oem-services",
    "hero.heading",
    "Private Label and OEM Services",
    0
  );

  // 10-step OEM/private-label workflow — verbatim from datadoc.docx
  // "PRIVATE LABEL AND OEM SERVICES → Typical workflow:" section.
  // Short labels (before " — ") added by Phase 1 for UI use; step text is
  // verbatim from the docx numbered list.
  const oemWorkflowSteps: [string, string][] = [
    [
      "workflow.step.1",
      "Inquiry — Buyer submits inquiry, design or tech pack",
    ],
    ["workflow.step.2", "Review — Product requirements are reviewed"],
    [
      "workflow.step.3",
      "Confirm Specs — Fabric, GSM, colours, sizing and customization are confirmed",
    ],
    [
      "workflow.step.4",
      "Costing — Costing and quotation are prepared",
    ],
    ["workflow.step.5", "Sample — Sample is developed"],
    ["workflow.step.6", "Approval — Buyer approves the sample"],
    ["workflow.step.7", "Bulk Production — Bulk production begins"],
    [
      "workflow.step.8",
      "In-Process QC — Quality checks are conducted during production",
    ],
    [
      "workflow.step.9",
      "Final Inspection — Final inspection is completed",
    ],
    [
      "workflow.step.10",
      "Pack & Ship — Products are packed and prepared for shipment",
    ],
  ];

  for (let i = 0; i < oemWorkflowSteps.length; i++) {
    const [key, value] = oemWorkflowSteps[i];
    await upsertContentBlock("oem-services", key, value, i + 1);
  }

  // 19 OEM services — verbatim from datadoc.docx
  // "PRIVATE LABEL AND OEM SERVICES → Services may include:" bullet list.
  const oemServices: [string, string][] = [
    ["service.1", "Product development"],
    ["service.2", "Fabric sourcing"],
    ["service.3", "Pattern development"],
    ["service.4", "Sample development"],
    ["service.5", "Custom sizing"],
    ["service.6", "Custom colours"],
    ["service.7", "Printing"],
    ["service.8", "Embroidery"],
    ["service.9", "Custom labels"],
    ["service.10", "Care labels"],
    ["service.11", "Size labels"],
    ["service.12", "Hangtags"],
    ["service.13", "Custom trims"],
    ["service.14", "Private packaging"],
    ["service.15", "Barcode labelling"],
    ["service.16", "Bulk production"],
    ["service.17", "Quality inspection"],
    ["service.18", "Export packing"],
    ["service.19", "Shipment coordination"],
  ];

  for (let i = 0; i < oemServices.length; i++) {
    const [key, value] = oemServices[i];
    await upsertContentBlock("oem-services", key, value, i + 11);
  }

  // MOQ note — verbatim from datadoc.docx "PRIVATE LABEL AND OEM SERVICES → MOQ:"
  await upsertContentBlock(
    "oem-services",
    "oem.moq",
    "Confirmed according to product category, fabric, colour, design and customization.",
    30
  );

  // ── Page: quality ─────────────────────────────────────────────────────────
  await upsertContentBlock(
    "quality",
    "hero.heading",
    "Quality Controlled at Every Important Stage",
    0
  );

  await upsertContentBlock(
    "quality",
    "quality.intro",
    "At MH Global Attire, quality control begins before production and continues throughout cutting, stitching, customization, finishing and packing. Our team monitors measurements, workmanship, colour, printing, embroidery and final presentation according to approved buyer specifications.",
    1
  );

  // 12 QC points — verbatim from datadoc.docx
  const qcPoints: [string, string][] = [
    ["qc.point.1", "Buyer specification review"],
    ["qc.point.2", "Fabric and trim inspection"],
    ["qc.point.3", "Colour and GSM verification"],
    ["qc.point.4", "Sample approval"],
    ["qc.point.5", "Pre-production meeting"],
    ["qc.point.6", "Cutting inspection"],
    ["qc.point.7", "Inline stitching inspection"],
    ["qc.point.8", "Measurement checks"],
    ["qc.point.9", "Printing and embroidery inspection"],
    ["qc.point.10", "Finishing inspection"],
    ["qc.point.11", "Final appearance inspection"],
    ["qc.point.12", "Packing and quantity verification"],
  ];

  for (let i = 0; i < qcPoints.length; i++) {
    const [key, value] = qcPoints[i];
    await upsertContentBlock("quality", key, value, i + 2);
  }

  // ── Page: sustainability ──────────────────────────────────────────────────
  // Heading uses the document's own section title "SUSTAINABILITY AND RESPONSIBLE
  // MANUFACTURING", not invented marketing copy.
  await upsertContentBlock(
    "sustainability",
    "hero.heading",
    "Sustainability and Responsible Manufacturing",
    0
  );

  // Body — verbatim from datadoc.docx "SUSTAINABILITY AND RESPONSIBLE MANUFACTURING
  // → Recommended wording:" section (order moved to 1).
  await upsertContentBlock(
    "sustainability",
    "sustainability.body",
    "MH Global Attire is committed to developing responsible manufacturing practices through efficient material usage, waste reduction, safe working conditions and continuous improvement.",
    1
  );

  // 8 potential sustainability initiatives — verbatim from datadoc.docx
  // "Potential initiatives to include only when operational:" bullet list.
  // These are forward-looking labels for practices in development, not claims
  // of certification or completed programmes (per docx constraint).
  const sustainabilityInitiatives: [string, string][] = [
    ["initiative.1", "Fabric waste separation"],
    ["initiative.2", "Responsible material utilization"],
    ["initiative.3", "Energy-saving practices"],
    ["initiative.4", "Safe and organized working conditions"],
    ["initiative.5", "Worker training"],
    ["initiative.6", "Quality and safety awareness"],
    ["initiative.7", "Responsible chemical handling"],
    ["initiative.8", "Recycled or certified materials upon buyer request"],
  ];

  for (let i = 0; i < sustainabilityInitiatives.length; i++) {
    const [key, value] = sustainabilityInitiatives[i];
    await upsertContentBlock("sustainability", key, value, i + 2);
  }

  // ── Page: why ─────────────────────────────────────────────────────────────
  // Heading — verbatim from datadoc.docx "WHY CHOOSE US HEADING" section.
  await upsertContentBlock(
    "why",
    "hero.heading",
    "A Manufacturing Partner Focused on Your Requirements",
    0
  );

  // 10 differentiators — verbatim from datadoc.docx "WHY CHOOSE MH GLOBAL ATTIRE"
  // bullet list. Orders start at 1 (hero.heading occupies order 0).
  const differentiators: [string, string][] = [
    [
      "differentiator.1",
      "Apparel manufacturing based in Faisalabad, Pakistan",
    ],
    ["differentiator.2", "Customized garment manufacturing"],
    ["differentiator.3", "Private-label and OEM services"],
    ["differentiator.4", "Flexible product-development support"],
    [
      "differentiator.5",
      "Access to a strong textile and apparel supply chain",
    ],
    [
      "differentiator.6",
      "Buyer-specific fabric, GSM, sizing and colour options",
    ],
    [
      "differentiator.7",
      "Printing, embroidery, labels and custom packaging",
    ],
    ["differentiator.8", "Quality monitoring throughout production"],
    ["differentiator.9", "Professional and responsive communication"],
    ["differentiator.10", "Long-term partnership approach"],
  ];

  for (let i = 0; i < differentiators.length; i++) {
    const [key, value] = differentiators[i];
    await upsertContentBlock("why", key, value, i + 1);
  }

  console.log("  ✓ ContentBlocks upserted");
}

// ─── 6D. Categories ──────────────────────────────────────────────────────────

async function seedCategories() {
  console.log("Seeding Categories…");

  const categories = [
    {
      order: 0,
      name: "T-Shirts",
      slug: "t-shirts",
      heroImage: "/images/categories/t-shirts.jpg",
      gsmRange: "140–240 GSM",
      description:
        "Custom T-shirts manufactured in 100% cotton and cotton-blend fabrics, available from XS to 5XL with full printing, embroidery and private-label options.",
    },
    {
      order: 1,
      name: "Polo Shirts",
      slug: "polo-shirts",
      heroImage: "/images/categories/polo-shirts.jpg",
      gsmRange: "180–260 GSM",
      description:
        "Professional polo shirts in piqué and interlock fabrics with Pantone colour matching, embroidery and custom label options.",
    },
    {
      order: 2,
      name: "Hoodies",
      slug: "hoodies",
      heroImage: "/images/categories/hoodies.jpg",
      gsmRange: "260–400 GSM",
      description:
        "Custom hoodies in French terry and fleece fabrics, available with screen printing, embroidery and private-label packaging.",
    },
    {
      order: 3,
      name: "Sweatshirts",
      slug: "sweatshirts",
      heroImage: "/images/categories/sweatshirts.jpg",
      gsmRange: "260–400 GSM",
      description:
        "Customized sweatshirts in fleece and French terry with full branding, colour and sizing options.",
    },
    {
      order: 4,
      name: "Joggers",
      slug: "joggers",
      heroImage: "/images/categories/joggers.jpg",
      gsmRange: "220–360 GSM",
      description:
        "Custom joggers and track pants in fleece and French terry fabrics with Pantone matching and private-label packaging.",
    },
    {
      order: 5,
      name: "Shorts",
      slug: "shorts",
      heroImage: "/images/categories/shorts.jpg",
      gsmRange: "220–360 GSM",
      description:
        "Custom shorts in French terry, fleece and performance fabrics, suitable for casual and activewear ranges.",
    },
    {
      order: 6,
      name: "Sportswear",
      slug: "sportswear",
      heroImage: "/images/categories/sportswear.jpg",
      gsmRange: "140–250 GSM",
      description:
        "Performance sportswear in polyester and stretch fabrics with sublimation printing and custom branding options.",
    },
    {
      order: 7,
      name: "Workwear",
      slug: "workwear",
      heroImage: "/images/categories/workwear.jpg",
      gsmRange: "per specification",
      description:
        "Professional workwear manufactured to buyer specification in twill, poly-cotton and other durable fabrics.",
    },
    {
      order: 8,
      name: "Custom Apparel",
      slug: "custom-apparel",
      heroImage: "/images/categories/custom-apparel.jpg",
      gsmRange: null,
      description:
        "Fully customized garments developed from buyer tech packs, patterns or design briefs across fabric types and product categories.",
    },
    {
      order: 9,
      name: "Other Knit & Woven",
      slug: "other-knit-woven",
      heroImage: "/images/categories/other-knit-woven.jpg",
      gsmRange: null,
      description:
        "Additional knit and selected woven garment categories manufactured to buyer specifications.",
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        gsmRange: cat.gsmRange,
        heroImage: cat.heroImage,
        order: cat.order,
        published: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        gsmRange: cat.gsmRange,
        heroImage: cat.heroImage,
        order: cat.order,
        published: true,
      },
    });
  }

  console.log(`  ✓ ${categories.length} Categories upserted`);
}

// ─── 6E. Products ────────────────────────────────────────────────────────────

async function seedProducts() {
  console.log("Seeding Products…");

  // Fetch all categories to resolve slugs → ids
  const categoryRows = await prisma.category.findMany({
    select: { id: true, slug: true },
  });
  const catId = (slug: string): string => {
    const row = categoryRows.find((c) => c.slug === slug);
    if (!row) throw new Error(`Category slug not found: ${slug}`);
    return row.id;
  };

  const MOQ_NOTE =
    "Please contact us with your product and quantity requirements to receive a suitable MOQ and quotation.";

  const products = [
    // T-Shirts
    {
      slug: "classic-cotton-tshirt",
      name: "Classic Cotton T-Shirt",
      categorySlug: "t-shirts",
      // Temporary placeholder — replace with real product photography in Phase 3.
      images: ["/images/categories/t-shirts.jpg"],
      description: `Our classic cotton T-shirt is manufactured in 100% ring-spun cotton single jersey, available from 140 to 240 GSM. Suitable for retail brands, promotional ranges and private-label lines. ${MOQ_NOTE}`,
      fabricOptions: ["100% cotton", "cotton-poly blends", "CVC/PC", "single jersey"],
      gsmRange: "140–240 GSM",
      sizes: "XS–5XL",
      customization: [
        "custom fabric/GSM",
        "Pantone matching",
        "screen/digital/heat-transfer/sublimation printing",
        "embroidery",
        "woven & printed labels",
      ],
      order: 0,
    },
    // Polo Shirts
    {
      slug: "premium-pique-polo",
      name: "Premium Piqué Polo Shirt",
      categorySlug: "polo-shirts",
      // Temporary placeholder — replace with real product photography in Phase 3.
      images: ["/images/categories/polo-shirts.jpg"],
      description: `Premium piqué polo shirt available in cotton and cotton-polyester blends from 180 to 260 GSM. Manufactured with Pantone colour matching, embroidery and custom label options. ${MOQ_NOTE}`,
      fabricOptions: ["piqué", "interlock", "100% cotton", "cotton-poly blends"],
      gsmRange: "180–260 GSM",
      sizes: "XS–5XL",
      customization: [
        "custom fabric/GSM",
        "Pantone matching",
        "embroidery",
        "woven & printed labels",
        "private packaging",
      ],
      order: 0,
    },
    // Hoodies
    {
      slug: "custom-pullover-hoodie",
      name: "Custom Pullover Hoodie",
      categorySlug: "hoodies",
      // Temporary placeholder — replace with real product photography in Phase 3.
      images: ["/images/categories/hoodies.jpg"],
      description: `Custom pullover hoodie manufactured in French terry and fleece fabrics from 260 to 400 GSM. Available with full branding, screen printing and private-label packaging. ${MOQ_NOTE}`,
      fabricOptions: ["French terry", "fleece", "cotton-poly blends", "CVC/PC"],
      gsmRange: "260–400 GSM",
      sizes: "XS–5XL",
      customization: [
        "custom fabric/GSM",
        "Pantone matching",
        "screen/digital/heat-transfer/sublimation printing",
        "embroidery",
        "private packaging",
      ],
      order: 0,
    },
    // Sweatshirts
    {
      slug: "custom-crewneck-sweatshirt",
      name: "Custom Crewneck Sweatshirt",
      categorySlug: "sweatshirts",
      // Temporary placeholder — replace with real product photography in Phase 3.
      images: ["/images/categories/sweatshirts.jpg"],
      description: `Custom crewneck sweatshirt in fleece and French terry fabrics from 260 to 400 GSM, with full colour, branding and sizing options. ${MOQ_NOTE}`,
      fabricOptions: ["fleece", "French terry", "cotton-poly blends", "CVC/PC"],
      gsmRange: "260–400 GSM",
      sizes: "XS–5XL",
      customization: [
        "custom fabric/GSM",
        "Pantone matching",
        "screen/digital/heat-transfer/sublimation printing",
        "embroidery",
        "woven & printed labels",
      ],
      order: 0,
    },
    // Joggers
    {
      slug: "custom-jogger-pants",
      name: "Custom Jogger Pants",
      categorySlug: "joggers",
      // Temporary placeholder — replace with real product photography in Phase 3.
      images: ["/images/categories/joggers.jpg"],
      description: `Custom jogger pants in French terry and fleece fabrics from 220 to 360 GSM. Available with Pantone colour matching, printed labels and private-label packaging. ${MOQ_NOTE}`,
      fabricOptions: ["French terry", "fleece", "cotton-poly blends", "rib"],
      gsmRange: "220–360 GSM",
      sizes: "XS–5XL",
      customization: [
        "custom fabric/GSM",
        "Pantone matching",
        "screen/digital/heat-transfer/sublimation printing",
        "woven & printed labels",
        "private packaging",
      ],
      order: 0,
    },
    // Shorts
    {
      slug: "custom-french-terry-shorts",
      name: "Custom French Terry Shorts",
      categorySlug: "shorts",
      // Temporary placeholder — replace with real product photography in Phase 3.
      images: ["/images/categories/shorts.jpg"],
      description: `Custom shorts manufactured in French terry and fleece fabrics from 220 to 360 GSM, suitable for casual and activewear product ranges. ${MOQ_NOTE}`,
      fabricOptions: ["French terry", "fleece", "polyester performance", "cotton-poly blends"],
      gsmRange: "220–360 GSM",
      sizes: "XS–5XL",
      customization: [
        "custom fabric/GSM",
        "Pantone matching",
        "screen/digital/heat-transfer/sublimation printing",
        "embroidery",
        "woven & printed labels",
      ],
      order: 0,
    },
    // Sportswear
    {
      slug: "custom-performance-sportswear",
      name: "Custom Performance Sportswear",
      categorySlug: "sportswear",
      // Temporary placeholder — replace with real product photography in Phase 3.
      images: ["/images/categories/sportswear.jpg"],
      description: `Custom performance sportswear manufactured in polyester and stretch fabrics from 140 to 250 GSM. Available with sublimation printing, Pantone matching and private-label options. ${MOQ_NOTE}`,
      fabricOptions: ["polyester performance", "stretch/spandex", "100% cotton", "CVC/PC"],
      gsmRange: "140–250 GSM",
      sizes: "XS–5XL",
      customization: [
        "custom fabric/GSM",
        "Pantone matching",
        "screen/digital/heat-transfer/sublimation printing",
        "woven & printed labels",
        "private packaging",
      ],
      order: 0,
    },
    // Workwear
    {
      slug: "custom-workwear-uniform",
      name: "Custom Workwear Uniform",
      categorySlug: "workwear",
      // Temporary placeholder — replace with real product photography in Phase 3.
      images: ["/images/categories/workwear.jpg"],
      description: `Professional workwear uniforms manufactured in twill and poly-cotton fabrics to buyer specification. Includes embroidery, printed labels and custom branding options. ${MOQ_NOTE}`,
      fabricOptions: ["twill", "buyer-specified", "cotton-poly blends", "polyester performance"],
      gsmRange: "per specification",
      sizes: "XS–5XL",
      customization: [
        "custom fabric/GSM",
        "Pantone matching",
        "embroidery",
        "woven & printed labels",
        "private packaging",
      ],
      order: 0,
    },
    // Custom Apparel
    {
      slug: "custom-private-label-apparel",
      name: "Custom Private Label Apparel",
      categorySlug: "custom-apparel",
      // Temporary placeholder — replace with real product photography in Phase 3.
      images: ["/images/categories/custom-apparel.jpg"],
      description: `Fully customized garments developed from buyer tech packs, design briefs or approved samples. Covers all fabric types, GSM ranges, sizes, printing, embroidery and packaging requirements. ${MOQ_NOTE}`,
      fabricOptions: ["buyer-specified", "100% cotton", "polyester performance", "stretch/spandex"],
      gsmRange: null,
      sizes: "XS–5XL",
      customization: [
        "custom fabric/GSM",
        "Pantone matching",
        "screen/digital/heat-transfer/sublimation printing",
        "embroidery",
        "custom patterns",
      ],
      order: 0,
    },
    // Other Knit & Woven
    {
      slug: "custom-knit-woven-garments",
      name: "Custom Knit & Woven Garments",
      categorySlug: "other-knit-woven",
      // Temporary placeholder — replace with real product photography in Phase 3.
      images: ["/images/categories/other-knit-woven.jpg"],
      description: `Additional knit and selected woven garment categories manufactured to buyer specifications. Contact us with your product and quantity requirements. ${MOQ_NOTE}`,
      fabricOptions: ["buyer-specified", "single jersey", "twill", "interlock"],
      gsmRange: null,
      sizes: "XS–5XL",
      customization: [
        "custom fabric/GSM",
        "Pantone matching",
        "embroidery",
        "woven & printed labels",
        "private packaging",
      ],
      order: 0,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        categoryId: catId(p.categorySlug),
        description: p.description,
        fabricOptions: p.fabricOptions,
        gsmRange: p.gsmRange,
        sizes: p.sizes,
        customization: p.customization,
        images: p.images,
        order: p.order,
        published: true,
      },
      create: {
        name: p.name,
        slug: p.slug,
        categoryId: catId(p.categorySlug),
        description: p.description,
        fabricOptions: p.fabricOptions,
        gsmRange: p.gsmRange,
        sizes: p.sizes,
        customization: p.customization,
        images: p.images,
        order: p.order,
        published: true,
      },
    });
  }

  console.log(`  ✓ ${products.length} Products upserted`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Starting seed…\n");

  await seedSiteSettings();
  await seedAdminUser();
  await seedContentBlocks();
  await seedCategories();
  await seedProducts();

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

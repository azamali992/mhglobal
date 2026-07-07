import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { buildFaqSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo-metadata";
import PageHero from "@/components/sections/PageHero";
import ProductsGrid from "@/components/sections/ProductsGrid";
import FaqSection from "@/components/sections/FaqSection";
import { PRODUCTS_FAQ } from "@/lib/faq-data";
import CtaBand from "@/components/sections/CtaBand";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Our Products",
    description:
      "Browse our full range of custom apparel manufacturing categories including T-shirts, hoodies, polo shirts, sportswear and more.",
    path: "/products",
  });
}

export default async function ProductsPage() {
  const [categories, homeBlocks, whatsapp] = await Promise.all([
    prisma.category.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    }),
    prisma.contentBlock.findMany({
      where: { page: "home", key: { in: ["hero.heading", "hero.cta.primary"] } },
    }),
    prisma.siteSetting.findUniqueOrThrow({ where: { key: "whatsapp" } }),
  ]);

  const home = Object.fromEntries(homeBlocks.map((b) => [b.key, b.value]));

  return (
    <>
      <PageHero
        eyebrow="Product Range"
        title="Custom Apparel Across Every Category"
        lead="From knit basics to structured workwear, each category is manufactured to your fabric, GSM, colour, sizing, printing, embroidery and private-label requirements."
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
        ]}
        image="/images/categories/t-shirts.jpg"
        meta={[
          { value: `${categories.length}`, label: "Product Categories" },
          { value: "XS–5XL", label: "Size Range" },
          { value: "Custom", label: "Fabric & GSM" },
          { value: "OEM", label: "Private Label" },
        ]}
      />

      <ProductsGrid
        categories={categories.map((c) => ({
          name: c.name,
          slug: c.slug,
          gsmRange: c.gsmRange,
          description: c.description,
          heroImage: c.heroImage,
        }))}
      />

      <FaqSection items={PRODUCTS_FAQ} />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(PRODUCTS_FAQ)) }}
      />

      <CtaBand
        heading={home["hero.heading"]}
        ctaPrimary={home["hero.cta.primary"]}
        whatsapp={whatsapp.value}
        sectionId="products-cta-heading"
      />
    </>
  );
}

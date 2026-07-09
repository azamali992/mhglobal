import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildProductSchema, buildBreadcrumbSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo-metadata";
import CategoryHero from "@/components/sections/CategoryHero";
import CategorySpecs from "@/components/sections/CategorySpecs";
import CategoryProducts from "@/components/sections/CategoryProducts";
import CategoryMoqCta from "@/components/sections/CategoryMoqCta";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });
  if (!category) return { title: "Category Not Found" };
  return buildMetadata({
    title: `${category.name} — Apparel Manufacturing`,
    description:
      category.description ??
      `Custom ${category.name.toLowerCase()} manufacturing from MH Global Attire — fabric, GSM, sizing and private-label customization to your specification.`,
    path: `/products/${params.slug}`,
  });
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const [category, whatsappSetting, ctaBlock] = await Promise.all([
    prisma.category.findUnique({
      where: { slug: params.slug },
      include: {
        products: {
          where: { published: true },
          orderBy: { order: "asc" },
        },
      },
    }),
    prisma.siteSetting.findUniqueOrThrow({ where: { key: "whatsapp" } }),
    prisma.contentBlock.findUniqueOrThrow({
      where: { page_key: { page: "home", key: "hero.cta.primary" } },
    }),
  ]);

  if (!category || !category.published) {
    notFound();
  }

  const MOQ_NOTE =
    "Please contact us with your product and quantity requirements to receive a suitable MOQ and quotation.";

  // Use the first product for specs display
  const primaryProduct = category.products[0];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: category.name, href: `/products/${category.slug}` },
  ]);

  const productSchemas = category.products.map((p) =>
    buildProductSchema({
      name: p.name,
      slug: p.slug,
      categorySlug: category.slug,
      categoryName: category.name,
      description: p.description,
      fabricOptions: p.fabricOptions,
      gsmRange: p.gsmRange,
      image: p.images[0] ?? category.heroImage ?? null,
    })
  );

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {productSchemas.map((schema, i) => (
        <script
          key={category.products[i].id}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <CategoryHero
        name={category.name}
        description={category.description}
        gsmRange={category.gsmRange}
        heroImage={category.heroImage}
      />

      <CategoryProducts
        categorySlug={category.slug}
        products={category.products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          fabricOptions: p.fabricOptions,
          gsmRange: p.gsmRange,
          slug: p.slug,
          image: p.images[0] ?? category.heroImage ?? null,
        }))}
      />

      {primaryProduct && (
        <CategorySpecs
          product={{
            name: primaryProduct.name,
            fabricOptions: primaryProduct.fabricOptions,
            gsmRange: primaryProduct.gsmRange,
            sizes: primaryProduct.sizes,
            customization: primaryProduct.customization,
          }}
        />
      )}

      <CategoryMoqCta
        moqNote={MOQ_NOTE}
        ctaPrimary={ctaBlock.value}
        whatsapp={whatsappSetting.value}
      />
    </>
  );
}

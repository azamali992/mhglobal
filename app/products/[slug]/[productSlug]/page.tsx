import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildProductSchema, buildBreadcrumbSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo-metadata";
import ProductHero from "@/components/sections/ProductHero";
import CategorySpecs from "@/components/sections/CategorySpecs";
import CategoryProducts from "@/components/sections/CategoryProducts";
import CategoryMoqCta from "@/components/sections/CategoryMoqCta";

interface PageProps {
  params: { slug: string; productSlug: string };
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { published: true, category: { published: true } },
    select: { slug: true, category: { select: { slug: true } } },
  });
  return products.map((p) => ({ slug: p.category.slug, productSlug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.productSlug },
    include: { category: true },
  });
  if (!product || product.category.slug !== params.slug) {
    return { title: "Product Not Found" };
  }
  return buildMetadata({
    title: `${product.name} | Custom ${product.category.name} Manufacturer`,
    description:
      product.description ??
      `Custom ${product.name.toLowerCase()} manufacturing from MH Global Attire — a private-label and OEM apparel manufacturer in Faisalabad, Pakistan. Fabric, GSM, sizing and branding to your specification.`,
    path: `/products/${params.slug}/${params.productSlug}`,
  });
}

export default async function ProductDetailPage({ params }: PageProps) {
  const [product, whatsappSetting, ctaBlock] = await Promise.all([
    prisma.product.findUnique({
      where: { slug: params.productSlug },
      include: { category: true },
    }),
    prisma.siteSetting.findUniqueOrThrow({ where: { key: "whatsapp" } }),
    prisma.contentBlock.findUniqueOrThrow({
      where: { page_key: { page: "home", key: "hero.cta.primary" } },
    }),
  ]);

  if (!product || !product.published || product.category.slug !== params.slug || !product.category.published) {
    notFound();
  }

  const category = product.category;

  // Other published products in the same category, for a "related products"
  // cross-link block — real internal linking, not just breadcrumbs.
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      published: true,
      slug: { not: product.slug },
    },
    orderBy: { order: "asc" },
    take: 3,
  });

  const MOQ_NOTE =
    "Please contact us with your product and quantity requirements to receive a suitable MOQ and quotation.";

  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: category.name, href: `/products/${category.slug}` },
    { label: product.name, href: `/products/${category.slug}/${product.slug}` },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumb);
  const productSchema = buildProductSchema({
    name: product.name,
    slug: product.slug,
    categorySlug: category.slug,
    categoryName: category.name,
    description: product.description,
    fabricOptions: product.fabricOptions,
    gsmRange: product.gsmRange,
    image: product.images[0] ?? category.heroImage ?? null,
  });

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <ProductHero
        name={product.name}
        description={product.description}
        gsmRange={product.gsmRange}
        image={product.images[0] ?? category.heroImage ?? null}
        breadcrumb={breadcrumb}
      />

      <CategorySpecs
        product={{
          name: product.name,
          fabricOptions: product.fabricOptions,
          gsmRange: product.gsmRange,
          sizes: product.sizes,
          customization: product.customization,
        }}
      />

      {relatedProducts.length > 0 && (
        <CategoryProducts
          categorySlug={category.slug}
          eyebrow="You May Also Need"
          heading={`More ${category.name} From MH Global Attire`}
          products={relatedProducts.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            fabricOptions: p.fabricOptions,
            gsmRange: p.gsmRange,
            slug: p.slug,
            image: p.images[0] ?? category.heroImage ?? null,
          }))}
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

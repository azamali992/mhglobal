"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import PageTransition from "@/components/motion/PageTransition";

export interface NavCategory {
  name: string;
  slug: string;
  heroImage: string | null;
  gsmRange: string | null;
}

/**
 * Wraps public-site chrome (Header/Footer/WhatsAppButton) around page
 * content — except on /admin/** routes, which render their own chrome
 * via AdminShell and must not also get the marketing Header/Footer.
 */
export default function SiteChrome({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: NavCategory[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin routes provide their own <main> landmark via AdminShell —
    // render children directly to avoid nesting two <main> elements.
    return <>{children}</>;
  }

  return (
    <>
      <Header categories={categories} />
      <PageTransition>
        <main id="main-content">{children}</main>
      </PageTransition>
      <Footer categories={categories} />
      <WhatsAppButton />
    </>
  );
}

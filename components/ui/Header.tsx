"use client";

import { NotchNavbar } from "@/components/ui/notch-navbar";
import type { NavCategory } from "@/components/layout/SiteChrome";

export default function Header({ categories }: { categories: NavCategory[] }) {
  return <NotchNavbar categories={categories} />;
}

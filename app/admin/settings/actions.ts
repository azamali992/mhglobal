"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const UpdateSiteSettingsSchema = z.record(z.string(), z.string());

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await auth();
  if (!session?.user) return { authorized: false as const };
  return { authorized: true as const };
}

// ─── Public routes to revalidate after settings changes ───────────────────────

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/products",
  "/services",
  "/oem-services",
  "/quality-assurance",
  "/sustainability",
  "/why-choose-us",
  "/contact",
  "/request-a-quote",
  "/privacy-policy",
  "/terms",
];

// ─── Action ───────────────────────────────────────────────────────────────────

export async function updateSiteSettingsAction(
  settings: Record<string, string>
): Promise<{ success: true } | { success: false; error: string }> {
  const { authorized } = await requireAuth();
  if (!authorized) return { success: false, error: "Unauthorized" };

  const parsed = UpdateSiteSettingsSchema.safeParse(settings);
  if (!parsed.success) {
    return { success: false, error: "Invalid settings data" };
  }

  try {
    await prisma.$transaction(
      Object.entries(parsed.data).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    // Revalidate all public routes — SiteSettings appear in Header, Footer, WhatsAppButton
    PUBLIC_PATHS.forEach((path) => revalidatePath(path));
    revalidatePath("/admin/settings");

    return { success: true };
  } catch (err) {
    console.error("updateSiteSettingsAction:", err);
    return { success: false, error: "Database error — please try again." };
  }
}

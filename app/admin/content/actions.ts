"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const UpdateContentBlockSchema = z.object({
  id: z.string().min(1, "ID is required"),
  updates: z.object({
    value: z.string(),
    imageUrl: z.string().nullable(),
  }),
});

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await auth();
  if (!session?.user) return { authorized: false as const };
  return { authorized: true as const };
}

// ─── Public routes to revalidate after content changes ────────────────────────

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

export async function updateContentBlockAction(
  id: string,
  updates: { value: string; imageUrl: string | null }
): Promise<{ success: true } | { success: false; error: string }> {
  const { authorized } = await requireAuth();
  if (!authorized) return { success: false, error: "Unauthorized" };

  const parsed = UpdateContentBlockSchema.safeParse({ id, updates });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  try {
    await prisma.contentBlock.update({
      where: { id: parsed.data.id },
      data: {
        value: parsed.data.updates.value,
        imageUrl: parsed.data.updates.imageUrl,
      },
    });

    // Revalidate all public routes so content changes reflect immediately
    PUBLIC_PATHS.forEach((path) => revalidatePath(path));
    revalidatePath("/admin/content");

    return { success: true };
  } catch (err) {
    console.error("updateContentBlockAction:", err);
    return { success: false, error: "Database error — please try again." };
  }
}

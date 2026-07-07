"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// ─── Zod Schema ────────────────────────────────────────────────────────────────
// Empty strings are treated as "clear the override, fall back to the
// code-defined default" — coerced to null before hitting the database.

const UpdatePageSeoSchema = z.object({
  path: z.string().min(1),
  title: z
    .string()
    .max(70, "Keep titles under 70 characters so they don't get truncated in search results.")
    .nullable(),
  description: z
    .string()
    .max(300, "Keep descriptions under 300 characters so they don't get truncated in search results.")
    .nullable(),
});

async function requireAuth() {
  const session = await auth();
  if (!session?.user) return { authorized: false as const };
  return { authorized: true as const };
}

export async function updatePageSeoAction(
  path: string,
  updates: { title: string | null; description: string | null }
): Promise<{ success: true } | { success: false; error: string }> {
  const { authorized } = await requireAuth();
  if (!authorized) return { success: false, error: "Unauthorized" };

  const parsed = UpdatePageSeoSchema.safeParse({
    path,
    title: updates.title?.trim() || null,
    description: updates.description?.trim() || null,
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  try {
    await prisma.pageSeo.upsert({
      where: { path: parsed.data.path },
      create: {
        path: parsed.data.path,
        title: parsed.data.title,
        description: parsed.data.description,
      },
      update: {
        title: parsed.data.title,
        description: parsed.data.description,
      },
    });

    // Revalidate the live page (metadata is regenerated on next request) and
    // the admin SEO list itself.
    revalidatePath(parsed.data.path);
    revalidatePath("/admin/seo");

    return { success: true };
  } catch (err) {
    console.error("updatePageSeoAction:", err);
    return { success: false, error: "Database error — please try again." };
  }
}

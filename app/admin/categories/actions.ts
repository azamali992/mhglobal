"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const CreateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().nullable(),
  gsmRange: z.string().optional().nullable(),
  heroImage: z.string().optional().nullable(),
  published: z.boolean(),
  order: z.number().int().min(0),
});

const UpdateCategorySchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().nullable(),
  gsmRange: z.string().optional().nullable(),
  heroImage: z.string().optional().nullable(),
  published: z.boolean(),
});

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await auth();
  if (!session?.user) return { authorized: false as const };
  return { authorized: true as const };
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function createCategoryAction(data: {
  name: string;
  slug: string;
  description?: string | null;
  gsmRange?: string | null;
  heroImage?: string | null;
  published: boolean;
  order: number;
}): Promise<{ success: true; data: { id: string } } | { success: false; error: string }> {
  const { authorized } = await requireAuth();
  if (!authorized) return { success: false, error: "Unauthorized" };

  const parsed = CreateCategorySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  try {
    const category = await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description ?? null,
        gsmRange: parsed.data.gsmRange ?? null,
        heroImage: parsed.data.heroImage ?? null,
        published: parsed.data.published,
        order: parsed.data.order,
      },
    });
    revalidatePath("/admin/categories");
    revalidatePath("/products");
    return { success: true, data: { id: category.id } };
  } catch (err) {
    console.error("createCategoryAction:", err);
    return { success: false, error: "Database error — please try again." };
  }
}

export async function updateCategoryAction(data: {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  gsmRange?: string | null;
  heroImage?: string | null;
  published: boolean;
}): Promise<{ success: true } | { success: false; error: string }> {
  const { authorized } = await requireAuth();
  if (!authorized) return { success: false, error: "Unauthorized" };

  const parsed = UpdateCategorySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  try {
    await prisma.category.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description ?? null,
        gsmRange: parsed.data.gsmRange ?? null,
        heroImage: parsed.data.heroImage ?? null,
        published: parsed.data.published,
      },
    });
    revalidatePath("/admin/categories");
    revalidatePath("/products");
    return { success: true };
  } catch (err) {
    console.error("updateCategoryAction:", err);
    return { success: false, error: "Database error — please try again." };
  }
}

export async function deleteCategoryAction(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  const { authorized } = await requireAuth();
  if (!authorized) return { success: false, error: "Unauthorized" };

  const parsed = z.string().min(1).safeParse(id);
  if (!parsed.success) return { success: false, error: "Invalid ID" };

  try {
    await prisma.category.delete({ where: { id: parsed.data } });
    revalidatePath("/admin/categories");
    revalidatePath("/products");
    return { success: true };
  } catch (err) {
    console.error("deleteCategoryAction:", err);
    return { success: false, error: "Database error — please try again." };
  }
}

export async function toggleCategoryPublishAction(
  id: string,
  published: boolean
): Promise<{ success: true } | { success: false; error: string }> {
  const { authorized } = await requireAuth();
  if (!authorized) return { success: false, error: "Unauthorized" };

  const parsed = z.object({ id: z.string().min(1), published: z.boolean() }).safeParse({ id, published });
  if (!parsed.success) return { success: false, error: "Invalid input" };

  try {
    await prisma.category.update({
      where: { id: parsed.data.id },
      data: { published: parsed.data.published },
    });
    revalidatePath("/admin/categories");
    revalidatePath("/products");
    return { success: true };
  } catch (err) {
    console.error("toggleCategoryPublishAction:", err);
    return { success: false, error: "Database error — please try again." };
  }
}

export async function reorderCategoriesAction(
  orderedIds: string[]
): Promise<{ success: true } | { success: false; error: string }> {
  const { authorized } = await requireAuth();
  if (!authorized) return { success: false, error: "Unauthorized" };

  const parsed = z.array(z.string().min(1)).min(1).safeParse(orderedIds);
  if (!parsed.success) return { success: false, error: "Invalid ID list" };

  try {
    await prisma.$transaction(
      parsed.data.map((id, index) =>
        prisma.category.update({
          where: { id },
          data: { order: index },
        })
      )
    );
    revalidatePath("/admin/categories");
    revalidatePath("/products");
    return { success: true };
  } catch (err) {
    console.error("reorderCategoriesAction:", err);
    return { success: false, error: "Database error — please try again." };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional().nullable(),
  fabricOptions: z.array(z.string()),
  gsmRange: z.string().optional().nullable(),
  sizes: z.string().optional().nullable(),
  customization: z.array(z.string()),
  images: z.array(z.string()),
  published: z.boolean(),
  order: z.number().int().min(0),
});

const UpdateProductSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().optional().nullable(),
  fabricOptions: z.array(z.string()),
  gsmRange: z.string().optional().nullable(),
  sizes: z.string().optional().nullable(),
  customization: z.array(z.string()),
  images: z.array(z.string()),
  published: z.boolean(),
});

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await auth();
  if (!session?.user) return { authorized: false as const };
  return { authorized: true as const };
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function createProductAction(data: {
  name: string;
  slug: string;
  categoryId: string;
  description?: string | null;
  fabricOptions: string[];
  gsmRange?: string | null;
  sizes?: string | null;
  customization: string[];
  images: string[];
  published: boolean;
  order: number;
}): Promise<{ success: true; data: { id: string } } | { success: false; error: string }> {
  const { authorized } = await requireAuth();
  if (!authorized) return { success: false, error: "Unauthorized" };

  const parsed = CreateProductSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        categoryId: parsed.data.categoryId,
        description: parsed.data.description ?? null,
        fabricOptions: parsed.data.fabricOptions,
        gsmRange: parsed.data.gsmRange ?? null,
        sizes: parsed.data.sizes ?? null,
        customization: parsed.data.customization,
        images: parsed.data.images,
        published: parsed.data.published,
        order: parsed.data.order,
      },
    });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true, data: { id: product.id } };
  } catch (err) {
    console.error("createProductAction:", err);
    return { success: false, error: "Database error — please try again." };
  }
}

export async function updateProductAction(data: {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description?: string | null;
  fabricOptions: string[];
  gsmRange?: string | null;
  sizes?: string | null;
  customization: string[];
  images: string[];
  published: boolean;
}): Promise<{ success: true } | { success: false; error: string }> {
  const { authorized } = await requireAuth();
  if (!authorized) return { success: false, error: "Unauthorized" };

  const parsed = UpdateProductSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  try {
    await prisma.product.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        categoryId: parsed.data.categoryId,
        description: parsed.data.description ?? null,
        fabricOptions: parsed.data.fabricOptions,
        gsmRange: parsed.data.gsmRange ?? null,
        sizes: parsed.data.sizes ?? null,
        customization: parsed.data.customization,
        images: parsed.data.images,
        published: parsed.data.published,
      },
    });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (err) {
    console.error("updateProductAction:", err);
    return { success: false, error: "Database error — please try again." };
  }
}

export async function deleteProductAction(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  const { authorized } = await requireAuth();
  if (!authorized) return { success: false, error: "Unauthorized" };

  const parsed = z.string().min(1).safeParse(id);
  if (!parsed.success) return { success: false, error: "Invalid ID" };

  try {
    await prisma.product.delete({ where: { id: parsed.data } });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (err) {
    console.error("deleteProductAction:", err);
    return { success: false, error: "Database error — please try again." };
  }
}

export async function toggleProductPublishAction(
  id: string,
  published: boolean
): Promise<{ success: true } | { success: false; error: string }> {
  const { authorized } = await requireAuth();
  if (!authorized) return { success: false, error: "Unauthorized" };

  const parsed = z.object({ id: z.string().min(1), published: z.boolean() }).safeParse({ id, published });
  if (!parsed.success) return { success: false, error: "Invalid input" };

  try {
    await prisma.product.update({
      where: { id: parsed.data.id },
      data: { published: parsed.data.published },
    });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (err) {
    console.error("toggleProductPublishAction:", err);
    return { success: false, error: "Database error — please try again." };
  }
}

export async function reorderProductsAction(
  orderedIds: string[]
): Promise<{ success: true } | { success: false; error: string }> {
  const { authorized } = await requireAuth();
  if (!authorized) return { success: false, error: "Unauthorized" };

  const parsed = z.array(z.string().min(1)).min(1).safeParse(orderedIds);
  if (!parsed.success) return { success: false, error: "Invalid ID list" };

  try {
    await prisma.$transaction(
      parsed.data.map((id, index) =>
        prisma.product.update({
          where: { id },
          data: { order: index },
        })
      )
    );
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (err) {
    console.error("reorderProductsAction:", err);
    return { success: false, error: "Database error — please try again." };
  }
}

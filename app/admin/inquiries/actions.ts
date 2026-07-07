"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const InquiryStatusSchema = z.enum(["NEW", "REVIEWED", "QUOTED", "CLOSED"]);

const UpdateStatusSchema = z.object({
  id: z.string().min(1, "ID is required"),
  status: InquiryStatusSchema,
});

// ─── Auth helper ──────────────────────────────────────────────────────────────

async function requireAuth() {
  const session = await auth();
  if (!session?.user) return { authorized: false as const };
  return { authorized: true as const };
}

// ─── Action ───────────────────────────────────────────────────────────────────

export async function updateInquiryStatusAction(
  id: string,
  status: "NEW" | "REVIEWED" | "QUOTED" | "CLOSED"
): Promise<{ success: true } | { success: false; error: string }> {
  const { authorized } = await requireAuth();
  if (!authorized) return { success: false, error: "Unauthorized" };

  const parsed = UpdateStatusSchema.safeParse({ id, status });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  try {
    // Note: Inquiry has no updatedAt field per schema — do not reference it.
    await prisma.inquiry.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    });
    return { success: true };
  } catch (err) {
    console.error("updateInquiryStatusAction:", err);
    return { success: false, error: "Database error — please try again." };
  }
}

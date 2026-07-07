/**
 * lib/schemas/inquiry.ts — Zod validation schema for inquiry submissions.
 *
 * Exported here (not from the route file) because Next.js 14 strict route
 * type checking only allows HTTP-method named exports (GET, POST, etc.) from
 * Route Handler files. Any other export causes a TypeScript build error.
 *
 * Phase 4 import: import { InquiryInputSchema } from "@/lib/schemas/inquiry"
 */

import { z } from "zod";

export const InquiryInputSchema = z.object({
  // Required fields
  name: z.string().min(1, "Name is required."),
  email: z.string().email("A valid email address is required."),

  // Optional fields — match Prisma Inquiry model types
  company: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  productInterest: z.string().optional().nullable(),
  quantity: z.string().optional().nullable(),
  fabric: z.string().optional().nullable(),
  gsm: z.string().optional().nullable(),
  customization: z.string().optional().nullable(),
  message: z.string().optional().nullable(),

  // fileUrls: array of pre-uploaded Cloudinary URLs (Phase 3 wires the upload)
  fileUrls: z.array(z.string()).default([]),

  // status is always set to NEW by Prisma default — excluded from input
});

export type InquiryInput = z.infer<typeof InquiryInputSchema>;

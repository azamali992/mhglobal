/**
 * app/api/inquiry/route.ts — Public inquiry submission endpoint.
 *
 * POST /api/inquiry (multipart/form-data)
 *   - Honeypot check: if the hidden "website" field is filled, the request
 *     is silently accepted (200) without saving or emailing anything — this
 *     avoids tipping off bots that they were caught.
 *   - Per-IP rate limit: 5 submissions / hour.
 *   - Cloudflare Turnstile verification (skipped while unconfigured — see
 *     lib/turnstile.ts).
 *   - Validates text fields with Zod.
 *   - Uploads any attached files (jpg/png/webp/pdf, max 5, 10MB each) to
 *     Cloudinary under mh-global-attire/inquiries.
 *   - Creates an Inquiry record (status defaults to NEW).
 *   - Sends an internal notification + buyer acknowledgement email
 *     (best-effort — a delivery failure is logged, not returned as an error,
 *     since the inquiry itself was already saved successfully).
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { InquiryInputSchema } from "@/lib/schemas/inquiry";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sendInquiryNotification, sendBuyerAcknowledgement } from "@/lib/email";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // 1. Rate limit — 5 submissions / hour / IP.
  if (!checkRateLimit(`inquiry:${ip}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { success: false, errors: { formErrors: ["Too many submissions — please try again later."], fieldErrors: {} } },
      { status: 429 }
    );
  }

  // 2. Parse multipart form data.
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { success: false, errors: { formErrors: ["Invalid form submission."], fieldErrors: {} } },
      { status: 400 }
    );
  }

  // 3. Honeypot — bots fill hidden fields; humans never see them.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return NextResponse.json({ success: true, id: "ok" }, { status: 201 });
  }

  // 4. Turnstile verification (no-op success while unconfigured).
  const turnstileToken = formData.get("turnstileToken");
  const turnstileOk = await verifyTurnstileToken(
    typeof turnstileToken === "string" ? turnstileToken : null,
    ip
  );
  if (!turnstileOk) {
    return NextResponse.json(
      { success: false, errors: { formErrors: ["Verification failed — please try again."], fieldErrors: {} } },
      { status: 400 }
    );
  }

  // 5. Validate text fields with Zod.
  const rawFields: Record<string, unknown> = { fileUrls: [] };
  for (const key of [
    "name", "email", "company", "country", "phone",
    "productInterest", "quantity", "fabric", "gsm", "customization", "message",
  ]) {
    const v = formData.get(key);
    if (typeof v === "string" && v.trim() !== "") rawFields[key] = v;
  }

  const result = InquiryInputSchema.safeParse(rawFields);
  if (!result.success) {
    return NextResponse.json(
      { success: false, errors: result.error.flatten() },
      { status: 400 }
    );
  }

  // 6. Validate + upload attached files.
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { success: false, errors: { formErrors: [`Maximum ${MAX_FILES} files allowed.`], fieldErrors: {} } },
      { status: 400 }
    );
  }
  for (const file of files) {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, errors: { formErrors: ["Only JPEG, PNG, WEBP, or PDF files are allowed."], fieldErrors: {} } },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { success: false, errors: { formErrors: ["Each file must be smaller than 10MB."], fieldErrors: {} } },
        { status: 400 }
      );
    }
  }

  let fileUrls: string[] = [];
  try {
    fileUrls = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        const dataUri = `data:${file.type};base64,${base64}`;
        return uploadToCloudinary(dataUri, "mh-global-attire/inquiries");
      })
    );
  } catch (err) {
    console.error("inquiry file upload:", err);
    return NextResponse.json(
      { success: false, errors: { formErrors: ["File upload failed — please try again."], fieldErrors: {} } },
      { status: 500 }
    );
  }

  // 7. Persist the inquiry. Prisma default sets status = NEW.
  const inquiry = await prisma.inquiry.create({
    data: {
      name: result.data.name,
      email: result.data.email,
      company: result.data.company ?? null,
      country: result.data.country ?? null,
      phone: result.data.phone ?? null,
      productInterest: result.data.productInterest ?? null,
      quantity: result.data.quantity ?? null,
      fabric: result.data.fabric ?? null,
      gsm: result.data.gsm ?? null,
      customization: result.data.customization ?? null,
      message: result.data.message ?? null,
      fileUrls,
    },
  });

  // 8. Email dispatch — best-effort, never blocks the success response.
  try {
    await sendInquiryNotification(inquiry);
    await sendBuyerAcknowledgement(inquiry.email, inquiry.name);
  } catch (err) {
    console.error("inquiry email dispatch:", err);
  }

  return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
}

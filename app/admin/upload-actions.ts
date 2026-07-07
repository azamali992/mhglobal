"use server";

import { auth } from "@/auth";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_FOLDERS = [
  "mh-global-attire/categories",
  "mh-global-attire/products",
  "mh-global-attire/content",
  "mh-global-attire/certifications",
];

export async function uploadImageAction(
  formData: FormData
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  if (!isCloudinaryConfigured()) {
    return { success: false, error: "Image uploads are not configured yet." };
  }

  const file = formData.get("file");
  const folder = formData.get("folder");

  if (!(file instanceof File)) {
    return { success: false, error: "No file provided." };
  }
  if (typeof folder !== "string" || !ALLOWED_FOLDERS.includes(folder)) {
    return { success: false, error: "Invalid upload folder." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: "Only JPEG, PNG, or WEBP images are allowed." };
  }
  if (file.size > MAX_BYTES) {
    return { success: false, error: "Image must be smaller than 5MB." };
  }

  try {
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;
    const url = await uploadToCloudinary(dataUri, folder);
    return { success: true, url };
  } catch (err) {
    console.error("uploadImageAction:", err);
    return { success: false, error: "Upload failed — please try again." };
  }
}

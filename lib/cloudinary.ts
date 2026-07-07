import { v2 as cloudinary } from "cloudinary";

// Cloudinary credentials are read from environment variables.
// CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET may be
// absent locally during Phase 1 — upload calls are gated to Phase 3.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * True once all three Cloudinary env vars are set. Admin CMS upload UI reads
 * this (via a Server Component prop, not directly in a Client Component) to
 * decide whether to render the real uploader or the URL-fallback state.
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

/**
 * Signed upload to Cloudinary. Returns the secure_url string of the
 * uploaded asset.
 *
 * Folder convention (use exactly these strings at call sites):
 *   mh-global-attire/categories
 *   mh-global-attire/products
 *   mh-global-attire/content
 *   mh-global-attire/certifications
 *   mh-global-attire/inquiries
 *
 * @param source - A local file path, remote URL, or base64 data URI
 *   (`data:image/png;base64,...`) — cloudinary.uploader.upload accepts all
 *   three as its `file` argument. Server Actions receiving a browser File
 *   convert it to a data URI (no filesystem access needed).
 * @param folder - Cloudinary folder path (see convention above).
 * @returns Cloudinary secure_url.
 */
export async function uploadToCloudinary(
  source: string,
  folder: string
): Promise<string> {
  const result = await cloudinary.uploader.upload(source, {
    folder,
    resource_type: "auto",
  });
  return result.secure_url;
}

/**
 * Returns a Cloudinary delivery URL with automatic format and quality
 * optimisations applied (f_auto, q_auto).
 *
 * @param publicId - The Cloudinary public_id of the asset.
 * @returns Optimised CDN URL.
 */
export function getAutoUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
    secure: true,
  });
}

export { cloudinary };

/**
 * lib/turnstile.ts — Cloudflare Turnstile server-side verification.
 *
 * Mirrors the isCloudinaryConfigured() pattern in lib/cloudinary.ts: while
 * the site/secret keys aren't set yet, verification is skipped (not failed)
 * so the inquiry form keeps working during setup. The honeypot field and
 * per-IP rate limit provide a baseline even when Turnstile is unconfigured.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileConfigured(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  );
}

export async function verifyTurnstileToken(
  token: string | null,
  remoteIp?: string
): Promise<boolean> {
  if (!isTurnstileConfigured()) return true;
  if (!token) return false;

  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY!,
    response: token,
  });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body });
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch (err) {
    console.error("verifyTurnstileToken:", err);
    return false;
  }
}

/**
 * lib/rate-limit.ts — in-memory per-IP sliding-window rate limiter.
 *
 * Single-instance only (state lives in module memory, not shared across
 * server instances). Fine for this app's current one-instance Node
 * deployment; if it ever moves to a multi-instance/serverless deployment,
 * swap the Map for a shared store (Redis, Upstash) behind the same
 * checkRateLimit() signature.
 */

const hits = new Map<string, number[]>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) {
    hits.set(key, timestamps);
    return false;
  }
  timestamps.push(now);
  hits.set(key, timestamps);
  return true;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

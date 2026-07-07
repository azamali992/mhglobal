/**
 * middleware.ts — Route protection for /admin/** using Auth.js v5.
 *
 * Uses NextAuth initialized with the Edge-safe authConfig (auth.config.ts),
 * which contains NO Node.js-only imports (no pg, no Prisma, no bcrypt).
 *
 * The middleware only reads the encrypted JWT session cookie to determine
 * whether the request is authorized — no database queries occur here.
 *
 * Authorization logic (in authConfig.callbacks.authorized):
 *   /admin/login  → always allowed (unauthenticated pass-through)
 *   /admin/**     → requires a valid JWT session; redirects to /admin/login
 *
 * The full auth config (with Credentials provider + Prisma) lives in auth.ts
 * and is used ONLY by the Node.js API route handler.
 */

import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Re-initialize NextAuth with ONLY the Edge-compatible config.
// This avoids bundling pg/@prisma/adapter-pg/bcryptjs into the Edge runtime.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/admin/:path*"],
};

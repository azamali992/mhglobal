/**
 * auth.config.ts — Edge-compatible Auth.js configuration.
 *
 * This file contains ONLY the parts of the NextAuth config that are safe to
 * run in the Next.js Edge Runtime (middleware). It must NOT import any
 * Node.js-only modules (pg, @prisma/adapter-pg, bcryptjs, etc.).
 *
 * auth.ts extends this config with the Credentials provider (which uses
 * Prisma + bcryptjs dynamically, executing only in the Node.js API route
 * handler — never in the Edge middleware).
 *
 * middleware.ts imports from this file (via NextAuth re-init) to stay Edge-safe.
 */

import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  // Explicit secret shared by both the Edge middleware instance (this file)
  // and the Node.js instance (auth.ts, which spreads ...authConfig). Without
  // this, Auth.js v5 defaults to reading AUTH_SECRET (not NEXTAUTH_SECRET,
  // the v4-era name already in .env.local), and each of the two independent
  // NextAuth() calls would fall back to a different ephemeral secret — a JWT
  // signed by one would fail verification in the other.
  secret: process.env.NEXTAUTH_SECRET,

  // Custom admin login page — replaces the built-in Auth.js UI.
  pages: {
    signIn: "/admin/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    /**
     * Called by the Edge middleware on every matched request.
     * Reads ONLY the JWT session cookie — no database queries.
     * Allows /admin/login through unauthenticated; all other /admin/**
     * routes require a valid session.
     */
    authorized({
      auth,
      request,
    }: {
      auth: { user?: unknown } | null;
      request: { nextUrl: URL };
    }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;

      // Always allow the login page — prevents infinite redirect loops.
      if (pathname === "/admin/login") return true;

      // All other /admin/** routes require an authenticated session.
      return isLoggedIn;
    },
  },

  // Providers array is empty here — the Credentials provider is added in
  // auth.ts (Node.js runtime) where Prisma/bcrypt are available.
  providers: [],
};

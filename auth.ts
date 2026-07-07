/**
 * auth.ts — Full Auth.js v5 (next-auth@beta) configuration for Node.js runtime.
 *
 * Extends auth.config.ts with the Credentials provider that queries Prisma.
 * This file is NOT imported by middleware — see middleware.ts which uses the
 * Edge-safe auth.config.ts instead.
 *
 * Exports used by:
 *   - app/api/auth/[...nextauth]/route.ts → handlers (GET, POST)
 *   - app/admin/page.tsx                  → auth() (Server Component session)
 *   - app/admin/login/page.tsx            → signIn (via next-auth/react)
 *   - app/admin/page.tsx                  → signOut (server action)
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { authConfig } from "@/auth.config";

// ─── TypeScript module augmentation ─────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
  interface User {
    role?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: string;
  }
}

// ─── Initialize NextAuth ──────────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      /**
       * Runs ONLY in the Node.js API route handler.
       * Queries Prisma to verify the AdminUser record.
       */
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }
        if (!email || !password) return null;

        const user = await prisma.adminUser.findUnique({
          where: { email },
        });

        if (!user) return null;

        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "",
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    /**
     * Called when a JWT is created (sign-in) or updated.
     * Copies role into the token so the session callback can surface it.
     */
    jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },

    /**
     * Called when the session is accessed by a Server Component or client hook.
     * Copies id and role from the JWT token into the session.user object.
     */
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string | undefined) ?? "admin";
      }
      return session;
    },
  },
});

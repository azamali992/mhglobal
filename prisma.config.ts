import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

// Prisma v7 does not auto-load .env.local (Next.js convention).
// We load it explicitly so migrate/generate commands pick up DATABASE_URL.
dotenv.config({ path: ".env.local" });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});

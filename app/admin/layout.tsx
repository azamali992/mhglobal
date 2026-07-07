import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login — MH Global Attire",
  robots: { index: false, follow: false },
};

/**
 * Admin layout — wraps all /admin/** routes.
 * No public Header/Footer/WhatsAppButton — admin is an isolated shell.
 * SessionProvider is not needed here; next-auth/react signIn() works without
 * it (it makes direct API calls to /api/auth). useSession() would require it,
 * but the admin shell in Phase 1 does not use that hook.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

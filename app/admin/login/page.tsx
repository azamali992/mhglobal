"use client";

/**
 * Admin Login Page — app/admin/login/page.tsx
 *
 * Client Component. Uses next-auth/react signIn with redirect: false so that
 * credential errors can be displayed inline without a page redirect.
 *
 * Styling: follows design-system-spec-0A §3.1 (Button), §3.2 (Card), §3.4 (Input),
 * §3.6 (Section). Palette is ONLY navy/crimson/cream — no new colours introduced.
 *
 * Metadata title is set in the parent app/admin/layout.tsx server component.
 */

import { useState } from "react";
import { signIn } from "next-auth/react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Section from "@/components/ui/Section";
import Container from "@/components/ui/Container";

export default function AdminLoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
      } else {
        // Credentials accepted. Use a hard navigation rather than
        // router.push()/router.refresh(): the freshly-set session cookie
        // can lose a race against an immediate client-side RSC fetch (the
        // soft-navigated /admin request reads the session before the new
        // Set-Cookie has settled and silently redirects back to
        // /admin/login inside the RSC payload, without a visible URL
        // change). A full navigation guarantees the cookie is attached.
        window.location.href = "/admin";
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    /*
      Section variant "dark" (navy background) is recommended for admin/utility
      screens per the design-system guidance on dark-context usage.
      It provides strong visual separation from the public-facing cream pages.
    */
    <Section
      variant="dark"
      className="min-h-screen flex items-center justify-center"
      aria-label="Admin login"
    >
      <Container>
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {/* Card variant "dark" surfaces navy-800 on the navy section background */}
            <Card variant="dark" as="div" className="w-full">
              {/* Header */}
              <div className="mb-8 text-center">
                <p className="font-sans text-caption text-white/60 uppercase tracking-[0.08em] mb-2">
                  MH Global Attire
                </p>
                <h1 className="font-display text-h3 text-white mb-1">
                  Admin Login
                </h1>
                <p className="font-sans text-sm text-white/70">
                  Sign in to manage the site content.
                </p>
              </div>

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/*
                  Input has a white background per the spec (§3.4).
                  It stands out clearly against the navy-800 Card surface.
                */}
                <Input
                  id="admin-email"
                  label="Email address"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="admin@example.com"
                  required
                  variant="dark"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />

                <Input
                  id="admin-password"
                  label="Password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  variant="dark"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />

                {/* Inline error — shown on credential failure (CallbackError) */}
                {error && (
                  <p
                    role="alert"
                    className="font-sans text-sm text-crimson font-medium"
                  >
                    {error}
                  </p>
                )}

                {/*
                  Primary button: crimson fill (bg-crimson, hover:bg-crimson-600).
                  Matches spec §3.1 variant="primary". Full width on login forms.
                */}
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  className="w-full mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}

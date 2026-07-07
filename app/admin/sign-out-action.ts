"use server";

import { signOut } from "@/auth";

/**
 * Server Action used by AdminShell's sign-out form.
 * Defined here because AdminShell is a Client Component and cannot
 * define inline server actions; it imports this instead.
 */
export async function signOutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

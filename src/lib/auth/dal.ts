// Data Access Layer: the single place that checks "is there a valid admin
// session?" Every Server Action and page that touches admin data should
// call verifySession() (or requireAdmin()) rather than trusting the UI.
import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { readSessionCookie } from "./session";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";

// Optimistic check: is there a validly-signed session cookie at all?
// Cheap, no database round trip. Redirects to /login if not.
export const verifySession = cache(async () => {
  const session = await readSessionCookie();
  if (!session?.adminId) {
    redirect("/login");
  }
  return session;
});

// Secure check: confirms the admin account behind the session still exists
// (e.g. hasn't been deleted/deactivated since the cookie was issued). Use
// this before any sensitive mutation; use verifySession() for cheap render
// checks.
export const requireAdmin = cache(async () => {
  const session = await verifySession();
  const [admin] = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      role: adminUsers.role,
    })
    .from(adminUsers)
    .where(eq(adminUsers.id, session.adminId))
    .limit(1);

  if (!admin) {
    redirect("/login");
  }
  return admin;
});

// Read-only check for "is a staff member signed in?" -- like
// getPortalAccount() below, this never redirects, so pages/components that
// render for anyone (signed in or not) can safely call it. Used by
// SiteHeader so the public site recognizes an active staff session instead
// of showing "Log in" to someone who's actually signed in as an admin.
export const getAdminSession = cache(async () => {
  const session = await readSessionCookie();
  if (!session?.adminId) return null;
  const [admin] = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      role: adminUsers.role,
    })
    .from(adminUsers)
    .where(eq(adminUsers.id, session.adminId))
    .limit(1);
  return admin ?? null;
});

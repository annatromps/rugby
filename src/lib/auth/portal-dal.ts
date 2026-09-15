// Read-only check for "is a visitor signed in to a free browsing account?"
// Unlike admin's requireAdmin(), nothing here redirects -- an anonymous
// visitor is a normal, supported state (they just see fuzzed names and a
// "sign up to contact" prompt instead of full details). Pages call this and
// branch on whether it returns null.
import "server-only";
import { cache } from "react";
import { readPortalSessionCookie } from "./portal-session";

export const getPortalAccount = cache(async () => {
  const session = await readPortalSessionCookie();
  if (!session?.accountId) return null;
  return { id: session.accountId, email: session.email, name: session.name };
});

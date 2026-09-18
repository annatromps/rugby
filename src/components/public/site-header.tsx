import { getPortalAccount } from "@/lib/auth/portal-dal";
import { getAdminSession } from "@/lib/auth/dal";
import { SiteHeaderNav } from "./site-header-nav";

// Thin server wrapper: only this part needs to touch the session cookies.
// The interactive bits (More menu, Sign up role picker) live in the client
// component below. Checks both session kinds -- a staff member browsing the
// public site while signed in to /admin should see themselves recognized,
// not a "Log in" link as if they were a stranger.
export async function SiteHeader() {
  const [account, admin] = await Promise.all([getPortalAccount(), getAdminSession()]);
  return <SiteHeaderNav accountName={account?.name ?? null} adminName={admin?.name ?? null} />;
}

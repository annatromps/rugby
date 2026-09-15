import { getPortalAccount } from "@/lib/auth/portal-dal";
import { SiteHeaderNav } from "./site-header-nav";

// Thin server wrapper: only this part needs to touch the session cookie.
// The interactive bits (More menu, Sign up role picker) live in the client
// component below.
export async function SiteHeader() {
  const account = await getPortalAccount();
  return <SiteHeaderNav accountName={account?.name ?? null} />;
}

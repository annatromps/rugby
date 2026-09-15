import Link from "next/link";
import Image from "next/image";
import { getPortalAccount } from "@/lib/auth/portal-dal";
import { logOutAccount } from "@/app/actions/portal-auth";

const NAV_LINKS = [
  { href: "/players", label: "Find players" },
  { href: "/clubs", label: "Find clubs" },
  { href: "/coaches", label: "Find coaches" },
  { href: "/positions", label: "Open positions" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const account = await getPortalAccount();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/kickoff-rugby-logo.png"
            alt="Kickoff Rugby Recruitment"
            width={176}
            height={69}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto sm:gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-navy"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {account ? (
            <div className="flex items-center gap-2">
              <span className="hidden whitespace-nowrap text-sm text-slate-600 sm:inline">
                Hi, {account.name.split(" ")[0]}
              </span>
              <form action={logOutAccount}>
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Log out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/signin"
                className="whitespace-nowrap rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 hover:text-brand-navy"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="whitespace-nowrap rounded-md border border-brand-navy px-2.5 py-1.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white"
              >
                Sign up
              </Link>
            </div>
          )}

          <span className="hidden h-6 w-px bg-slate-200 sm:inline-block" aria-hidden="true" />

          <Link
            href="/join/player"
            className="hidden whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-navy lg:inline-block"
          >
            Join as a player
          </Link>
          <Link
            href="/join/club"
            className="whitespace-nowrap rounded-md bg-brand-navy px-3 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark"
          >
            List your club
          </Link>
        </div>
      </div>
    </header>
  );
}

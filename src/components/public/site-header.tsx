import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/players", label: "Find players" },
  { href: "/clubs", label: "Find clubs" },
];

export function SiteHeader() {
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

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/join/player"
            className="hidden whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-brand-navy sm:inline-block"
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

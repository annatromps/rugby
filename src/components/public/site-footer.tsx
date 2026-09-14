import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:justify-between sm:px-6">
        <p>&copy; {new Date().getFullYear()} Kickoff Rugby Recruitment.</p>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href="/players" className="hover:text-brand-navy">
            Find players
          </Link>
          <Link href="/clubs" className="hover:text-brand-navy">
            Find clubs
          </Link>
          <Link href="/join/player" className="hover:text-brand-navy">
            Join as a player
          </Link>
          <Link href="/join/club" className="hover:text-brand-navy">
            List your club
          </Link>
          <Link href="/login" className="hover:text-brand-navy">
            Staff login
          </Link>
        </div>
      </div>
    </footer>
  );
}

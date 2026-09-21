import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-brand-navy">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/kickoff-rugby-icon.png"
            alt="Kickoff Rugby Recruitment"
            width={600}
            height={377}
            className="h-5 w-auto opacity-90"
          />
          <p>&copy; {new Date().getFullYear()} Kickoff Rugby Recruitment.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href="/players" className="hover:text-brand-coral">
            Find players
          </Link>
          <Link href="/clubs" className="hover:text-brand-coral">
            Find clubs
          </Link>
          <Link href="/coaches" className="hover:text-brand-coral">
            Find coaches
          </Link>
          <Link href="/how-it-works" className="hover:text-brand-coral">
            How it works
          </Link>
          <Link href="/pricing" className="hover:text-brand-coral">
            Pricing
          </Link>
          <Link href="/testimonials" className="hover:text-brand-coral">
            Testimonials
          </Link>
          <Link href="/faq" className="hover:text-brand-coral">
            FAQ
          </Link>
          <Link href="/contact" className="hover:text-brand-coral">
            Contact
          </Link>
          <Link href="/join/player" className="hover:text-brand-coral">
            Join as a player
          </Link>
          <Link href="/join/coach" className="hover:text-brand-coral">
            Join as a coach
          </Link>
          <Link href="/join/club" className="hover:text-brand-coral">
            List your club
          </Link>
          <Link href="/login" className="hover:text-brand-coral">
            Staff login
          </Link>
          <Link href="/privacy" className="hover:text-brand-coral">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-brand-coral">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { and, eq, notInArray, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { players, clubs } from "@/lib/db/schema";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

export const dynamic = "force-dynamic";

const PUBLIC_EXCLUDED_STATUSES: Array<"ARCHIVED" | "PLACED"> = ["ARCHIVED", "PLACED"];

async function getStats() {
  const [[playerRow], [clubRow]] = await Promise.all([
    db
      .select({ value: count() })
      .from(players)
      .where(
        and(
          eq(players.source, "SELF_SUBMITTED"),
          notInArray(players.status, PUBLIC_EXCLUDED_STATUSES),
        ),
      ),
    db
      .select({ value: count() })
      .from(clubs)
      .where(
        and(
          eq(clubs.source, "SELF_SUBMITTED"),
          notInArray(clubs.status, PUBLIC_EXCLUDED_STATUSES),
        ),
      ),
  ]);
  return { players: playerRow.value, clubs: clubRow.value };
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="bg-brand-navy">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Where rugby players and clubs find each other
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-200 sm:text-lg">
              Browse players looking for a club, clubs looking for players, and
              open positions worldwide — from community sides to professional
              academies.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/players"
                className="w-full rounded-md bg-white px-5 py-3 text-sm font-semibold text-brand-navy shadow-sm hover:bg-slate-100 sm:w-auto"
              >
                Browse players
              </Link>
              <Link
                href="/clubs"
                className="w-full rounded-md bg-brand-coral px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-coral-dark sm:w-auto"
              >
                Browse clubs
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-300">
              {stats.players} player{stats.players === 1 ? "" : "s"} registered &middot;{" "}
              {stats.clubs} club{stats.clubs === 1 ? "" : "s"} recruiting
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <div className="text-2xl font-bold text-brand-coral">1</div>
              <h3 className="mt-1 font-semibold text-slate-900">Create a profile</h3>
              <p className="mt-1 text-sm text-slate-600">
                Players list their position, level and experience. Clubs list
                their league, level and open positions.
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-coral">2</div>
              <h3 className="mt-1 font-semibold text-slate-900">Get discovered</h3>
              <p className="mt-1 text-sm text-slate-600">
                Anyone can browse and search the directory — no account
                needed to look around.
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-coral">3</div>
              <h3 className="mt-1 font-semibold text-slate-900">Get in touch</h3>
              <p className="mt-1 text-sm text-slate-600">
                Send a message directly from a profile page. Our team helps
                move things along from there, including relocation support.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-14 text-center sm:px-6">
            <h2 className="text-xl font-semibold text-slate-900">Ready to get started?</h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/join/player"
                className="rounded-md border border-brand-navy px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white"
              >
                Join as a player
              </Link>
              <Link
                href="/join/club"
                className="rounded-md bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy-dark"
              >
                List your club
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

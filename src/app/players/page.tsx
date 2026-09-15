import Link from "next/link";
import type { Metadata } from "next";
import { and, desc, eq, ilike, notInArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { players } from "@/lib/db/schema";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PlayerCard } from "@/components/public/player-card";
import { PLAYER_LEVELS, PLAYER_LEVEL_LABELS } from "@/lib/constants";

const PUBLIC_EXCLUDED_STATUSES: Array<"ARCHIVED" | "PLACED"> = ["ARCHIVED", "PLACED"];

export const metadata: Metadata = {
  title: "Find players",
  description: "Browse rugby players looking for a club, filterable by position, country, and level.",
};

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; country?: string; level?: string }>;
}) {
  const { q, country, level } = await searchParams;

  const conditions = [
    eq(players.isPublished, true),
    notInArray(players.status, PUBLIC_EXCLUDED_STATUSES),
  ];
  if (q) conditions.push(ilike(players.position, `%${q}%`));
  if (country) conditions.push(ilike(players.currentCountry, `%${country}%`));
  if (level) {
    conditions.push(eq(players.level, level as (typeof PLAYER_LEVELS)[number]));
  }

  const rows = await db
    .select()
    .from(players)
    .where(and(...conditions))
    .orderBy(desc(players.createdAt))
    .limit(60);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Find players</h1>
          <p className="mt-1 text-sm text-slate-600">
            Players who have listed themselves as looking for a club.
          </p>
        </div>

        <form className="mb-6 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-slate-500">Position</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="e.g. Fly-half"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-slate-500">Based in</label>
            <input
              name="country"
              defaultValue={country}
              placeholder="e.g. Spain"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            />
          </div>
          <div className="min-w-[160px]">
            <label className="block text-xs font-medium text-slate-500">Level</label>
            <select
              name="level"
              defaultValue={level ?? ""}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            >
              <option value="">Any level</option>
              {PLAYER_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {PLAYER_LEVEL_LABELS[l]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-md bg-brand-navy px-4 py-1.5 text-sm font-semibold text-white hover:bg-brand-navy-dark"
            >
              Search
            </button>
          </div>
        </form>

        {rows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            No players match yet.{" "}
            <Link href="/join/player" className="font-medium text-brand-navy underline">
              Be the first to register
            </Link>
            .
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

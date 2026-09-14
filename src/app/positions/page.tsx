import Link from "next/link";
import type { Metadata } from "next";
import { and, desc, eq, ilike, notInArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { clubs, positionNeeds } from "@/lib/db/schema";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { PositionCard } from "@/components/public/position-card";
import { PLAYER_LEVELS, PLAYER_LEVEL_LABELS } from "@/lib/constants";

const PUBLIC_EXCLUDED_STATUSES: Array<"ARCHIVED" | "PLACED"> = ["ARCHIVED", "PLACED"];

export const metadata: Metadata = {
  title: "Open positions",
  description: "Browse specific playing vacancies clubs are actively recruiting for, filterable by position, country, and level.",
};

export default async function PositionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; country?: string; level?: string }>;
}) {
  const { q, country, level } = await searchParams;

  const conditions = [
    eq(positionNeeds.filled, false),
    eq(clubs.source, "SELF_SUBMITTED"),
    eq(clubs.isPublished, true),
    notInArray(clubs.status, PUBLIC_EXCLUDED_STATUSES),
  ];
  if (q) conditions.push(ilike(positionNeeds.position, `%${q}%`));
  if (country) conditions.push(ilike(clubs.country, `%${country}%`));
  if (level) conditions.push(eq(positionNeeds.level, level as (typeof PLAYER_LEVELS)[number]));

  const rows = await db
    .select({
      id: positionNeeds.id,
      position: positionNeeds.position,
      level: positionNeeds.level,
      notes: positionNeeds.notes,
      openSince: positionNeeds.openSince,
      clubId: clubs.id,
      clubName: clubs.name,
      clubCountry: clubs.country,
      clubRegion: clubs.region,
      clubLeague: clubs.league,
    })
    .from(positionNeeds)
    .innerJoin(clubs, eq(positionNeeds.clubId, clubs.id))
    .where(and(...conditions))
    .orderBy(desc(positionNeeds.openSince))
    .limit(60);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Open positions</h1>
          <p className="mt-1 text-sm text-slate-600">
            Specific vacancies clubs are actively recruiting for right now.
          </p>
        </div>

        <form className="mb-6 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-slate-500">Position</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="e.g. Loosehead prop"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            />
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-slate-500">Country</label>
            <input
              name="country"
              defaultValue={country}
              placeholder="e.g. France"
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
            No open positions match yet.{" "}
            <Link href="/join/club" className="font-medium text-brand-navy underline">
              List your club&apos;s vacancy
            </Link>
            .
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row) => (
              <PositionCard key={row.id} position={row} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

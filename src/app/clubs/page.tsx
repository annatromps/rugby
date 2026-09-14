import Link from "next/link";
import type { Metadata } from "next";
import { and, desc, eq, ilike, inArray, notInArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { clubs, positionNeeds } from "@/lib/db/schema";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { ClubCard } from "@/components/public/club-card";
import { PLAYER_LEVELS, PLAYER_LEVEL_LABELS } from "@/lib/constants";

const PUBLIC_EXCLUDED_STATUSES: Array<"ARCHIVED" | "PLACED"> = ["ARCHIVED", "PLACED"];

export const metadata: Metadata = {
  title: "Find clubs",
  description: "Browse rugby clubs recruiting players, filterable by country and level, with open positions listed.",
};

export default async function ClubsPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; level?: string }>;
}) {
  const { country, level } = await searchParams;

  const conditions = [
    eq(clubs.source, "SELF_SUBMITTED"),
    eq(clubs.isPublished, true),
    notInArray(clubs.status, PUBLIC_EXCLUDED_STATUSES),
  ];
  if (country) conditions.push(ilike(clubs.country, `%${country}%`));
  if (level) conditions.push(eq(clubs.level, level as (typeof PLAYER_LEVELS)[number]));

  const rows = await db
    .select()
    .from(clubs)
    .where(and(...conditions))
    .orderBy(desc(clubs.createdAt))
    .limit(60);

  const openCounts = new Map<string, number>();
  if (rows.length > 0) {
    const needs = await db
      .select({ clubId: positionNeeds.clubId, filled: positionNeeds.filled })
      .from(positionNeeds)
      .where(
        and(
          inArray(positionNeeds.clubId, rows.map((c) => c.id)),
          eq(positionNeeds.filled, false),
        ),
      );
    for (const n of needs) {
      openCounts.set(n.clubId, (openCounts.get(n.clubId) ?? 0) + 1);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Find clubs</h1>
          <p className="mt-1 text-sm text-slate-600">
            Clubs that have listed themselves as recruiting.
          </p>
        </div>

        <form className="mb-6 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
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
            No clubs match yet.{" "}
            <Link href="/join/club" className="font-medium text-brand-navy underline">
              Be the first to list yours
            </Link>
            .
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((club) => (
              <ClubCard key={club.id} club={club} openPositions={openCounts.get(club.id) ?? 0} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

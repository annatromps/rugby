import Link from "next/link";
import type { Metadata } from "next";
import { and, desc, eq, ilike, notInArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { coaches } from "@/lib/db/schema";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { CoachCard } from "@/components/public/coach-card";

const PUBLIC_EXCLUDED_STATUSES: Array<"ARCHIVED" | "PLACED"> = ["ARCHIVED", "PLACED"];

export const metadata: Metadata = {
  title: "Find coaches",
  description: "Browse rugby coaches looking for a club, filterable by specialization and country.",
};

export default async function CoachesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; country?: string }>;
}) {
  const { q, country } = await searchParams;

  const conditions = [
    eq(coaches.source, "SELF_SUBMITTED"),
    eq(coaches.isPublished, true),
    notInArray(coaches.status, PUBLIC_EXCLUDED_STATUSES),
  ];
  if (q) conditions.push(ilike(coaches.specialization, `%${q}%`));
  if (country) conditions.push(ilike(coaches.currentCountry, `%${country}%`));

  const rows = await db
    .select()
    .from(coaches)
    .where(and(...conditions))
    .orderBy(desc(coaches.createdAt))
    .limit(60);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Find coaches</h1>
          <p className="mt-1 text-sm text-slate-600">Coaches who have listed themselves as looking for a club.</p>
        </div>

        <form className="mb-6 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-slate-500">Specialization</label>
            <input
              name="q"
              defaultValue={q}
              placeholder="e.g. Forwards / scrum"
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
            No coaches match yet.{" "}
            <Link href="/join/coach" className="font-medium text-brand-navy underline">
              Be the first to register
            </Link>
            .
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((coach) => (
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

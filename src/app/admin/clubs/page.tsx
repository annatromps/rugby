import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { clubs } from "@/lib/db/schema";
import { ClubStatusSelect } from "@/components/admin/club-status-select";
import { RECORD_STATUSES } from "@/lib/constants";

export default async function ClubsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const rows = await db
    .select()
    .from(clubs)
    .where(status ? eq(clubs.status, status as (typeof RECORD_STATUSES)[number]) : undefined)
    .orderBy(desc(clubs.updatedAt));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Clubs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Clubs looking for players, and where each one stands.
          </p>
        </div>
        <Link
          href="/admin/clubs/new"
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Add club
        </Link>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Link
          href="/admin/clubs"
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            !status ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          All
        </Link>
        {RECORD_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/clubs?status=${s}`}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              status === s ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            {s.replace("_", " ").toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3 font-medium">Club</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-400">
                  No clubs yet.{" "}
                  <Link href="/admin/clubs/new" className="text-slate-700 underline">
                    Add the first one
                  </Link>
                  .
                </td>
              </tr>
            )}
            {rows.map((club) => (
              <tr key={club.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/clubs/${club.id}`} className="font-medium text-slate-900 hover:underline">
                    {club.name}
                  </Link>
                  {club.league && <p className="text-xs text-slate-400">{club.league}</p>}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {[club.region, club.country].filter(Boolean).join(", ")}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">{club.source.replace("_", " ").toLowerCase()}</td>
                <td className="px-4 py-3">
                  <ClubStatusSelect clubId={club.id} status={club.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

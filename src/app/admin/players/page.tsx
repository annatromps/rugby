import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { players } from "@/lib/db/schema";
import { PlayerStatusSelect } from "@/components/admin/player-status-select";
import { RECORD_STATUSES } from "@/lib/constants";

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const rows = await db
    .select()
    .from(players)
    .where(status ? eq(players.status, status as (typeof RECORD_STATUSES)[number]) : undefined)
    .orderBy(desc(players.updatedAt));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Players</h1>
          <p className="mt-1 text-sm text-slate-500">
            Players looking for a club, and where each one stands.
          </p>
        </div>
        <Link
          href="/admin/players/new"
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Add player
        </Link>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Link
          href="/admin/players"
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            !status ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          All
        </Link>
        {RECORD_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/players?status=${s}`}
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
              <th className="px-4 py-3 font-medium">Player</th>
              <th className="px-4 py-3 font-medium">Position</th>
              <th className="px-4 py-3 font-medium">Based in</th>
              <th className="px-4 py-3 font-medium">Accommodation</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                  No players yet.{" "}
                  <Link href="/admin/players/new" className="text-slate-700 underline">
                    Add the first one
                  </Link>
                  .
                </td>
              </tr>
            )}
            {rows.map((player) => (
              <tr key={player.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/players/${player.id}`} className="font-medium text-slate-900 hover:underline">
                    {player.firstName} {player.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{player.position}</td>
                <td className="px-4 py-3 text-slate-600">{player.currentCountry ?? "—"}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {player.needsAccommodation ? "Needs help" : "—"}
                </td>
                <td className="px-4 py-3">
                  <PlayerStatusSelect playerId={player.id} status={player.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

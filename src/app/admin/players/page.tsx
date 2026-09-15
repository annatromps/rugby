import Link from "next/link";
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { players, emailTemplates } from "@/lib/db/schema";
import { PlayerStatusSelect } from "@/components/admin/player-status-select";
import { PlayerPublishToggle } from "@/components/admin/player-publish-toggle";
import { EmailComposeButton } from "@/components/admin/email-compose-button";
import { buildPlayerVariables } from "@/lib/email-templates";
import { requireAdmin } from "@/lib/auth/dal";
import { RECORD_STATUSES } from "@/lib/constants";

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; pending?: string }>;
}) {
  const { status, pending } = await searchParams;
  const showPendingOnly = pending === "1";

  const [admin, rows, [pendingCountRow], playerTemplates] = await Promise.all([
    requireAdmin(),
    db
      .select()
      .from(players)
      .where(
        showPendingOnly
          ? and(eq(players.source, "SELF_SUBMITTED"), eq(players.isPublished, false))
          : status
            ? eq(players.status, status as (typeof RECORD_STATUSES)[number])
            : undefined,
      )
      .orderBy(desc(players.updatedAt)),
    db
      .select({ value: count() })
      .from(players)
      .where(and(eq(players.source, "SELF_SUBMITTED"), eq(players.isPublished, false))),
    db.select().from(emailTemplates).where(eq(emailTemplates.targetType, "PLAYER")),
  ]);
  const pendingCount = pendingCountRow?.value ?? 0;

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
          className="rounded-md bg-brand-navy px-3 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark"
        >
          Add player
        </Link>
      </div>

      {pendingCount > 0 && !showPendingOnly && (
        <Link
          href="/admin/players?pending=1"
          className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 hover:bg-amber-100"
        >
          <span>
            <strong>{pendingCount}</strong> self sign-up{pendingCount === 1 ? "" : "s"} waiting for review — not
            visible on the public site yet.
          </span>
          <span className="font-medium underline">Review now</span>
        </Link>
      )}

      <div className="flex flex-wrap gap-1.5">
        <Link
          href="/admin/players"
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            !status && !showPendingOnly ? "bg-brand-navy text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/players?pending=1"
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            showPendingOnly ? "bg-amber-600 text-white" : "bg-white text-amber-700 border border-amber-200"
          }`}
        >
          Pending review{pendingCount > 0 ? ` (${pendingCount})` : ""}
        </Link>
        {RECORD_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/players?status=${s}`}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              !showPendingOnly && status === s ? "bg-brand-navy text-white" : "bg-white text-slate-600 border border-slate-200"
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
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">
                  {showPendingOnly ? (
                    "Nothing waiting for review right now."
                  ) : (
                    <>
                      No players yet.{" "}
                      <Link href="/admin/players/new" className="text-slate-700 underline">
                        Add the first one
                      </Link>
                      .
                    </>
                  )}
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
                  <PlayerPublishToggle playerId={player.id} isPublished={player.isPublished} />
                </td>
                <td className="px-4 py-3">
                  <PlayerStatusSelect playerId={player.id} status={player.status} />
                </td>
                <td className="px-4 py-3">
                  <EmailComposeButton
                    recipientEmail={player.email}
                    recipientLabel={`${player.firstName} ${player.lastName}`}
                    templates={playerTemplates}
                    variables={buildPlayerVariables(player, admin.name)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

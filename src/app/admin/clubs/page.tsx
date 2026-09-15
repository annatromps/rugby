import Link from "next/link";
import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { clubs, emailTemplates } from "@/lib/db/schema";
import { ClubStatusSelect } from "@/components/admin/club-status-select";
import { ClubPublishToggle } from "@/components/admin/club-publish-toggle";
import { EmailComposeButton } from "@/components/admin/email-compose-button";
import { buildClubVariables } from "@/lib/email-templates";
import { requireAdmin } from "@/lib/auth/dal";
import { RECORD_STATUSES } from "@/lib/constants";

export default async function ClubsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; pending?: string }>;
}) {
  const { status, pending } = await searchParams;
  const showPendingOnly = pending === "1";

  const [admin, rows, [pendingCountRow], clubTemplates] = await Promise.all([
    requireAdmin(),
    db
      .select()
      .from(clubs)
      .where(
        showPendingOnly
          ? and(eq(clubs.source, "SELF_SUBMITTED"), eq(clubs.isPublished, false))
          : status
            ? eq(clubs.status, status as (typeof RECORD_STATUSES)[number])
            : undefined,
      )
      .orderBy(desc(clubs.updatedAt)),
    db
      .select({ value: count() })
      .from(clubs)
      .where(and(eq(clubs.source, "SELF_SUBMITTED"), eq(clubs.isPublished, false))),
    db.select().from(emailTemplates).where(eq(emailTemplates.targetType, "CLUB")),
  ]);
  const pendingCount = pendingCountRow?.value ?? 0;

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
          className="rounded-md bg-brand-navy px-3 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark"
        >
          Add club
        </Link>
      </div>

      {pendingCount > 0 && !showPendingOnly && (
        <Link
          href="/admin/clubs?pending=1"
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
          href="/admin/clubs"
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            !status && !showPendingOnly ? "bg-brand-navy text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/clubs?pending=1"
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            showPendingOnly ? "bg-amber-600 text-white" : "bg-white text-amber-700 border border-amber-200"
          }`}
        >
          Pending review{pendingCount > 0 ? ` (${pendingCount})` : ""}
        </Link>
        {RECORD_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/clubs?status=${s}`}
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
              <th className="px-4 py-3 font-medium">Club</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                  {showPendingOnly ? (
                    "Nothing waiting for review right now."
                  ) : (
                    <>
                      No clubs yet.{" "}
                      <Link href="/admin/clubs/new" className="text-slate-700 underline">
                        Add the first one
                      </Link>
                      .
                    </>
                  )}
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
                  {club.source === "SELF_SUBMITTED" ? (
                    <ClubPublishToggle clubId={club.id} isPublished={club.isPublished} />
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <ClubStatusSelect clubId={club.id} status={club.status} />
                </td>
                <td className="px-4 py-3">
                  <EmailComposeButton
                    recipientEmail={club.contactEmail}
                    recipientLabel={club.name}
                    templates={clubTemplates}
                    variables={buildClubVariables(club, admin.name)}
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

import Link from "next/link";
import { and, desc, eq, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { coaches, emailTemplates } from "@/lib/db/schema";
import { CoachStatusSelect } from "@/components/admin/coach-status-select";
import { CoachPublishToggle } from "@/components/admin/coach-publish-toggle";
import { EmailComposeButton } from "@/components/admin/email-compose-button";
import { buildCoachVariables } from "@/lib/email-templates";
import { requireAdmin } from "@/lib/auth/dal";
import { RECORD_STATUSES } from "@/lib/constants";

export default async function CoachesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; pending?: string }>;
}) {
  const { status, pending } = await searchParams;
  const showPendingOnly = pending === "1";

  const [admin, rows, [pendingCountRow], coachTemplates] = await Promise.all([
    requireAdmin(),
    db
      .select()
      .from(coaches)
      .where(
        showPendingOnly
          ? and(eq(coaches.source, "SELF_SUBMITTED"), eq(coaches.isPublished, false))
          : status
            ? eq(coaches.status, status as (typeof RECORD_STATUSES)[number])
            : undefined,
      )
      .orderBy(desc(coaches.updatedAt)),
    db
      .select({ value: count() })
      .from(coaches)
      .where(and(eq(coaches.source, "SELF_SUBMITTED"), eq(coaches.isPublished, false))),
    db.select().from(emailTemplates).where(eq(emailTemplates.targetType, "COACH")),
  ]);
  const pendingCount = pendingCountRow?.value ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Coaches</h1>
          <p className="mt-1 text-sm text-slate-500">Coaches looking for a club, and where each one stands.</p>
        </div>
        <Link
          href="/admin/coaches/new"
          className="rounded-md bg-brand-navy px-3 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark"
        >
          Add coach
        </Link>
      </div>

      {pendingCount > 0 && !showPendingOnly && (
        <Link
          href="/admin/coaches?pending=1"
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
          href="/admin/coaches"
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            !status && !showPendingOnly ? "bg-brand-navy text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          All
        </Link>
        <Link
          href="/admin/coaches?pending=1"
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            showPendingOnly ? "bg-amber-600 text-white" : "bg-white text-amber-700 border border-amber-200"
          }`}
        >
          Pending review{pendingCount > 0 ? ` (${pendingCount})` : ""}
        </Link>
        {RECORD_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/coaches?status=${s}`}
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
              <th className="px-4 py-3 font-medium">Coach</th>
              <th className="px-4 py-3 font-medium">Specialization</th>
              <th className="px-4 py-3 font-medium">Based in</th>
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
                      No coaches yet.{" "}
                      <Link href="/admin/coaches/new" className="text-slate-700 underline">
                        Add the first one
                      </Link>
                      .
                    </>
                  )}
                </td>
              </tr>
            )}
            {rows.map((coach) => (
              <tr key={coach.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/coaches/${coach.id}`} className="font-medium text-slate-900 hover:underline">
                    {coach.firstName} {coach.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-600">{coach.specialization}</td>
                <td className="px-4 py-3 text-slate-600">{coach.currentCountry ?? "—"}</td>
                <td className="px-4 py-3">
                  {coach.source === "SELF_SUBMITTED" ? (
                    <CoachPublishToggle coachId={coach.id} isPublished={coach.isPublished} />
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <CoachStatusSelect coachId={coach.id} status={coach.status} />
                </td>
                <td className="px-4 py-3">
                  <EmailComposeButton
                    recipientEmail={coach.email}
                    recipientLabel={`${coach.firstName} ${coach.lastName}`}
                    templates={coachTemplates}
                    variables={buildCoachVariables(coach, admin.name)}
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

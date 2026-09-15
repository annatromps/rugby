import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { emailTemplates } from "@/lib/db/schema";
import { setDefaultEmailTemplate, deleteEmailTemplate } from "@/app/actions/email-templates";

export const metadata = { title: "Email templates" };

export default async function EmailTemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const targetType = type === "PLAYER" ? "PLAYER" : "CLUB";

  const templates = await db
    .select()
    .from(emailTemplates)
    .where(eq(emailTemplates.targetType, targetType))
    .orderBy(emailTemplates.name);

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Email templates</h1>
          <p className="mt-1 text-sm text-slate-500">
            Drafts used by the &ldquo;Email&rdquo; button on clubs and players. Use{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">{"{{variableName}}"}</code> to pull in
            details for whoever you&rsquo;re emailing.
          </p>
        </div>
        <Link
          href={`/admin/settings/email-templates/new?type=${targetType}`}
          className="rounded-md bg-brand-navy px-3 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark"
        >
          New template
        </Link>
      </div>

      <div className="flex gap-1.5">
        <Link
          href="/admin/settings/email-templates?type=CLUB"
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            targetType === "CLUB" ? "bg-brand-navy text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          Club templates
        </Link>
        <Link
          href="/admin/settings/email-templates?type=PLAYER"
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            targetType === "PLAYER" ? "bg-brand-navy text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          Player templates
        </Link>
      </div>

      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
        {templates.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-400">
            No {targetType.toLowerCase()} templates yet.{" "}
            <Link href={`/admin/settings/email-templates/new?type=${targetType}`} className="text-slate-700 underline">
              Create one
            </Link>
            .
          </p>
        )}
        {templates.map((tpl) => (
          <div key={tpl.id} className="flex items-start justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link href={`/admin/settings/email-templates/${tpl.id}`} className="font-medium text-slate-900 hover:underline">
                  {tpl.name}
                </Link>
                {tpl.isDefault && (
                  <span className="rounded-full bg-brand-navy/10 px-2 py-0.5 text-[11px] font-medium text-brand-navy">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-sm text-slate-500">{tpl.subject}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3 pt-0.5 text-sm">
              {!tpl.isDefault && (
                <form action={setDefaultEmailTemplate.bind(null, tpl.id, targetType)}>
                  <button type="submit" className="text-slate-500 hover:text-brand-navy">
                    Make default
                  </button>
                </form>
              )}
              <Link href={`/admin/settings/email-templates/${tpl.id}`} className="text-slate-500 hover:text-brand-navy">
                Edit
              </Link>
              <form action={deleteEmailTemplate.bind(null, tpl.id, targetType)}>
                <button type="submit" className="text-red-500 hover:text-red-700">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

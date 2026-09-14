import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { clubs, positionNeeds } from "@/lib/db/schema";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { LevelBadge } from "@/components/public/level-badge";
import { InquiryForm } from "@/components/public/inquiry-form";
import { submitInquiry } from "@/app/actions/public";

const PUBLIC_EXCLUDED_STATUSES = new Set(["ARCHIVED", "PLACED"]);

export default async function ClubProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [club] = await db.select().from(clubs).where(eq(clubs.id, id)).limit(1);

  if (!club || club.source !== "SELF_SUBMITTED" || PUBLIC_EXCLUDED_STATUSES.has(club.status)) {
    notFound();
  }

  const openPositions = await db
    .select()
    .from(positionNeeds)
    .where(eq(positionNeeds.clubId, club.id));

  const inquiryAction = submitInquiry.bind(null, { clubId: club.id });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <Link href="/clubs" className="text-sm text-slate-500 hover:text-brand-navy">
          &larr; Back to clubs
        </Link>

        <div className="mt-4 grid gap-8 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">{club.name}</h1>
              <LevelBadge level={club.level} />
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {[club.region, club.country].filter(Boolean).join(", ")}
              {club.league ? ` · ${club.league}` : ""}
            </p>

            {club.website && (
              <a
                href={club.website.startsWith("http") ? club.website : `https://${club.website}`}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 inline-block text-sm font-medium text-brand-navy hover:underline"
              >
                Visit website &rarr;
              </a>
            )}

            {club.notes && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-slate-900">About</h2>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{club.notes}</p>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-sm font-semibold text-slate-900">Open positions</h2>
              {openPositions.filter((p) => !p.filled).length === 0 ? (
                <p className="mt-1 text-sm text-slate-500">No open positions listed right now.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {openPositions
                    .filter((p) => !p.filled)
                    .map((p) => (
                      <li
                        key={p.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                      >
                        <span className="font-medium text-slate-800">{p.position}</span>
                        <LevelBadge level={p.level} />
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <InquiryForm action={inquiryAction} heading="Interested? Send a message" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

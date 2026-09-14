import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { players } from "@/lib/db/schema";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { LevelBadge } from "@/components/public/level-badge";
import { InquiryForm } from "@/components/public/inquiry-form";
import { submitInquiry } from "@/app/actions/public";

const PUBLIC_EXCLUDED_STATUSES = new Set(["ARCHIVED", "PLACED"]);

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [player] = await db.select().from(players).where(eq(players.id, id)).limit(1);

  if (!player || player.source !== "SELF_SUBMITTED" || !player.isPublished || PUBLIC_EXCLUDED_STATUSES.has(player.status)) {
    notFound();
  }

  const inquiryAction = submitInquiry.bind(null, { playerId: player.id });

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <Link href="/players" className="text-sm text-slate-500 hover:text-brand-navy">
          &larr; Back to players
        </Link>

        <div className="mt-4 grid gap-8 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {player.firstName} {player.lastName}
              </h1>
              <LevelBadge level={player.level} />
            </div>
            <p className="mt-1 text-lg font-medium text-brand-coral">
              {player.position}
              {player.secondaryPosition ? ` / ${player.secondaryPosition}` : ""}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              {player.currentCountry && (
                <div>
                  <dt className="text-slate-400">Based in</dt>
                  <dd className="font-medium text-slate-800">{player.currentCountry}</dd>
                </div>
              )}
              {player.nationality && (
                <div>
                  <dt className="text-slate-400">Nationality</dt>
                  <dd className="font-medium text-slate-800">{player.nationality}</dd>
                </div>
              )}
              {typeof player.yearsExperience === "number" && (
                <div>
                  <dt className="text-slate-400">Experience</dt>
                  <dd className="font-medium text-slate-800">{player.yearsExperience} years</dd>
                </div>
              )}
              {player.currentClub && (
                <div>
                  <dt className="text-slate-400">Current club</dt>
                  <dd className="font-medium text-slate-800">{player.currentClub}</dd>
                </div>
              )}
            </dl>

            {player.notes && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-slate-900">About</h2>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{player.notes}</p>
              </div>
            )}

            {player.highlightUrl && (
              <div className="mt-6">
                <a
                  href={player.highlightUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-md border border-brand-navy px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white"
                >
                  Watch highlights &rarr;
                </a>
              </div>
            )}
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

import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { coaches } from "@/lib/db/schema";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { VerifiedBadge } from "@/components/public/verified-badge";
import { Avatar } from "@/components/public/avatar";
import { InquiryForm } from "@/components/public/inquiry-form";
import { SignUpGate } from "@/components/public/sign-up-gate";
import { submitInquiry } from "@/app/actions/public";
import { getPortalAccount } from "@/lib/auth/portal-dal";
import { fuzzName } from "@/lib/fuzz-name";

const PUBLIC_EXCLUDED_STATUSES = new Set(["ARCHIVED", "PLACED"]);

async function getPublicCoach(id: string) {
  const [coach] = await db.select().from(coaches).where(eq(coaches.id, id)).limit(1);
  if (!coach || !coach.isPublished || PUBLIC_EXCLUDED_STATUSES.has(coach.status)) {
    return null;
  }
  return coach;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const coach = await getPublicCoach(id);
  if (!coach) return { title: "Coach not found" };

  const title = `${fuzzName(coach.firstName, coach.lastName)} -- ${coach.specialization}`;
  const description =
    [coach.currentCountry ? `Based in ${coach.currentCountry}` : null, coach.coachingLevel].filter(Boolean).join(" · ") ||
    "View this coach's profile on Kickoff Rugby Recruitment.";

  return { title, description };
}

export default async function CoachProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [coach, account] = await Promise.all([getPublicCoach(id), getPortalAccount()]);
  if (!coach) notFound();

  const inquiryAction = submitInquiry.bind(null, { coachId: coach.id });
  const displayName = account ? `${coach.firstName} ${coach.lastName}` : fuzzName(coach.firstName, coach.lastName);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
        <Link href="/coaches" className="text-sm text-slate-500 hover:text-brand-navy">
          &larr; Back to coaches
        </Link>

        <div className="mt-4 grid gap-8 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar
                src={account ? coach.photoUrl : null}
                alt={displayName}
                initials={`${coach.firstName[0] ?? ""}${coach.lastName[0] ?? ""}`}
                size={72}
              />
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
                {coach.isVerified && <VerifiedBadge />}
              </div>
            </div>
            <p className="mt-1 text-lg font-medium text-brand-coral">{coach.specialization}</p>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              {coach.currentCountry && (
                <div>
                  <dt className="text-slate-400">Based in</dt>
                  <dd className="font-medium text-slate-800">{coach.currentCountry}</dd>
                </div>
              )}
              {coach.nationality && (
                <div>
                  <dt className="text-slate-400">Nationality</dt>
                  <dd className="font-medium text-slate-800">{coach.nationality}</dd>
                </div>
              )}
              {coach.coachingLevel && (
                <div>
                  <dt className="text-slate-400">Coaching level</dt>
                  <dd className="font-medium text-slate-800">{coach.coachingLevel}</dd>
                </div>
              )}
              {typeof coach.yearsExperience === "number" && (
                <div>
                  <dt className="text-slate-400">Experience</dt>
                  <dd className="font-medium text-slate-800">{coach.yearsExperience} years</dd>
                </div>
              )}
              {coach.currentClub && (
                <div>
                  <dt className="text-slate-400">Current club</dt>
                  <dd className="font-medium text-slate-800">{coach.currentClub}</dd>
                </div>
              )}
            </dl>

            {coach.notes && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-slate-900">About</h2>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{coach.notes}</p>
              </div>
            )}

            {coach.highlightUrl && (
              <div className="mt-6">
                <a
                  href={coach.highlightUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-md border border-brand-navy px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-navy hover:text-white"
                >
                  View highlights / CV &rarr;
                </a>
              </div>
            )}
          </div>

          <div>
            {account ? (
              <InquiryForm action={inquiryAction} heading="Interested? Send a message" />
            ) : (
              <SignUpGate heading="Interested? Send a message" />
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

import { notFound } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { clubs, positionNeeds, contactLogs, placements, players } from "@/lib/db/schema";
import { logClubContact } from "@/app/actions/clubs";
import { ClubStatusSelect } from "@/components/admin/club-status-select";
import { ClubPublishToggle } from "@/components/admin/club-publish-toggle";
import { ClubVerifiedToggle } from "@/components/admin/club-verified-toggle";
import { ClubEditForm } from "./club-edit-form";
import { AddPositionForm, PositionsList } from "./positions";
import { AddContactLogForm, ContactLogList } from "@/components/admin/contact-log";

export default async function ClubDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [club] = await db.select().from(clubs).where(eq(clubs.id, id)).limit(1);
  if (!club) notFound();

  const [needs, logs, clubPlacements] = await Promise.all([
    db.select().from(positionNeeds).where(eq(positionNeeds.clubId, id)),
    db
      .select()
      .from(contactLogs)
      .where(eq(contactLogs.clubId, id))
      .orderBy(desc(contactLogs.contactedAt)),
    db
      .select({
        id: placements.id,
        status: placements.status,
        startDate: placements.startDate,
        playerFirstName: players.firstName,
        playerLastName: players.lastName,
        playerId: players.id,
      })
      .from(placements)
      .innerJoin(players, eq(placements.playerId, players.id))
      .where(eq(placements.clubId, id)),
  ]);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{club.name}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {[club.region, club.country].filter(Boolean).join(", ")}
            {club.league ? ` · ${club.league}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {club.source === "SELF_SUBMITTED" && (
            <ClubPublishToggle clubId={club.id} isPublished={club.isPublished} />
          )}
          <ClubVerifiedToggle clubId={club.id} isVerified={club.isVerified} />
          <ClubStatusSelect clubId={club.id} status={club.status} />
        </div>
      </div>

      <Section title="Details">
        <ClubEditForm club={club} />
      </Section>

      <Section title="Positions needed">
        <PositionsList clubId={club.id} needs={needs} />
        <AddPositionForm clubId={club.id} />
      </Section>

      {clubPlacements.length > 0 && (
        <Section title="Placements">
          <ul className="divide-y divide-slate-100 text-sm">
            {clubPlacements.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2">
                <span>
                  {p.playerFirstName} {p.playerLastName}
                </span>
                <span className="text-xs text-slate-500">{p.status}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Contact log">
        <ContactLogList logs={logs} />
        <AddContactLogForm action={logClubContact.bind(null, club.id)} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

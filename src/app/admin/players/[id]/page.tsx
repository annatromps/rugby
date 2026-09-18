import { notFound } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { players, contactLogs, accommodationRequests, placements, clubs, emailTemplates } from "@/lib/db/schema";
import { logPlayerContact } from "@/app/actions/players";
import { PlayerStatusSelect } from "@/components/admin/player-status-select";
import { PlayerPublishToggle } from "@/components/admin/player-publish-toggle";
import { PlayerVerifiedToggle } from "@/components/admin/player-verified-toggle";
import { EmailComposeButton } from "@/components/admin/email-compose-button";
import { buildPlayerVariables } from "@/lib/email-templates";
import { requireAdmin } from "@/lib/auth/dal";
import { AddContactLogForm, ContactLogList } from "@/components/admin/contact-log";
import { PlayerEditForm } from "./player-edit-form";
import { PlayerPhotoUpload } from "@/components/admin/player-photo-upload";
import { PlayerDocumentUpload } from "@/components/admin/player-document-upload";
import { AccommodationList } from "./accommodation";

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [player] = await db.select().from(players).where(eq(players.id, id)).limit(1);
  if (!player) notFound();

  const [logs, accommodation, playerPlacements, admin, playerTemplates] = await Promise.all([
    db
      .select()
      .from(contactLogs)
      .where(eq(contactLogs.playerId, id))
      .orderBy(desc(contactLogs.contactedAt)),
    db
      .select()
      .from(accommodationRequests)
      .where(eq(accommodationRequests.playerId, id))
      .orderBy(desc(accommodationRequests.createdAt)),
    db
      .select({
        id: placements.id,
        status: placements.status,
        clubName: clubs.name,
        clubId: clubs.id,
      })
      .from(placements)
      .innerJoin(clubs, eq(placements.clubId, clubs.id))
      .where(eq(placements.playerId, id)),
    requireAdmin(),
    db.select().from(emailTemplates).where(eq(emailTemplates.targetType, "PLAYER")),
  ]);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {player.firstName} {player.lastName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {player.position}
            {player.currentCountry ? ` · based in ${player.currentCountry}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PlayerPublishToggle playerId={player.id} isPublished={player.isPublished} />
          <PlayerVerifiedToggle playerId={player.id} isVerified={player.isVerified} />
          <PlayerStatusSelect playerId={player.id} status={player.status} />
          <EmailComposeButton
            recipientEmail={player.email}
            recipientLabel={`${player.firstName} ${player.lastName}`}
            templates={playerTemplates}
            variables={buildPlayerVariables(player, admin.name)}
          />
        </div>
      </div>

      <Section title="Photo">
        <PlayerPhotoUpload playerId={player.id} photoUrl={player.photoUrl} />
      </Section>

      <Section title="Application documents">
        <p className="mb-3 text-xs text-slate-500">
          Staff only -- these are never shown on the public player profile.
        </p>
        <PlayerDocumentUpload
          playerId={player.id}
          passportUrl={player.passportUrl}
          passportFileName={player.passportFileName}
          cvUrl={player.cvUrl}
          cvFileName={player.cvFileName}
          coverLetterUrl={player.coverLetterUrl}
          coverLetterFileName={player.coverLetterFileName}
        />
      </Section>

      <Section title="Details">
        <PlayerEditForm player={player} />
      </Section>

      {playerPlacements.length > 0 && (
        <Section title="Placements">
          <ul className="divide-y divide-slate-100 text-sm">
            {playerPlacements.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2">
                <span>{p.clubName}</span>
                <span className="text-xs text-slate-500">{p.status}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Accommodation support">
        <AccommodationList playerId={player.id} requests={accommodation} />
      </Section>

      <Section title="Contact log">
        <ContactLogList logs={logs} />
        <AddContactLogForm action={logPlayerContact.bind(null, player.id)} />
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

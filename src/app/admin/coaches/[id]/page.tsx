import { notFound } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { coaches, contactLogs, emailTemplates } from "@/lib/db/schema";
import { logCoachContact } from "@/app/actions/coaches";
import { CoachStatusSelect } from "@/components/admin/coach-status-select";
import { CoachPublishToggle } from "@/components/admin/coach-publish-toggle";
import { CoachVerifiedToggle } from "@/components/admin/coach-verified-toggle";
import { EmailComposeButton } from "@/components/admin/email-compose-button";
import { buildCoachVariables } from "@/lib/email-templates";
import { requireAdmin } from "@/lib/auth/dal";
import { AddContactLogForm, ContactLogList } from "@/components/admin/contact-log";
import { CoachEditForm } from "./coach-edit-form";
import { CoachPhotoUpload } from "@/components/admin/coach-photo-upload";

export default async function CoachDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [coach] = await db.select().from(coaches).where(eq(coaches.id, id)).limit(1);
  if (!coach) notFound();

  const [logs, admin, coachTemplates] = await Promise.all([
    db
      .select()
      .from(contactLogs)
      .where(eq(contactLogs.coachId, id))
      .orderBy(desc(contactLogs.contactedAt)),
    requireAdmin(),
    db.select().from(emailTemplates).where(eq(emailTemplates.targetType, "COACH")),
  ]);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {coach.firstName} {coach.lastName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {coach.specialization}
            {coach.currentCountry ? ` · based in ${coach.currentCountry}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {coach.source === "SELF_SUBMITTED" && (
            <CoachPublishToggle coachId={coach.id} isPublished={coach.isPublished} />
          )}
          <CoachVerifiedToggle coachId={coach.id} isVerified={coach.isVerified} />
          <CoachStatusSelect coachId={coach.id} status={coach.status} />
          <EmailComposeButton
            recipientEmail={coach.email}
            recipientLabel={`${coach.firstName} ${coach.lastName}`}
            templates={coachTemplates}
            variables={buildCoachVariables(coach, admin.name)}
          />
        </div>
      </div>

      <Section title="Photo">
        <CoachPhotoUpload coachId={coach.id} photoUrl={coach.photoUrl} />
      </Section>

      <Section title="Details">
        <CoachEditForm coach={coach} />
      </Section>

      <Section title="Contact log">
        <ContactLogList logs={logs} />
        <AddContactLogForm action={logCoachContact.bind(null, coach.id)} />
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

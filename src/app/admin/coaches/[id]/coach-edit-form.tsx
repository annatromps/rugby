import { updateCoach } from "@/app/actions/coaches";
import type { coaches } from "@/lib/db/schema";

type Coach = typeof coaches.$inferSelect;

export function CoachEditForm({ coach }: { coach: Coach }) {
  async function action(formData: FormData) {
    "use server";
    await updateCoach(coach.id, formData);
  }

  return (
    <form action={action} className="grid grid-cols-2 gap-4 text-sm">
      <Field label="First name" name="firstName" defaultValue={coach.firstName} required />
      <Field label="Last name" name="lastName" defaultValue={coach.lastName} required />
      <Field label="Email" name="email" defaultValue={coach.email ?? ""} type="email" />
      <Field label="Phone" name="phone" defaultValue={coach.phone ?? ""} />
      <Field label="Nationality" name="nationality" defaultValue={coach.nationality ?? ""} />
      <Field label="Currently based in" name="currentCountry" defaultValue={coach.currentCountry ?? ""} />
      <Field label="Specialisation" name="specialization" defaultValue={coach.specialization} required />
      <Field label="Coaching level" name="coachingLevel" defaultValue={coach.coachingLevel ?? ""} />
      <Field label="Current club" name="currentClub" defaultValue={coach.currentClub ?? ""} />
      <Field
        label="Years of experience"
        name="yearsExperience"
        type="number"
        defaultValue={coach.yearsExperience?.toString() ?? ""}
      />
      <Field label="Highlight reel / CV link" name="highlightUrl" defaultValue={coach.highlightUrl ?? ""} />
      <div className="col-span-2">
        <label className="block text-xs font-medium text-slate-500">Notes</label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={coach.notes ?? ""}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="col-span-2">
        <button
          type="submit"
          className="rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
    </div>
  );
}

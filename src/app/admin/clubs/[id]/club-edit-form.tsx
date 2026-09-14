import { updateClub } from "@/app/actions/clubs";
import { PLAYER_LEVELS, PLAYER_LEVEL_LABELS } from "@/lib/constants";
import type { clubs } from "@/lib/db/schema";

type Club = typeof clubs.$inferSelect;

export function ClubEditForm({ club }: { club: Club }) {
  async function action(formData: FormData) {
    "use server";
    await updateClub(club.id, formData);
  }

  return (
    <form action={action} className="grid grid-cols-2 gap-4 text-sm">
      <Field label="Club name" name="name" defaultValue={club.name} required />
      <Field label="Country" name="country" defaultValue={club.country} required />
      <Field label="Region / city" name="region" defaultValue={club.region ?? ""} />
      <Field label="League" name="league" defaultValue={club.league ?? ""} />
      <div>
        <label className="block text-xs font-medium text-slate-500">Level</label>
        <select
          name="level"
          defaultValue={club.level ?? ""}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Unspecified</option>
          {PLAYER_LEVELS.map((level) => (
            <option key={level} value={level}>
              {PLAYER_LEVEL_LABELS[level]}
            </option>
          ))}
        </select>
      </div>
      <Field label="Website" name="website" defaultValue={club.website ?? ""} />
      <Field label="Contact name" name="contactName" defaultValue={club.contactName ?? ""} />
      <Field label="Contact email" name="contactEmail" defaultValue={club.contactEmail ?? ""} type="email" />
      <Field label="Contact phone" name="contactPhone" defaultValue={club.contactPhone ?? ""} />
      <div className="col-span-2">
        <label className="block text-xs font-medium text-slate-500">Notes</label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={club.notes ?? ""}
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

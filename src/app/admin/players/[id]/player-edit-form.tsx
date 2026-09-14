import { updatePlayer } from "@/app/actions/players";
import { PLAYER_LEVELS, PLAYER_LEVEL_LABELS } from "@/lib/constants";
import type { players } from "@/lib/db/schema";

type Player = typeof players.$inferSelect;

export function PlayerEditForm({ player }: { player: Player }) {
  async function action(formData: FormData) {
    "use server";
    await updatePlayer(player.id, formData);
  }

  return (
    <form action={action} className="grid grid-cols-2 gap-4 text-sm">
      <Field label="First name" name="firstName" defaultValue={player.firstName} required />
      <Field label="Last name" name="lastName" defaultValue={player.lastName} required />
      <Field label="Email" name="email" defaultValue={player.email ?? ""} type="email" />
      <Field label="Phone" name="phone" defaultValue={player.phone ?? ""} />
      <Field label="Nationality" name="nationality" defaultValue={player.nationality ?? ""} />
      <Field label="Currently based in" name="currentCountry" defaultValue={player.currentCountry ?? ""} />
      <Field label="Primary position" name="position" defaultValue={player.position} required />
      <Field label="Secondary position" name="secondaryPosition" defaultValue={player.secondaryPosition ?? ""} />
      <div>
        <label className="block text-xs font-medium text-slate-500">Level</label>
        <select
          name="level"
          defaultValue={player.level ?? ""}
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
      <Field label="Current club" name="currentClub" defaultValue={player.currentClub ?? ""} />
      <Field
        label="Years of experience"
        name="yearsExperience"
        type="number"
        defaultValue={player.yearsExperience?.toString() ?? ""}
      />
      <Field label="Highlight reel / stats link" name="highlightUrl" defaultValue={player.highlightUrl ?? ""} />
      <label className="col-span-2 flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name="needsAccommodation"
          defaultChecked={player.needsAccommodation}
          className="rounded border-slate-300"
        />
        Needs help finding accommodation
      </label>
      <div className="col-span-2">
        <label className="block text-xs font-medium text-slate-500">Notes</label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={player.notes ?? ""}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="col-span-2">
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
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

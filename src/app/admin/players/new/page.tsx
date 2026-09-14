"use client";

import { useActionState } from "react";
import { createPlayer } from "@/app/actions/players";
import { PLAYER_LEVELS, PLAYER_LEVEL_LABELS } from "@/lib/constants";

export default function NewPlayerPage() {
  const [state, action, pending] = useActionState(createPlayer, undefined);

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Add a player</h1>

      <form action={action} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" name="firstName" required error={state?.fieldErrors?.firstName} />
          <Field label="Last name" name="lastName" required error={state?.fieldErrors?.lastName} />
          <Field label="Email" name="email" type="email" />
          <Field label="Phone" name="phone" />
          <Field label="Nationality" name="nationality" />
          <Field label="Currently based in" name="currentCountry" />
          <Field label="Primary position" name="position" required error={state?.fieldErrors?.position} />
          <Field label="Secondary position" name="secondaryPosition" />
          <div>
            <label className="block text-sm font-medium text-slate-700">Level</label>
            <select name="level" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
              <option value="">Unspecified</option>
              {PLAYER_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {PLAYER_LEVEL_LABELS[level]}
                </option>
              ))}
            </select>
          </div>
          <Field label="Current club" name="currentClub" />
          <Field label="Years of experience" name="yearsExperience" type="number" />
          <Field label="Highlight reel / stats link" name="highlightUrl" />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="needsAccommodation" className="rounded border-slate-300" />
          Needs help finding accommodation
        </label>
        <div>
          <label className="block text-sm font-medium text-slate-700">Notes</label>
          <textarea name="notes" rows={3} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save player"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  error?: string[];
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error[0]}</p>}
    </div>
  );
}

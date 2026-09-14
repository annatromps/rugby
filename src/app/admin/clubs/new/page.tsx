"use client";

import { useActionState } from "react";
import { createClub } from "@/app/actions/clubs";
import { PLAYER_LEVELS, PLAYER_LEVEL_LABELS } from "@/lib/constants";

export default function NewClubPage() {
  const [state, action, pending] = useActionState(createClub, undefined);

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Add a club</h1>

      <form action={action} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Club name" name="name" required error={state?.fieldErrors?.name} />
          <Field label="Country" name="country" required error={state?.fieldErrors?.country} />
          <Field label="Region / city" name="region" />
          <Field label="League" name="league" />
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
          <Field label="Website" name="website" />
          <Field label="Contact name" name="contactName" />
          <Field label="Contact email" name="contactEmail" type="email" />
          <Field label="Contact phone" name="contactPhone" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Notes</label>
          <textarea
            name="notes"
            rows={3}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save club"}
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

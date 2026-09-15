"use client";

import { useActionState } from "react";
import { createCoach } from "@/app/actions/coaches";

export default function NewCoachPage() {
  const [state, action, pending] = useActionState(createCoach, undefined);

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Add a coach</h1>

      <form action={action} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" name="firstName" required error={state?.fieldErrors?.firstName} />
          <Field label="Last name" name="lastName" required error={state?.fieldErrors?.lastName} />
          <Field label="Email" name="email" type="email" />
          <Field label="Phone" name="phone" />
          <Field label="Nationality" name="nationality" />
          <Field label="Currently based in" name="currentCountry" />
          <Field
            label="Specialisation"
            name="specialization"
            required
            placeholder="e.g. Forwards / scrum"
            error={state?.fieldErrors?.specialization}
          />
          <Field label="Coaching level" name="coachingLevel" placeholder="e.g. Level 3" />
          <Field label="Current club" name="currentClub" />
          <Field label="Years of experience" name="yearsExperience" type="number" />
          <Field label="Highlight reel / CV link" name="highlightUrl" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Notes</label>
          <textarea name="notes" rows={3} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save coach"}
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
  placeholder,
  error,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
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
        placeholder={placeholder}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error[0]}</p>}
    </div>
  );
}

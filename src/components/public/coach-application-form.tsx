"use client";

import { useActionState } from "react";
import { submitCoachApplication } from "@/app/actions/public";

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy";
const labelClass = "block text-sm font-medium text-slate-700";

export function CoachApplicationForm() {
  const [state, action, pending] = useActionState(submitCoachApplication, undefined);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-brand-navy/20 bg-brand-navy/5 p-8 text-center">
        <h2 className="text-lg font-semibold text-brand-navy">You&apos;re on the list!</h2>
        <p className="mt-2 text-sm text-slate-600">
          Your profile has been submitted for review. Once approved, clubs will be able to find you in the coaches
          directory, and we&apos;ll reach out if there&apos;s a good match.
        </p>
      </div>
    );
  }

  const fieldErrors = state && "fieldErrors" in state ? state.fieldErrors : undefined;

  return (
    <form action={action} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="hidden" aria-hidden="true">
        <label>
          Leave this field blank
          <input name="website_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>First name</label>
          <input name="firstName" required className={inputClass} />
          {fieldErrors?.firstName && <p className="mt-1 text-xs text-red-600">{fieldErrors.firstName[0]}</p>}
        </div>
        <div>
          <label className={labelClass}>Last name</label>
          <input name="lastName" required className={inputClass} />
          {fieldErrors?.lastName && <p className="mt-1 text-xs text-red-600">{fieldErrors.lastName[0]}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Email</label>
          <input name="email" type="email" required className={inputClass} />
          {fieldErrors?.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email[0]}</p>}
        </div>
        <div>
          <label className={labelClass}>Phone (optional)</label>
          <input name="phone" className={inputClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Nationality</label>
          <input name="nationality" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Currently based in</label>
          <input name="currentCountry" className={inputClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Specialisation</label>
          <input name="specialization" required placeholder="e.g. Forwards / scrum" className={inputClass} />
          {fieldErrors?.specialization && <p className="mt-1 text-xs text-red-600">{fieldErrors.specialization[0]}</p>}
        </div>
        <div>
          <label className={labelClass}>Coaching level (optional)</label>
          <input name="coachingLevel" placeholder="e.g. Level 3" className={inputClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Current club (optional)</label>
          <input name="currentClub" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Years of experience</label>
          <input name="yearsExperience" type="number" min="0" max="60" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Highlight reel / CV link (optional)</label>
        <input name="highlightUrl" placeholder="https://..." className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Tell clubs about yourself (optional)</label>
        <textarea name="notes" rows={4} className={inputClass} />
      </div>

      {state && "error" in state && state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Submit my profile"}
      </button>
    </form>
  );
}

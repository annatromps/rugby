"use client";

import { useActionState } from "react";
import { submitClubApplication } from "@/app/actions/public";
import { PLAYER_LEVELS, PLAYER_LEVEL_LABELS } from "@/lib/constants";

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy";
const labelClass = "block text-sm font-medium text-slate-700";

export function ClubApplicationForm() {
  const [state, action, pending] = useActionState(submitClubApplication, undefined);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-brand-navy/20 bg-brand-navy/5 p-8 text-center">
        <h2 className="text-lg font-semibold text-brand-navy">Thanks for listing your club!</h2>
        <p className="mt-2 text-sm text-slate-600">
          Your club has been submitted for review. Once approved, players will
          be able to find you in the clubs directory and see any open
          positions you&apos;ve listed.
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

      <div>
        <label className={labelClass}>Club name</label>
        <input name="name" required className={inputClass} />
        {fieldErrors?.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name[0]}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Country</label>
          <input name="country" required className={inputClass} />
          {fieldErrors?.country && <p className="mt-1 text-xs text-red-600">{fieldErrors.country[0]}</p>}
        </div>
        <div>
          <label className={labelClass}>Region / city (optional)</label>
          <input name="region" className={inputClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>League (optional)</label>
          <input name="league" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Level</label>
          <select name="level" defaultValue="" className={inputClass}>
            <option value="">Prefer not to say</option>
            {PLAYER_LEVELS.map((l) => (
              <option key={l} value={l}>
                {PLAYER_LEVEL_LABELS[l]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Website (optional)</label>
        <input name="website" placeholder="https://..." className={inputClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Contact name</label>
          <input name="contactName" required className={inputClass} />
          {fieldErrors?.contactName && <p className="mt-1 text-xs text-red-600">{fieldErrors.contactName[0]}</p>}
        </div>
        <div>
          <label className={labelClass}>Contact email</label>
          <input name="contactEmail" type="email" required className={inputClass} />
          {fieldErrors?.contactEmail && <p className="mt-1 text-xs text-red-600">{fieldErrors.contactEmail[0]}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Contact phone (optional)</label>
        <input name="contactPhone" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Tell players about your club (optional)</label>
        <textarea name="notes" rows={4} className={inputClass} />
      </div>

      <fieldset className="rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-medium text-slate-700">
          Have a position open right now? (optional)
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Position</label>
            <input name="neededPosition" placeholder="e.g. Fly-half" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Level needed</label>
            <select name="neededLevel" defaultValue="" className={inputClass}>
              <option value="">Any level</option>
              {PLAYER_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {PLAYER_LEVEL_LABELS[l]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {state && "error" in state && state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {pending ? "Submitting..." : "List my club"}
      </button>
    </form>
  );
}

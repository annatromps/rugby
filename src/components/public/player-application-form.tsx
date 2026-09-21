"use client";

import { useActionState } from "react";
import { submitPlayerApplication } from "@/app/actions/public";
import { PLAYER_LEVELS, PLAYER_LEVEL_LABELS } from "@/lib/constants";

const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy";
const labelClass = "block text-sm font-medium text-slate-700";
const fileInputClass =
  "mt-1 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200";

export function PlayerApplicationForm() {
  const [state, action, pending] = useActionState(submitPlayerApplication, undefined);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-brand-navy/20 bg-brand-navy/5 p-8 text-center">
        <h2 className="text-lg font-semibold text-brand-navy">You&apos;re on the list!</h2>
        <p className="mt-2 text-sm text-slate-600">
          Your profile has been submitted for review. Once approved, clubs will be
          able to find you in the players directory, and we&apos;ll reach out if
          there&apos;s a good match.
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
          <label className={labelClass}>Primary position</label>
          <input name="position" required placeholder="e.g. Loosehead prop" className={inputClass} />
          {fieldErrors?.position && <p className="mt-1 text-xs text-red-600">{fieldErrors.position[0]}</p>}
        </div>
        <div>
          <label className={labelClass}>Secondary position (optional)</label>
          <input name="secondaryPosition" className={inputClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
        <div>
          <label className={labelClass}>Years of experience</label>
          <input name="yearsExperience" type="number" min="0" max="60" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Current club (optional)</label>
        <input name="currentClub" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Highlight reel / stats link (optional)</label>
        <input name="highlightUrl" placeholder="https://..." className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Tell clubs about yourself (optional)</label>
        <textarea name="notes" rows={4} className={inputClass} />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input name="needsAccommodation" type="checkbox" className="rounded border-slate-300" />
        I&apos;d need help finding accommodation if placed abroad
      </label>

      <div className="space-y-3 border-t border-slate-100 pt-4">
        <div>
          <p className="text-sm font-medium text-slate-700">Application documents (optional)</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Adding these now speeds up your review -- clubs never see them, they&apos;re only for our team.
            PDF, JPG, PNG, or WEBP, up to 10MB each.
          </p>
        </div>
        <div>
          <label className={labelClass}>Passport / ID</label>
          <input name="passport" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className={fileInputClass} />
        </div>
        <div>
          <label className={labelClass}>CV</label>
          <input name="cv" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className={fileInputClass} />
        </div>
        <div>
          <label className={labelClass}>Cover letter</label>
          <input name="coverLetter" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" className={fileInputClass} />
        </div>
      </div>

      <p className="text-xs text-slate-500">
        By submitting, you agree to our{" "}
        <a href="/terms" target="_blank" rel="noreferrer noopener" className="underline hover:text-slate-700">
          Terms of service
        </a>{" "}
        and{" "}
        <a href="/privacy" target="_blank" rel="noreferrer noopener" className="underline hover:text-slate-700">
          Privacy policy
        </a>
        .
      </p>

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

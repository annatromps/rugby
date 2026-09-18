"use client";

import { useActionState } from "react";
import { submitServiceRequest } from "@/app/actions/services";

const SERVICE_OPTIONS = [
  { value: "CV_HELP", label: "CV help" },
  { value: "ACCOMMODATION", label: "Finding accommodation" },
  { value: "VISA_RELOCATION", label: "Visa & relocation support" },
  { value: "OTHER", label: "Something else" },
];

export function ServiceRequestForm() {
  const [state, formAction, pending] = useActionState(submitServiceRequest, undefined);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-brand-navy/20 bg-brand-navy/5 p-6 text-sm text-brand-navy">
        <p className="font-semibold">Thanks — we've got your request.</p>
        <p className="mt-1 text-slate-600">A member of our team will be in touch by email soon.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Honeypot: hidden from real visitors, catches simple bots. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Leave this field blank
          <input name="website_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600">Your name</label>
        <input
          name="name"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
        {state && "fieldErrors" in state && state.fieldErrors?.name && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600">Your email</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
        {state && "fieldErrors" in state && state.fieldErrors?.email && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600">Phone (optional)</label>
        <input
          name="phone"
          type="tel"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600">Which service do you need?</label>
        <select
          name="serviceType"
          required
          defaultValue=""
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        >
          <option value="" disabled>
            Choose one
          </option>
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {state && "fieldErrors" in state && state.fieldErrors?.serviceType && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.serviceType[0]}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600">
          Tell us more <span className="text-slate-400">(optional)</span>
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder="E.g. which country you're moving to, when you need this by, or anything else that helps us help you."
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
      </div>

      {state && "error" in state && state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand-coral px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-coral-dark disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending..." : "Request help"}
      </button>
    </form>
  );
}

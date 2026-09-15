"use client";

import { useActionState, useState } from "react";
import type { PublicFormState } from "@/app/actions/public";

export function InquiryForm({
  action,
  heading,
}: {
  action: (state: PublicFormState, formData: FormData) => Promise<PublicFormState>;
  heading: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [sendProfile, setSendProfile] = useState(false);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-brand-navy/20 bg-brand-navy/5 p-6 text-sm text-brand-navy">
        <p className="font-semibold">Thanks — your message is on its way.</p>
        <p className="mt-1 text-slate-600">
          Our team will review it and get back to you by email.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{heading}</h3>

      {/* Honeypot: hidden from real visitors, catches simple bots. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Leave this field blank
          <input name="website_url" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
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
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600">Phone (optional)</label>
        <input
          name="phone"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-600">Message</label>
        <textarea
          name="message"
          rows={3}
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
        {state && "fieldErrors" in state && state.fieldErrors?.message && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.message[0]}</p>
        )}
      </div>

      <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
        <label className="flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="sendProfile"
            checked={sendProfile}
            onChange={(e) => setSendProfile(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-navy focus:ring-brand-navy"
          />
          Also send my profile for them to review
        </label>
        {sendProfile && (
          <div className="mt-2">
            <input
              name="profileUrl"
              placeholder="Link to your profile on this site"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
            <p className="mt-1 text-xs text-slate-400">
              e.g. the address of your player or club page here on Kickoff Rugby Recruitment.
            </p>
            {state && "fieldErrors" in state && state.fieldErrors?.profileUrl && (
              <p className="mt-1 text-xs text-red-600">{state.fieldErrors.profileUrl[0]}</p>
            )}
          </div>
        )}
      </div>

      {state && "error" in state && state.error && (
        <p className="text-sm text-red-600">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand-coral px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-coral-dark disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}

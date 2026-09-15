"use client";

import { useActionState } from "react";
import { submitContactMessage } from "@/app/actions/contact";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, undefined);

  if (state?.success) {
    return (
      <div className="rounded-xl border border-brand-navy/20 bg-brand-navy/5 p-6 text-sm text-brand-navy">
        <p className="font-semibold">Thanks — your message is on its way.</p>
        <p className="mt-1 text-slate-600">Our team will get back to you by email soon.</p>
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
        <label className="block text-xs font-medium text-slate-600">Message</label>
        <textarea
          name="message"
          rows={5}
          required
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
        {state && "fieldErrors" in state && state.fieldErrors?.message && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.message[0]}</p>
        )}
      </div>

      {state && "error" in state && state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand-coral px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-coral-dark disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}

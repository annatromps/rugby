"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "@/app/actions/password-reset";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, undefined);

  if (state && "message" in state) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-slate-700">{state.message}</p>
        <Link href="/signin" className="mt-4 inline-block text-sm font-medium text-brand-navy hover:underline">
          Back to log in
        </Link>
      </div>
    );
  }

  const submittedEmail = state && "email" in state ? state.email : undefined;

  return (
    <form action={action} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={submittedEmail}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
      </div>
      {state && "error" in state && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand-navy px-3 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send reset link"}
      </button>
      <p className="text-center text-xs text-slate-500">
        <Link href="/signin" className="font-medium text-brand-navy hover:underline">
          Back to log in
        </Link>
      </p>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useActionState } from "react";
import { logInAccount } from "@/app/actions/portal-auth";

export function SignInForm() {
  const [state, action, pending] = useActionState(logInAccount, undefined);

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
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
        {state && "fieldErrors" in state && state.fieldErrors?.email && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.email[0]}</p>
        )}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        />
        {state && "fieldErrors" in state && state.fieldErrors?.password && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.password[0]}</p>
        )}
      </div>
      {state && "error" in state && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-brand-navy px-3 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {pending ? "Logging in..." : "Log in"}
      </button>
      <p className="text-center text-xs text-slate-500">
        Don&rsquo;t have an account?{" "}
        <Link href="/signup" className="font-medium text-brand-navy hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}

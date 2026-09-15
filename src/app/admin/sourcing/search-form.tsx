"use client";

import { useActionState } from "react";
import { runSearch } from "@/app/actions/sourcing";

export function SearchForm() {
  const [state, action, pending] = useActionState(runSearch, undefined);

  return (
    <form action={action} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-500">Looking for</label>
          <select
            name="targetType"
            className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="CLUB">Clubs</option>
            <option value="PLAYER">Players</option>
            <option value="COACH">Coaches</option>
          </select>
        </div>
        <div className="flex-1 min-w-[280px]">
          <label className="block text-xs font-medium text-slate-500">Describe what you&apos;re looking for</label>
          <input
            name="brief"
            required
            placeholder="e.g. amateur clubs in South Wales currently short on props"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark disabled:opacity-60"
        >
          {pending ? "Searching..." : "Search"}
        </button>
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <p className="text-xs text-slate-400">
        Claude searches the web and proposes real candidates for you to review below -- nothing is added to your
        Clubs or Players list until you accept a suggestion.
      </p>
    </form>
  );
}

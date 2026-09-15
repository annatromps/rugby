"use client";

import { useTransition } from "react";
import { acceptSuggestion, rejectSuggestion } from "@/app/actions/sourcing";
import { StatusBadge } from "@/components/admin/status-badge";

export function SuggestionCard({
  suggestion,
}: {
  suggestion: {
    id: string;
    name: string;
    summary: string;
    sourceUrl: string | null;
    reviewStatus: string;
    targetType: string;
  };
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-slate-900">{suggestion.name}</p>
          <p className="mt-1 text-sm text-slate-600">{suggestion.summary}</p>
          {suggestion.sourceUrl && (
            <a
              href={suggestion.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-xs text-slate-400 underline hover:text-slate-600"
            >
              Verify source
            </a>
          )}
        </div>
        <StatusBadge status={suggestion.reviewStatus} />
      </div>

      {suggestion.reviewStatus === "PENDING" && (
        <div className="mt-3 flex gap-2">
          <button
            disabled={isPending}
            onClick={() => startTransition(() => acceptSuggestion(suggestion.id))}
            className="rounded-md bg-brand-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-navy-dark disabled:opacity-60"
          >
            Accept &amp; add to{" "}
            {suggestion.targetType === "CLUB" ? "clubs" : suggestion.targetType === "COACH" ? "coaches" : "players"}
          </button>
          <button
            disabled={isPending}
            onClick={() => startTransition(() => rejectSuggestion(suggestion.id))}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

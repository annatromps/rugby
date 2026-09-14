"use client";

import { useTransition } from "react";
import { RECORD_STATUSES } from "@/lib/constants";

const LABELS: Record<string, string> = {
  NEW: "New",
  REVIEWING: "Reviewing",
  SHORTLISTED: "Shortlisted",
  CONTACTED: "Contacted",
  IN_TALKS: "In talks",
  PLACED: "Placed",
  ARCHIVED: "Archived",
};

export function StatusSelect({
  id,
  status,
  onChange,
}: {
  id: string;
  status: string;
  onChange: (id: string, status: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(() => onChange(id, next));
      }}
      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 disabled:opacity-60"
    >
      {RECORD_STATUSES.map((value) => (
        <option key={value} value={value}>
          {LABELS[value]}
        </option>
      ))}
    </select>
  );
}

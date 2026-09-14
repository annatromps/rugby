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

// Mirrors StatusBadge's palette so the editable dropdown reads at a glance
// the same way the read-only badge does elsewhere in the dashboard.
const STYLES: Record<string, string> = {
  NEW: "border-slate-300 bg-slate-100 text-slate-700",
  REVIEWING: "border-blue-200 bg-blue-50 text-blue-700",
  SHORTLISTED: "border-indigo-200 bg-indigo-50 text-indigo-700",
  CONTACTED: "border-amber-200 bg-amber-50 text-amber-700",
  IN_TALKS: "border-purple-200 bg-purple-50 text-purple-700",
  PLACED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ARCHIVED: "border-slate-200 bg-slate-100 text-slate-400",
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
      className={`rounded-full border px-2.5 py-1 text-xs font-medium disabled:opacity-60 ${
        STYLES[status] ?? "border-slate-300 bg-white text-slate-700"
      }`}
    >
      {RECORD_STATUSES.map((value) => (
        <option key={value} value={value}>
          {LABELS[value]}
        </option>
      ))}
    </select>
  );
}

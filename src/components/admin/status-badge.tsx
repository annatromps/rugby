const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-slate-100 text-slate-700",
  REVIEWING: "bg-blue-50 text-blue-700",
  SHORTLISTED: "bg-indigo-50 text-indigo-700",
  CONTACTED: "bg-amber-50 text-amber-700",
  IN_TALKS: "bg-purple-50 text-purple-700",
  PLACED: "bg-emerald-50 text-emerald-700",
  ARCHIVED: "bg-slate-100 text-slate-400",
  PENDING: "bg-amber-50 text-amber-700",
  ACCEPTED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-slate-100 text-slate-400",
};

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  REVIEWING: "Reviewing",
  SHORTLISTED: "Shortlisted",
  CONTACTED: "Contacted",
  IN_TALKS: "In talks",
  PLACED: "Placed",
  ARCHIVED: "Archived",
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

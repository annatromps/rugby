import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { serviceRequests } from "@/lib/db/schema";
import { deleteServiceRequest } from "@/app/actions/services";
import { requireAdmin } from "@/lib/auth/dal";
import { ServiceStatusSelect } from "@/components/admin/service-status-select";

export const metadata = { title: "Service requests" };

const SERVICE_LABELS: Record<string, string> = {
  CV_HELP: "CV help",
  ACCOMMODATION: "Accommodation",
  VISA_RELOCATION: "Visa & relocation",
  OTHER: "Other",
};

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-brand-coral/10 text-brand-coral-dark",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  DONE: "bg-emerald-100 text-emerald-700",
};

export default async function AdminServicesPage() {
  await requireAdmin();
  const rows = await db.select().from(serviceRequests).orderBy(desc(serviceRequests.createdAt));
  const newCount = rows.filter((r) => r.status === "NEW").length;

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Service requests</h1>
        <p className="mt-1 text-sm text-slate-500">
          Submissions from the public "Athlete services" page (CV help, accommodation, visa & relocation).
          {newCount > 0 && ` ${newCount} new.`}
        </p>
      </div>

      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
        {rows.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-400">No requests yet.</p>
        )}
        {rows.map((r) => (
          <div key={r.id} className={`px-4 py-3 ${r.status === "NEW" ? "bg-brand-navy/5" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-slate-900">{r.name}</span>
                  <a href={`mailto:${r.email}`} className="text-xs text-slate-500 hover:text-brand-navy">
                    {r.email}
                  </a>
                  {r.phone && <span className="text-xs text-slate-500">{r.phone}</span>}
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    {SERVICE_LABELS[r.serviceType] ?? r.serviceType}
                  </span>
                </div>
                {r.message && <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{r.message}</p>}
                <p className="mt-1 text-xs text-slate-400">{r.createdAt.toLocaleString()}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[r.status] ?? "bg-slate-100 text-slate-600"}`}
                >
                  {r.status.replace("_", " ")}
                </span>
                <ServiceStatusSelect id={r.id} status={r.status} />
                <form action={deleteServiceRequest.bind(null, r.id)}>
                  <button
                    type="submit"
                    className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

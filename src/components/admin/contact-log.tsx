import { CONTACT_METHODS } from "@/lib/constants";
import type { contactLogs } from "@/lib/db/schema";

type ContactLog = typeof contactLogs.$inferSelect;

export function ContactLogList({ logs }: { logs: ContactLog[] }) {
  if (logs.length === 0) {
    return <p className="mb-3 text-sm text-slate-400">No contact logged yet.</p>;
  }
  return (
    <ul className="mb-4 space-y-3 text-sm">
      {logs.map((log) => (
        <li key={log.id} className="border-b border-slate-50 pb-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-500">{log.method}</span>
            <span>{new Date(log.contactedAt).toLocaleDateString()}</span>
          </div>
          <p className="mt-0.5 text-slate-700">{log.summary}</p>
        </li>
      ))}
    </ul>
  );
}

// `action` is a server action already bound to the club/player id it applies to
// (via Function.prototype.bind on the exported "use server" action), e.g.
// `logClubContact.bind(null, club.id)`.
export function AddContactLogForm({
  action,
}: {
  action: (formData: FormData) => Promise<unknown>;
}) {
  async function submit(formData: FormData) {
    "use server";
    await action(formData);
  }

  return (
    <form action={submit} className="flex flex-wrap items-end gap-2 border-t border-slate-100 pt-3">
      <div>
        <label className="block text-xs font-medium text-slate-500">Method</label>
        <select name="method" className="mt-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm">
          {CONTACT_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[220px]">
        <label className="block text-xs font-medium text-slate-500">Summary</label>
        <input
          name="summary"
          required
          placeholder="What happened?"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
      </div>
      <button
        type="submit"
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Log contact
      </button>
    </form>
  );
}

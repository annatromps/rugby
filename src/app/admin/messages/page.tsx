import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { markContactMessageRead, deleteContactMessage } from "@/app/actions/contact";
import { requireAdmin } from "@/lib/auth/dal";

export const metadata = { title: "Contact messages" };

export default async function AdminMessagesPage() {
  await requireAdmin();
  const rows = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  const unreadCount = rows.filter((m) => !m.isRead).length;

  return (
    <div className="max-w-3xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Contact messages</h1>
        <p className="mt-1 text-sm text-slate-500">
          Submissions from the public "Contact us" form.
          {unreadCount > 0 && ` ${unreadCount} unread.`}
        </p>
      </div>

      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
        {rows.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-400">No messages yet.</p>
        )}
        {rows.map((m) => (
          <div key={m.id} className={`px-4 py-3 ${m.isRead ? "" : "bg-brand-navy/5"}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="text-xs text-slate-500 hover:text-brand-navy">
                    {m.email}
                  </a>
                  {!m.isRead && (
                    <span className="rounded-full bg-brand-coral/10 px-2 py-0.5 text-[11px] font-medium text-brand-coral-dark">
                      New
                    </span>
                  )}
                </div>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{m.message}</p>
                <p className="mt-1 text-xs text-slate-400">{m.createdAt.toLocaleString()}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <form action={markContactMessageRead.bind(null, m.id, !m.isRead)}>
                  <button
                    type="submit"
                    className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {m.isRead ? "Mark unread" : "Mark read"}
                  </button>
                </form>
                <form action={deleteContactMessage.bind(null, m.id)}>
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

import Link from "next/link";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { deleteTestimonial, toggleTestimonialActive } from "@/app/actions/testimonials";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const rows = await db.select().from(testimonials).orderBy(testimonials.sortOrder);

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Testimonials</h1>
          <p className="mt-1 text-sm text-slate-500">
            Shown on the homepage. Currently placeholder (Latin) text -- swap each one for a real quote as they come in.
          </p>
        </div>
        <Link
          href="/admin/settings/testimonials/new"
          className="rounded-md bg-brand-navy px-3 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark"
        >
          New testimonial
        </Link>
      </div>

      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
        {rows.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-400">
            No testimonials yet.{" "}
            <Link href="/admin/settings/testimonials/new" className="text-slate-700 underline">
              Create one
            </Link>
            .
          </p>
        )}
        {rows.map((t) => (
          <div key={t.id} className="flex items-start justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link href={`/admin/settings/testimonials/${t.id}`} className="font-medium text-slate-900 hover:underline">
                  {t.authorName}
                </Link>
                {t.authorRole && <span className="text-xs text-slate-400">{t.authorRole}</span>}
                {!t.isActive && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                    Hidden
                  </span>
                )}
              </div>
              <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">&ldquo;{t.quote}&rdquo;</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 pt-0.5">
              <form action={toggleTestimonialActive.bind(null, t.id, !t.isActive)}>
                <button
                  type="submit"
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  {t.isActive ? "Hide" : "Show"}
                </button>
              </form>
              <Link
                href={`/admin/settings/testimonials/${t.id}`}
                className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit
              </Link>
              <form action={deleteTestimonial.bind(null, t.id)}>
                <button
                  type="submit"
                  className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

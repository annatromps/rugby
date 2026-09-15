import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What players, coaches, and clubs say about Kickoff Rugby Recruitment.",
};

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const rows = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.isActive, true))
    .orderBy(testimonials.sortOrder);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">What people are saying</h1>
          <p className="mt-2 text-sm text-slate-600">
            {rows.length === 0
              ? "We're a new marketplace, so there's nothing here yet. Real quotes will appear as players, coaches, and clubs use the site."
              : "What players, coaches, and clubs say about Kickoff Rugby Recruitment."}
          </p>
        </div>

        {rows.length === 0 ? null : (
          <div className="grid gap-6 sm:grid-cols-3">
            {rows.map((t) => (
              <figure key={t.id} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                <blockquote className="text-sm text-slate-700">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm font-medium text-slate-900">
                  {t.authorName}
                  {t.authorRole && <span className="block font-normal text-slate-500">{t.authorRole}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

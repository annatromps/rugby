import Link from "next/link";
import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pricingPlans } from "@/lib/db/schema";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple plans for clubs, players, and coaches on Kickoff Rugby Recruitment.",
};

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const plans = await db
    .select()
    .from(pricingPlans)
    .where(eq(pricingPlans.isActive, true))
    .orderBy(pricingPlans.sortOrder);

  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Simple, straightforward pricing</h1>
            <p className="mt-3 text-base text-slate-600">
              We&rsquo;re a new marketplace and still finalising pricing, so the figures below are indicative.
              Reach out if you have questions about what&rsquo;s right for your club.
            </p>
          </div>

          {plans.length === 0 ? (
            <p className="mt-8 text-center text-sm text-slate-400">Pricing details are coming soon.</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => {
                const features = Array.isArray(plan.features) ? (plan.features as string[]) : [];
                return (
                  <div
                    key={plan.id}
                    className={`flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${
                      plan.isFeatured ? "border-brand-coral ring-1 ring-brand-coral" : "border-slate-200"
                    }`}
                  >
                    {plan.isFeatured && (
                      <span className="mb-3 inline-flex w-fit items-center rounded-full bg-brand-coral/10 px-2.5 py-1 text-xs font-semibold text-brand-coral">
                        Most popular
                      </span>
                    )}
                    <h2 className="text-lg font-semibold text-slate-900">{plan.name}</h2>
                    {plan.tagline && <p className="mt-1 text-sm text-slate-500">{plan.tagline}</p>}
                    <p className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900">{plan.priceLabel}</span>
                      {plan.billingPeriod && <span className="text-sm text-slate-500">/ {plan.billingPeriod}</span>}
                    </p>
                    <ul className="mt-6 flex-1 space-y-2.5">
                      {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="mt-0.5 text-brand-navy">&#10003;</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/join/club"
                      className={`mt-6 rounded-md px-4 py-2 text-center text-sm font-semibold ${
                        plan.isFeatured
                          ? "bg-brand-coral text-white hover:opacity-90"
                          : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                      }`}
                    >
                      Get started
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

import Link from "next/link";
import { db } from "@/lib/db";
import { pricingPlans } from "@/lib/db/schema";
import { deletePricingPlan, togglePricingPlanActive } from "@/app/actions/pricing";

export const metadata = { title: "Pricing" };

export default async function AdminPricingPage() {
  const plans = await db.select().from(pricingPlans).orderBy(pricingPlans.sortOrder);

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Pricing</h1>
          <p className="mt-1 text-sm text-slate-500">
            Plans shown on the public{" "}
            <Link href="/pricing" target="_blank" className="underline">
              /pricing
            </Link>{" "}
            page. These are placeholder figures until real pricing is decided -- edit them any time.
          </p>
        </div>
        <Link
          href="/admin/settings/pricing/new"
          className="rounded-md bg-brand-navy px-3 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark"
        >
          New plan
        </Link>
      </div>

      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
        {plans.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-slate-400">
            No plans yet.{" "}
            <Link href="/admin/settings/pricing/new" className="text-slate-700 underline">
              Create one
            </Link>
            .
          </p>
        )}
        {plans.map((plan) => (
          <div key={plan.id} className="flex items-start justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link href={`/admin/settings/pricing/${plan.id}`} className="font-medium text-slate-900 hover:underline">
                  {plan.name}
                </Link>
                {plan.isFeatured && (
                  <span className="rounded-full bg-brand-coral/10 px-2 py-0.5 text-[11px] font-medium text-brand-coral">
                    Featured
                  </span>
                )}
                {!plan.isActive && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                    Hidden
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-slate-500">
                {plan.priceLabel}
                {plan.billingPeriod ? ` / ${plan.billingPeriod}` : ""}
                {plan.tagline ? ` -- ${plan.tagline}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 pt-0.5">
              <form action={togglePricingPlanActive.bind(null, plan.id, !plan.isActive)}>
                <button
                  type="submit"
                  className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  {plan.isActive ? "Hide" : "Show"}
                </button>
              </form>
              <Link
                href={`/admin/settings/pricing/${plan.id}`}
                className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit
              </Link>
              <form action={deletePricingPlan.bind(null, plan.id)}>
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

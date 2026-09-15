"use client";

import { useActionState } from "react";
import type { PlanFormState } from "@/app/actions/pricing";

type Plan = {
  id: string;
  name: string;
  priceLabel: string;
  billingPeriod: string | null;
  tagline: string | null;
  features: unknown;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
};

export function PlanForm({
  action,
  plan,
  submitLabel,
}: {
  action: (state: PlanFormState, formData: FormData) => Promise<PlanFormState>;
  plan?: Plan;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const featureLines = Array.isArray(plan?.features) ? (plan.features as string[]).join("\n") : "";

  return (
    <form action={formAction} className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Plan name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={plan?.name}
          placeholder="Starter"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        {state?.fieldErrors?.name && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="priceLabel" className="block text-sm font-medium text-slate-700">
            Price
          </label>
          <input
            id="priceLabel"
            name="priceLabel"
            type="text"
            required
            defaultValue={plan?.priceLabel}
            placeholder="$49"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {state?.fieldErrors?.priceLabel && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.priceLabel[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="billingPeriod" className="block text-sm font-medium text-slate-700">
            Billing period
          </label>
          <input
            id="billingPeriod"
            name="billingPeriod"
            type="text"
            defaultValue={plan?.billingPeriod ?? ""}
            placeholder="month"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="tagline" className="block text-sm font-medium text-slate-700">
          Tagline
        </label>
        <input
          id="tagline"
          name="tagline"
          type="text"
          defaultValue={plan?.tagline ?? ""}
          placeholder="For clubs just getting started"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="features" className="block text-sm font-medium text-slate-700">
          Features (one per line)
        </label>
        <textarea
          id="features"
          name="features"
          rows={6}
          defaultValue={featureLines}
          placeholder={"Unlimited listings\nDirect messaging\nVerified badge"}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700">
          Sort order
        </label>
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          defaultValue={plan?.sortOrder ?? 0}
          className="mt-1 w-24 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-slate-400">Lower numbers show first on the public pricing page.</p>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="isFeatured" defaultChecked={plan?.isFeatured} className="rounded border-slate-300" />
          Featured (highlighted plan)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={plan?.isActive ?? true}
            className="rounded border-slate-300"
          />
          Visible on public pricing page
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

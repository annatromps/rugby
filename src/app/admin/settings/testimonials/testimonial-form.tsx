"use client";

import { useActionState } from "react";
import type { TestimonialFormState } from "@/app/actions/testimonials";

type Testimonial = {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string | null;
  isActive: boolean;
  sortOrder: number;
};

export function TestimonialForm({
  action,
  testimonial,
  submitLabel,
}: {
  action: (state: TestimonialFormState, formData: FormData) => Promise<TestimonialFormState>;
  testimonial?: Testimonial;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div>
        <label htmlFor="quote" className="block text-sm font-medium text-slate-700">
          Quote
        </label>
        <textarea
          id="quote"
          name="quote"
          rows={4}
          required
          defaultValue={testimonial?.quote}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        {state?.fieldErrors?.quote && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.quote[0]}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="authorName" className="block text-sm font-medium text-slate-700">
            Author name
          </label>
          <input
            id="authorName"
            name="authorName"
            type="text"
            required
            defaultValue={testimonial?.authorName}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {state?.fieldErrors?.authorName && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.authorName[0]}</p>
          )}
        </div>
        <div>
          <label htmlFor="authorRole" className="block text-sm font-medium text-slate-700">
            Author role
          </label>
          <input
            id="authorRole"
            name="authorRole"
            type="text"
            defaultValue={testimonial?.authorRole ?? ""}
            placeholder="Club coach"
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="sortOrder" className="block text-sm font-medium text-slate-700">
          Sort order
        </label>
        <input
          id="sortOrder"
          name="sortOrder"
          type="number"
          defaultValue={testimonial?.sortOrder ?? 0}
          className="mt-1 w-24 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={testimonial?.isActive ?? true}
          className="rounded border-slate-300"
        />
        Visible on homepage
      </label>

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

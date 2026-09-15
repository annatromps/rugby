"use client";

import { useActionState, useState } from "react";
import { updateEmailTemplate } from "@/app/actions/email-templates";
import { templateVariablesFor } from "@/lib/email-templates";
import { VariableReference } from "../variable-reference";
import type { emailTemplates } from "@/lib/db/schema";

type Template = typeof emailTemplates.$inferSelect;

export function EditTemplateForm({ template }: { template: Template }) {
  const [targetType, setTargetType] = useState<"CLUB" | "PLAYER">(template.targetType);
  const boundUpdate = updateEmailTemplate.bind(null, template.id);
  const [state, action, pending] = useActionState(boundUpdate, undefined);

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Edit email template</h1>

      <form action={action} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <div>
          <label className="block text-sm font-medium text-slate-700">Applies to</label>
          <select
            name="targetType"
            value={targetType}
            onChange={(e) => setTargetType(e.target.value as "CLUB" | "PLAYER")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="CLUB">Clubs</option>
            <option value="PLAYER">Players</option>
          </select>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Template name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={template.name}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {state?.fieldErrors?.name && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name[0]}</p>}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            defaultValue={template.subject}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
          {state?.fieldErrors?.subject && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.subject[0]}</p>}
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-slate-700">
            Body
          </label>
          <textarea
            id="body"
            name="body"
            rows={10}
            required
            defaultValue={template.body}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono text-[13px]"
          />
          {state?.fieldErrors?.body && <p className="mt-1 text-xs text-red-600">{state.fieldErrors.body[0]}</p>}
        </div>

        <VariableReference variables={templateVariablesFor(targetType)} />

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="isDefault" defaultChecked={template.isDefault} className="rounded border-slate-300" />
          Make this the default {targetType.toLowerCase()} template
        </label>

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

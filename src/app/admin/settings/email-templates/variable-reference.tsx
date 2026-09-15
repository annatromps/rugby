import type { TemplateVariable } from "@/lib/email-templates";

// Shown under the subject/body fields on both the new and edit template
// forms, so the admin can see exactly which {{tags}} are available for
// whichever target type (club/player) they've selected, without having to
// remember or guess the variable names.
export function VariableReference({ variables }: { variables: TemplateVariable[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Available variables</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {variables.map((v) => (
          <span
            key={v.key}
            title={`e.g. "${v.example}"`}
            className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px] text-slate-600 shadow-sm ring-1 ring-slate-200"
          >
            {`{{${v.key}}}`} <span className="text-slate-400">— {v.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

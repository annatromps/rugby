"use client";

import { useMemo, useState } from "react";
import { renderTemplate } from "@/lib/email-templates";

type TemplateOption = { id: string; name: string; subject: string; body: string; isDefault: boolean };

// A per-row "Email" button on the clubs/players admin tables (and detail
// pages). Renders the admin's chosen template with this entity's variables
// filled in, lets them tweak subject/body, then hands off to a mailto:
// link -- whatever the browser/OS has registered as the default mail app
// (Outlook, Gmail via a registered handler, Mail.app, etc). Nothing is
// ever sent from the server; this is just a fast way to start a draft.
export function EmailComposeButton({
  recipientEmail,
  recipientLabel,
  templates,
  variables,
}: {
  recipientEmail: string | null | undefined;
  recipientLabel: string;
  templates: TemplateOption[];
  variables: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const defaultTemplate = useMemo(
    () => templates.find((t) => t.isDefault) ?? templates[0],
    [templates],
  );
  const [templateId, setTemplateId] = useState(defaultTemplate?.id);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState<"subject" | "body" | null>(null);

  function openModal() {
    const tpl = templates.find((t) => t.id === templateId) ?? defaultTemplate;
    setSubject(tpl ? renderTemplate(tpl.subject, variables) : "");
    setBody(tpl ? renderTemplate(tpl.body, variables) : "");
    setOpen(true);
  }

  function applyTemplate(id: string) {
    setTemplateId(id);
    const tpl = templates.find((t) => t.id === id);
    setSubject(tpl ? renderTemplate(tpl.subject, variables) : "");
    setBody(tpl ? renderTemplate(tpl.body, variables) : "");
  }

  if (templates.length === 0) {
    return (
      <span className="text-xs text-slate-400" title="Create a template first under Email Templates">
        No template
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        disabled={!recipientEmail}
        title={recipientEmail ? undefined : "No email address on file"}
        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Email
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Email {recipientLabel}</h2>
                <p className="mt-0.5 text-xs text-slate-500">To: {recipientEmail}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {templates.length > 1 && (
              <div className="mb-3">
                <label className="block text-xs font-medium text-slate-500">Template</label>
                <select
                  value={templateId}
                  onChange={(e) => applyTemplate(e.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                      {t.isDefault ? " (default)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-3">
              <label className="block text-xs font-medium text-slate-500">Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-500">Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={10}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`mailto:${encodeURIComponent(recipientEmail ?? "")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
                onClick={() => setOpen(false)}
                className="rounded-md bg-brand-navy px-3 py-2 text-sm font-semibold text-white hover:bg-brand-navy-dark"
              >
                Open in email app
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(subject);
                  setCopied("subject");
                  setTimeout(() => setCopied(null), 1500);
                }}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                {copied === "subject" ? "Copied!" : "Copy subject"}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(body);
                  setCopied("body");
                  setTimeout(() => setCopied(null), 1500);
                }}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                {copied === "body" ? "Copied!" : "Copy body"}
              </button>
              <p className="ml-auto text-[11px] text-slate-400">
                Opens your default mail app (Outlook, Gmail, etc.). Long drafts may get cut off by some
                mail clients &mdash; use Copy body if so.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

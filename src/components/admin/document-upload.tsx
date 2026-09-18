"use client";

import { useRef, useState, useTransition } from "react";

// Generic file upload widget for a player's application documents
// (passport, CV, cover letter) -- mirrors PhotoUpload's shape but shows a
// filename + download link instead of a thumbnail, since these are PDFs
// or scans rather than something you'd preview inline.
export function DocumentUpload({
  id,
  kind,
  currentUrl,
  currentFileName,
  label,
  onUpload,
  onRemove,
}: {
  id: string;
  kind: string;
  currentUrl: string | null;
  currentFileName: string | null;
  label: string;
  onUpload: (id: string, kind: string, formData: FormData) => Promise<{ error?: string } | void>;
  onRemove: (id: string, kind: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const formData = new FormData();
    formData.set("document", file);
    startTransition(async () => {
      const result = await onUpload(id, kind, formData);
      if (result?.error) setError(result.error);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {currentUrl ? (
          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-0.5 block truncate text-xs text-brand-navy underline"
          >
            {currentFileName || "View file"}
          </a>
        ) : (
          <p className="mt-0.5 text-xs text-slate-400">Not uploaded</p>
        )}
        {error && <p className="mt-0.5 text-xs text-red-600">{error}</p>}
        {isPending && <p className="mt-0.5 text-xs text-slate-400">Uploading…</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          disabled={isPending}
          onChange={handleFileChange}
          className="w-36 text-xs text-slate-600 file:mr-1.5 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200 disabled:opacity-60"
        />
        {currentUrl && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => onRemove(id, kind))}
            className="shrink-0 text-xs text-slate-500 underline hover:text-red-600 disabled:opacity-60"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

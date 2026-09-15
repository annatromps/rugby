"use client";

import { useRef, useState, useTransition } from "react";

// Generic image upload widget shared by players/coaches (headshot) and
// clubs (crest) -- entity-specific wrapper components bind `onUpload`/
// `onRemove` to that entity's server action, mirroring the pattern used
// by StatusSelect/PublishToggle elsewhere in the admin.
export function PhotoUpload({
  id,
  currentUrl,
  label,
  shape = "circle",
  onUpload,
  onRemove,
}: {
  id: string;
  currentUrl: string | null;
  label: string;
  shape?: "circle" | "square";
  onUpload: (id: string, formData: FormData) => Promise<{ error?: string } | void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-lg";

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    const formData = new FormData();
    formData.set("photo", file);
    startTransition(async () => {
      const result = await onUpload(id, formData);
      if (result?.error) setError(result.error);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  return (
    <div className="flex items-center gap-4">
      {currentUrl ? (
        // Admin thumbnail only -- plain <img> avoids fixed-size layout
        // requirements next/image imposes for a widget this small.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentUrl}
          alt=""
          className={`h-16 w-16 shrink-0 border border-slate-200 object-cover ${shapeClass}`}
        />
      ) : (
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center border border-dashed border-slate-300 text-center text-[10px] leading-tight text-slate-400 ${shapeClass}`}
        >
          No {label.toLowerCase()}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          disabled={isPending}
          onChange={handleFileChange}
          className="text-xs text-slate-600 file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200 disabled:opacity-60"
        />
        {isPending && <span className="text-xs text-slate-400">Uploading…</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}
        {currentUrl && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => onRemove(id))}
            className="w-fit text-xs text-slate-500 underline hover:text-red-600 disabled:opacity-60"
          >
            Remove {label.toLowerCase()}
          </button>
        )}
      </div>
    </div>
  );
}

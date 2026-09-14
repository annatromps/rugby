"use client";

import { useTransition } from "react";

export function VerifiedToggle({
  id,
  isVerified,
  onChange,
}: {
  id: string;
  isVerified: boolean;
  onChange: (id: string, next: boolean) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => onChange(id, !isVerified))}
      title={isVerified ? "Marked as verified — click to remove" : "Not verified — click to mark as checked"}
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium disabled:opacity-60 ${
        isVerified
          ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
      }`}
    >
      {isVerified && (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {isVerified ? "Verified" : "Not verified"}
    </button>
  );
}

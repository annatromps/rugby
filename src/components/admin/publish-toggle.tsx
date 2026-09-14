"use client";

import { useTransition } from "react";

export function PublishToggle({
  id,
  isPublished,
  onChange,
}: {
  id: string;
  isPublished: boolean;
  onChange: (id: string, next: boolean) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => onChange(id, !isPublished))}
      title={isPublished ? "Visible on the public site — click to unpublish" : "Hidden from the public site — click to publish"}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium disabled:opacity-60 ${
        isPublished
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
      }`}
    >
      {isPublished ? "Live" : "Pending review"}
    </button>
  );
}

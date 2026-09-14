"use client";

import { useTransition } from "react";
import { updateAccommodationStatus } from "@/app/actions/players";

const STATUS_OPTIONS = ["REQUESTED", "SEARCHING", "OPTIONS_SENT", "BOOKED", "NOT_NEEDED"] as const;

export function AccommodationStatusSelect({
  requestId,
  playerId,
  status,
}: {
  requestId: string;
  playerId: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(() => updateAccommodationStatus(requestId, playerId, next));
      }}
      className="rounded-md border border-slate-300 px-2 py-1 text-xs disabled:opacity-60"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s.replace("_", " ").toLowerCase()}
        </option>
      ))}
    </select>
  );
}

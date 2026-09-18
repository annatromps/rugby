"use client";

import { useTransition } from "react";
import { updateServiceRequestStatus } from "@/app/actions/services";
import { serviceRequestStatusEnum } from "@/lib/db/schema";

type Status = (typeof serviceRequestStatusEnum.enumValues)[number];

export function ServiceStatusSelect({ id, status }: { id: string; status: Status }) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as Status;
        startTransition(() => {
          updateServiceRequestStatus(id, next);
        });
      }}
      className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 disabled:opacity-60"
    >
      {serviceRequestStatusEnum.enumValues.map((s) => (
        <option key={s} value={s}>
          {s.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}

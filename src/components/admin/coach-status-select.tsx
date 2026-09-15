"use client";

import { StatusSelect } from "./status-select";
import { updateCoachStatus } from "@/app/actions/coaches";

export function CoachStatusSelect({ coachId, status }: { coachId: string; status: string }) {
  return (
    <StatusSelect
      id={coachId}
      status={status}
      onChange={(id, next) => updateCoachStatus(id, next)}
    />
  );
}

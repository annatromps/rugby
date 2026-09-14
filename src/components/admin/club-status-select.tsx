"use client";

import { StatusSelect } from "./status-select";
import { updateClubStatus } from "@/app/actions/clubs";

export function ClubStatusSelect({ clubId, status }: { clubId: string; status: string }) {
  return (
    <StatusSelect
      id={clubId}
      status={status}
      onChange={(id, next) => updateClubStatus(id, next)}
    />
  );
}

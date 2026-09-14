"use client";

import { StatusSelect } from "./status-select";
import { updatePlayerStatus } from "@/app/actions/players";

export function PlayerStatusSelect({ playerId, status }: { playerId: string; status: string }) {
  return (
    <StatusSelect
      id={playerId}
      status={status}
      onChange={(id, next) => updatePlayerStatus(id, next)}
    />
  );
}

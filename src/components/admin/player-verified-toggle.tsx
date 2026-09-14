"use client";

import { VerifiedToggle } from "./verified-toggle";
import { setPlayerVerified } from "@/app/actions/players";

export function PlayerVerifiedToggle({ playerId, isVerified }: { playerId: string; isVerified: boolean }) {
  return (
    <VerifiedToggle
      id={playerId}
      isVerified={isVerified}
      onChange={(id, next) => setPlayerVerified(id, next)}
    />
  );
}

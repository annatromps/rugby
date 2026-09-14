"use client";

import { VerifiedToggle } from "./verified-toggle";
import { setClubVerified } from "@/app/actions/clubs";

export function ClubVerifiedToggle({ clubId, isVerified }: { clubId: string; isVerified: boolean }) {
  return (
    <VerifiedToggle
      id={clubId}
      isVerified={isVerified}
      onChange={(id, next) => setClubVerified(id, next)}
    />
  );
}

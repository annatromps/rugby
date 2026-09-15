"use client";

import { VerifiedToggle } from "./verified-toggle";
import { setCoachVerified } from "@/app/actions/coaches";

export function CoachVerifiedToggle({ coachId, isVerified }: { coachId: string; isVerified: boolean }) {
  return (
    <VerifiedToggle
      id={coachId}
      isVerified={isVerified}
      onChange={(id, next) => setCoachVerified(id, next)}
    />
  );
}

"use client";

import { PublishToggle } from "./publish-toggle";
import { setCoachPublished } from "@/app/actions/coaches";

export function CoachPublishToggle({ coachId, isPublished }: { coachId: string; isPublished: boolean }) {
  return (
    <PublishToggle
      id={coachId}
      isPublished={isPublished}
      onChange={(id, next) => setCoachPublished(id, next)}
    />
  );
}

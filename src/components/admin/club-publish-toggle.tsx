"use client";

import { PublishToggle } from "./publish-toggle";
import { setClubPublished } from "@/app/actions/clubs";

export function ClubPublishToggle({ clubId, isPublished }: { clubId: string; isPublished: boolean }) {
  return (
    <PublishToggle
      id={clubId}
      isPublished={isPublished}
      onChange={(id, next) => setClubPublished(id, next)}
    />
  );
}

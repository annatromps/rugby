"use client";

import { PublishToggle } from "./publish-toggle";
import { setPlayerPublished } from "@/app/actions/players";

export function PlayerPublishToggle({ playerId, isPublished }: { playerId: string; isPublished: boolean }) {
  return (
    <PublishToggle
      id={playerId}
      isPublished={isPublished}
      onChange={(id, next) => setPlayerPublished(id, next)}
    />
  );
}

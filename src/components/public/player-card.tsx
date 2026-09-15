import Link from "next/link";
import { LevelBadge } from "./level-badge";
import { VerifiedBadge } from "./verified-badge";
import { Avatar } from "./avatar";
import { fuzzName } from "@/lib/fuzz-name";
import type { players } from "@/lib/db/schema";

type Player = typeof players.$inferSelect;

export function PlayerCard({ player, loggedIn }: { player: Player; loggedIn: boolean }) {
  const displayName = loggedIn ? `${player.firstName} ${player.lastName}` : fuzzName(player.firstName, player.lastName);
  return (
    <Link
      href={`/players/${player.id}`}
      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-navy/40 hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
        <div className="flex items-center gap-3">
          <Avatar
            src={loggedIn ? player.photoUrl : null}
            alt={displayName}
            initials={`${player.firstName[0] ?? ""}${player.lastName[0] ?? ""}`}
            size={44}
          />
          <h3 className="flex items-center gap-2 font-semibold text-slate-900">
            {displayName}
            {player.isVerified && <VerifiedBadge />}
          </h3>
        </div>
        <LevelBadge level={player.level} />
      </div>
      <p className="text-sm font-medium text-brand-coral">
        {player.position}
        {player.secondaryPosition ? ` / ${player.secondaryPosition}` : ""}
      </p>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {player.currentCountry && <span>📍 {player.currentCountry}</span>}
        {player.nationality && player.nationality !== player.currentCountry && (
          <span>{player.nationality}</span>
        )}
        {typeof player.yearsExperience === "number" && (
          <span>{player.yearsExperience} yrs experience</span>
        )}
      </div>
    </Link>
  );
}

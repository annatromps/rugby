import Link from "next/link";
import { LevelBadge } from "./level-badge";
import { VerifiedBadge } from "./verified-badge";
import type { players } from "@/lib/db/schema";

type Player = typeof players.$inferSelect;

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Link
      href={`/players/${player.id}`}
      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-navy/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="flex items-center gap-2 font-semibold text-slate-900">
          {player.firstName} {player.lastName}
          {player.isVerified && <VerifiedBadge />}
        </h3>
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

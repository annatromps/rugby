import Link from "next/link";
import { LevelBadge } from "./level-badge";
import { VerifiedBadge } from "./verified-badge";
import { Avatar } from "./avatar";
import { isDemoName } from "@/lib/is-demo";
import type { players } from "@/lib/db/schema";

type Player = typeof players.$inferSelect;

export function PlayerCard({ player, loggedIn }: { player: Player; loggedIn: boolean }) {
  const isDemo = isDemoName(player.lastName);
  // A signed-out visitor sees no part of a real player's name -- only a
  // demo/placeholder row (which has nobody's privacy to protect) shows
  // its fabricated photo before sign-in; a real photo stays gated too.
  const canReveal = loggedIn || isDemo;
  const fullName = `${player.firstName} ${player.lastName}`;
  return (
    <Link
      href={`/players/${player.id}`}
      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-navy/40 hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
        <div className="flex items-center gap-3">
          <Avatar
            src={canReveal ? player.photoUrl : null}
            alt={loggedIn ? fullName : "Rugby player"}
            initials={`${player.firstName[0] ?? ""}${player.lastName[0] ?? ""}`}
            anonymous={!loggedIn}
            size={44}
          />
          {loggedIn ? (
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              {fullName}
              {player.isVerified && <VerifiedBadge />}
            </h3>
          ) : (
            <h3 className="flex items-center gap-2 text-sm italic text-slate-400">
              Sign in to see name
              {player.isVerified && <VerifiedBadge />}
            </h3>
          )}
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

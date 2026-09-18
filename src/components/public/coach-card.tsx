import Link from "next/link";
import { VerifiedBadge } from "./verified-badge";
import { Avatar } from "./avatar";
import { isDemoName } from "@/lib/is-demo";
import type { coaches } from "@/lib/db/schema";

type Coach = typeof coaches.$inferSelect;

export function CoachCard({ coach, loggedIn }: { coach: Coach; loggedIn: boolean }) {
  const isDemo = isDemoName(coach.lastName);
  // See the matching comment in player-card.tsx: signed-out visitors get
  // no part of a real coach's name, but a demo row's fake photo is safe
  // to show right away since there's no real person behind it.
  const canReveal = loggedIn || isDemo;
  const fullName = `${coach.firstName} ${coach.lastName}`;
  return (
    <Link
      href={`/coaches/${coach.id}`}
      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-navy/40 hover:shadow-md"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
        <div className="flex items-center gap-3">
          <Avatar
            src={canReveal ? coach.photoUrl : null}
            alt={loggedIn ? fullName : "Rugby coach"}
            initials={`${coach.firstName[0] ?? ""}${coach.lastName[0] ?? ""}`}
            anonymous={!loggedIn}
            size={44}
          />
          {loggedIn ? (
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              {fullName}
              {coach.isVerified && <VerifiedBadge />}
            </h3>
          ) : (
            <h3 className="flex items-center gap-2 text-sm italic text-slate-400">
              Sign in to see name
              {coach.isVerified && <VerifiedBadge />}
            </h3>
          )}
        </div>
        {coach.coachingLevel && (
          <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
            {coach.coachingLevel}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-brand-coral">{coach.specialization}</p>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {coach.currentCountry && <span>📍 {coach.currentCountry}</span>}
        {coach.nationality && coach.nationality !== coach.currentCountry && <span>{coach.nationality}</span>}
        {typeof coach.yearsExperience === "number" && <span>{coach.yearsExperience} yrs experience</span>}
      </div>
    </Link>
  );
}

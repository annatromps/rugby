import Link from "next/link";
import { LevelBadge } from "./level-badge";
import type { clubs } from "@/lib/db/schema";

type Club = typeof clubs.$inferSelect;

export function ClubCard({ club, openPositions }: { club: Club; openPositions: number }) {
  return (
    <Link
      href={`/clubs/${club.id}`}
      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-navy/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{club.name}</h3>
        <LevelBadge level={club.level} />
      </div>
      <p className="text-sm text-slate-500">
        {[club.region, club.country].filter(Boolean).join(", ")}
        {club.league ? ` · ${club.league}` : ""}
      </p>
      {openPositions > 0 && (
        <span className="mt-1 inline-flex w-fit items-center rounded-full bg-brand-coral/10 px-2.5 py-0.5 text-xs font-medium text-brand-coral-dark">
          {openPositions} open position{openPositions === 1 ? "" : "s"}
        </span>
      )}
    </Link>
  );
}

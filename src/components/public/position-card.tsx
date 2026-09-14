import Link from "next/link";
import { LevelBadge } from "./level-badge";

export function PositionCard({
  position,
}: {
  position: {
    id: string;
    position: string;
    level: string | null;
    notes: string | null;
    openSince: Date;
    clubId: string;
    clubName: string;
    clubCountry: string;
    clubRegion: string | null;
    clubLeague: string | null;
  };
}) {
  return (
    <Link
      href={`/clubs/${position.clubId}`}
      className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-navy/40 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{position.position}</h3>
        <LevelBadge level={position.level} />
      </div>
      <p className="text-sm font-medium text-brand-navy">{position.clubName}</p>
      <p className="text-sm text-slate-500">
        {[position.clubRegion, position.clubCountry].filter(Boolean).join(", ")}
        {position.clubLeague ? ` · ${position.clubLeague}` : ""}
      </p>
      {position.notes && <p className="text-sm text-slate-600 line-clamp-2">{position.notes}</p>}
      <p className="mt-1 text-xs text-slate-400">
        Open since {new Date(position.openSince).toLocaleDateString()}
      </p>
    </Link>
  );
}

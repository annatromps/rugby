import { PLAYER_LEVEL_LABELS } from "@/lib/constants";

export function LevelBadge({ level }: { level: string | null }) {
  if (!level) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-brand-navy/10 px-2.5 py-0.5 text-xs font-medium text-brand-navy">
      {PLAYER_LEVEL_LABELS[level] ?? level}
    </span>
  );
}

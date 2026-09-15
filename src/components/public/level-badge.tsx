import { PLAYER_LEVEL_LABELS } from "@/lib/constants";

// Colour deepens as level rises, so the tier reads at a glance instead of
// every card wearing the same pale pill.
const LEVEL_STYLES: Record<string, string> = {
  COMMUNITY: "bg-slate-100 text-slate-600",
  AMATEUR_LEAGUE: "bg-brand-navy/10 text-brand-navy",
  SEMI_PRO: "bg-sky-100 text-sky-700",
  PROFESSIONAL: "bg-amber-100 text-amber-800",
  INTERNATIONAL: "bg-brand-coral text-white",
};

export function LevelBadge({ level }: { level: string | null }) {
  if (!level) return null;
  const styles = LEVEL_STYLES[level] ?? "bg-brand-navy/10 text-brand-navy";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {PLAYER_LEVEL_LABELS[level] ?? level}
    </span>
  );
}

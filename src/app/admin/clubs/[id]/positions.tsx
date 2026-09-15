import { addPositionNeed, togglePositionFilled } from "@/app/actions/clubs";
import { PLAYER_LEVELS, PLAYER_LEVEL_LABELS } from "@/lib/constants";
import type { positionNeeds } from "@/lib/db/schema";

type PositionNeed = typeof positionNeeds.$inferSelect;

export function PositionsList({ clubId, needs }: { clubId: string; needs: PositionNeed[] }) {
  if (needs.length === 0) {
    return <p className="mb-3 text-sm text-slate-400">No open positions logged yet.</p>;
  }

  return (
    <ul className="mb-4 divide-y divide-slate-100 text-sm">
      {needs.map((need) => {
        const toggle = togglePositionFilled.bind(null, need.id, clubId, !need.filled);
        return (
          <li key={need.id} className="flex items-center justify-between py-2">
            <div>
              <span className={need.filled ? "text-slate-400 line-through" : "text-slate-800"}>
                {need.position}
              </span>
              {need.level && (
                <span className="ml-2 text-xs text-slate-400">
                  {PLAYER_LEVEL_LABELS[need.level]}
                </span>
              )}
            </div>
            <form action={toggle}>
              <button
                type="submit"
                className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                {need.filled ? "Mark open" : "Mark filled"}
              </button>
            </form>
          </li>
        );
      })}
    </ul>
  );
}

export function AddPositionForm({ clubId }: { clubId: string }) {
  async function action(formData: FormData) {
    "use server";
    await addPositionNeed(clubId, formData);
  }
  return (
    <form action={action} className="flex flex-wrap items-end gap-2 border-t border-slate-100 pt-3">
      <div className="flex-1 min-w-[160px]">
        <label className="block text-xs font-medium text-slate-500">Position</label>
        <input
          name="position"
          required
          placeholder="e.g. Tighthead prop"
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500">Level</label>
        <select name="level" className="mt-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm">
          <option value="">Any</option>
          {PLAYER_LEVELS.map((level) => (
            <option key={level} value={level}>
              {PLAYER_LEVEL_LABELS[level]}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Add position
      </button>
    </form>
  );
}

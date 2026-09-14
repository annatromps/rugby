import { requestAccommodation } from "@/app/actions/players";
import { AccommodationStatusSelect } from "@/components/admin/accommodation-status-select";
import type { accommodationRequests } from "@/lib/db/schema";

type AccommodationRequest = typeof accommodationRequests.$inferSelect;

export function AccommodationList({
  playerId,
  requests,
}: {
  playerId: string;
  requests: AccommodationRequest[];
}) {
  return (
    <div>
      {requests.length === 0 ? (
        <p className="mb-3 text-sm text-slate-400">No accommodation request logged yet.</p>
      ) : (
        <ul className="mb-4 space-y-3 text-sm">
          {requests.map((req) => (
            <li key={req.id} className="flex items-center justify-between border-b border-slate-50 pb-2">
              <div>
                <p className="text-slate-800">{req.city || "City not specified"}</p>
                {req.moveInDate && (
                  <p className="text-xs text-slate-400">
                    Move in: {new Date(req.moveInDate).toLocaleDateString()}
                  </p>
                )}
                {req.notes && <p className="text-xs text-slate-500">{req.notes}</p>}
              </div>
              <AccommodationStatusSelect requestId={req.id} playerId={playerId} status={req.status} />
            </li>
          ))}
        </ul>
      )}

      <form
        action={async (formData: FormData) => {
          "use server";
          await requestAccommodation(playerId, formData);
        }}
        className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-sm"
      >
        <div>
          <label className="block text-xs font-medium text-slate-500">City</label>
          <input name="city" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">Move-in date</label>
          <input type="date" name="moveInDate" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-500">Notes</label>
          <input name="notes" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm" />
        </div>
        <div className="col-span-2">
          <button
            type="submit"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Log accommodation request
          </button>
        </div>
      </form>
    </div>
  );
}

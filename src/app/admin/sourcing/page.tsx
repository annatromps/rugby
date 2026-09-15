import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sourcingSearches, sourcingSuggestions } from "@/lib/db/schema";
import { SearchForm } from "./search-form";
import { SuggestionCard } from "./suggestion-card";

export default async function SourcingPage() {
  const searches = await db
    .select()
    .from(sourcingSearches)
    .orderBy(desc(sourcingSearches.createdAt))
    .limit(10);

  const searchesWithSuggestions = await Promise.all(
    searches.map(async (search) => ({
      search,
      suggestions: await db
        .select()
        .from(sourcingSuggestions)
        .where(eq(sourcingSuggestions.searchId, search.id)),
    })),
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">AI-assisted sourcing</h1>
        <p className="mt-1 text-sm text-slate-500">
          Describe the kind of club or player you&apos;re trying to find. Claude searches the web and proposes
          candidates for you to review, you decide what gets added.
        </p>
      </div>

      <SearchForm />

      <div className="space-y-6">
        {searchesWithSuggestions.length === 0 && (
          <p className="text-sm text-slate-400">No searches run yet.</p>
        )}
        {searchesWithSuggestions.map(({ search, suggestions }) => (
          <div key={search.id} className="space-y-3">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-medium text-slate-700">&quot;{search.query}&quot;</p>
              <p className="text-xs text-slate-400">
                {new Date(search.createdAt).toLocaleString()}
              </p>
            </div>
            {suggestions.length === 0 ? (
              <p className="text-sm text-slate-400">No candidates found for this search.</p>
            ) : (
              <div className="space-y-2">
                {suggestions.map((s) => (
                  <SuggestionCard
                    key={s.id}
                    suggestion={{
                      id: s.id,
                      name: s.name,
                      summary: s.summary,
                      sourceUrl: s.sourceUrl,
                      reviewStatus: s.reviewStatus,
                      targetType: s.targetType,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

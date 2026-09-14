"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { sourcingSearches, sourcingSuggestions, clubs, players } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { runSourcingSearch, MissingApiKeyError } from "@/lib/ai/sourcing";

const SearchSchema = z.object({
  targetType: z.enum(["CLUB", "PLAYER"]),
  brief: z.string().trim().min(10, "Describe what you're looking for in a bit more detail."),
});

export type SearchFormState = { error?: string } | undefined;

export async function runSearch(
  _prevState: SearchFormState,
  formData: FormData,
): Promise<SearchFormState> {
  const admin = await requireAdmin();

  const parsed = SearchSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid search." };
  }

  const { targetType, brief } = parsed.data;

  try {
    const candidates = await runSourcingSearch(targetType, brief);

    const [search] = await db
      .insert(sourcingSearches)
      .values({ targetType, query: brief, runByEmail: admin.email })
      .returning({ id: sourcingSearches.id });

    if (candidates.length > 0) {
      await db.insert(sourcingSuggestions).values(
        candidates.map((c) => ({
          searchId: search.id,
          targetType,
          name: c.name,
          summary: c.summary,
          sourceUrl: c.sourceUrl,
          rawData: c.rawData ?? null,
        })),
      );
    }
  } catch (err) {
    if (err instanceof MissingApiKeyError) {
      return { error: err.message };
    }
    console.error("Sourcing search failed:", err);
    return { error: "The search failed. Check the server logs for details." };
  }

  revalidatePath("/admin/sourcing");
}

export async function rejectSuggestion(suggestionId: string) {
  await requireAdmin();
  await db
    .update(sourcingSuggestions)
    .set({ reviewStatus: "REJECTED" })
    .where(eq(sourcingSuggestions.id, suggestionId));
  revalidatePath("/admin/sourcing");
}

// Turns a suggestion into a real Club or Player record, so it enters the
// normal pipeline (status, contact log, etc).
export async function acceptSuggestion(suggestionId: string) {
  await requireAdmin();

  const [suggestion] = await db
    .select()
    .from(sourcingSuggestions)
    .where(eq(sourcingSuggestions.id, suggestionId))
    .limit(1);

  if (!suggestion) return;

  if (suggestion.targetType === "CLUB") {
    const [club] = await db
      .insert(clubs)
      .values({
        name: suggestion.name,
        country: "Unknown", // admin should fill this in on the club's page
        notes: suggestion.summary,
        source: "AI_SEARCH",
        sourceDetail: suggestion.sourceUrl ?? undefined,
      })
      .returning({ id: clubs.id });

    await db
      .update(sourcingSuggestions)
      .set({ reviewStatus: "ACCEPTED", promotedClubId: club.id })
      .where(eq(sourcingSuggestions.id, suggestionId));
  } else {
    const [firstName, ...rest] = suggestion.name.split(" ");
    const [player] = await db
      .insert(players)
      .values({
        firstName: firstName || suggestion.name,
        lastName: rest.join(" ") || "-",
        position: "Unknown", // admin should fill this in on the player's page
        notes: suggestion.summary,
        source: "AI_SEARCH",
        sourceDetail: suggestion.sourceUrl ?? undefined,
      })
      .returning({ id: players.id });

    await db
      .update(sourcingSuggestions)
      .set({ reviewStatus: "ACCEPTED", promotedPlayerId: player.id })
      .where(eq(sourcingSuggestions.id, suggestionId));
  }

  revalidatePath("/admin/sourcing");
  revalidatePath("/admin/clubs");
  revalidatePath("/admin/players");
}

"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { sourcingSearches, sourcingSuggestions, clubs, players, coaches } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/dal";
import { runSourcingSearch, MissingApiKeyError, SOURCING_LEVEL_VALUES } from "@/lib/ai/sourcing";

const SearchSchema = z.object({
  targetType: z.enum(["CLUB", "PLAYER", "COACH"]),
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
        candidates.map((c) => {
          // Structured fields the AI extracted (country, level, position,
          // contact info, etc.) are folded into rawData here since the
          // suggestions table only has one jsonb column to hold them --
          // acceptSuggestion() reads them back out of rawData to
          // autopopulate the real club/player record.
          const {
            name: _name,
            summary: _summary,
            sourceUrl: _sourceUrl,
            rawData: _rawData,
            ...structured
          } = c;
          return {
            searchId: search.id,
            targetType,
            name: c.name,
            summary: c.summary,
            sourceUrl: c.sourceUrl,
            rawData: { ...structured, ...(c.rawData ?? {}) },
          };
        }),
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

  // The AI sourcing search extracts structured fields when it found real
  // evidence for them (see src/lib/ai/sourcing.ts); rawData carries those
  // through from the search. Fall back to a clearly-marked placeholder
  // only when nothing was found, so the admin knows what still needs
  // filling in by hand -- rather than every accepted suggestion silently
  // getting "Unknown".
  const raw = (suggestion.rawData ?? {}) as Record<string, unknown>;
  const str = (key: string) =>
    typeof raw[key] === "string" && raw[key] ? (raw[key] as string) : undefined;
  const num = (key: string) =>
    typeof raw[key] === "number" ? (raw[key] as number) : undefined;
  const level = (() => {
    const v = str("level");
    return v && (SOURCING_LEVEL_VALUES as readonly string[]).includes(v)
      ? (v as (typeof SOURCING_LEVEL_VALUES)[number])
      : undefined;
  })();

  if (suggestion.targetType === "CLUB") {
    const [club] = await db
      .insert(clubs)
      .values({
        name: suggestion.name,
        country: str("country") ?? "Unknown", // admin should fill this in if still missing
        region: str("region"),
        league: str("league"),
        level,
        website: str("website"),
        contactEmail: str("contactEmail"),
        contactPhone: str("contactPhone"),
        notes: suggestion.summary,
        source: "AI_SEARCH",
        sourceDetail: suggestion.sourceUrl ?? undefined,
      })
      .returning({ id: clubs.id });

    await db
      .update(sourcingSuggestions)
      .set({ reviewStatus: "ACCEPTED", promotedClubId: club.id })
      .where(eq(sourcingSuggestions.id, suggestionId));
  } else if (suggestion.targetType === "COACH") {
    const [firstName, ...rest] = suggestion.name.split(" ");
    const [coach] = await db
      .insert(coaches)
      .values({
        firstName: firstName || suggestion.name,
        lastName: rest.join(" ") || "-",
        email: str("contactEmail"),
        phone: str("contactPhone"),
        nationality: str("nationality"),
        currentCountry: str("currentCountry"),
        specialization: str("specialization") ?? "Unknown", // admin should fill this in if still missing
        coachingLevel: str("coachingLevel"),
        currentClub: str("currentClub"),
        yearsExperience: num("yearsExperience"),
        notes: suggestion.summary,
        source: "AI_SEARCH",
        sourceDetail: suggestion.sourceUrl ?? undefined,
      })
      .returning({ id: coaches.id });

    await db
      .update(sourcingSuggestions)
      .set({ reviewStatus: "ACCEPTED", promotedCoachId: coach.id })
      .where(eq(sourcingSuggestions.id, suggestionId));
  } else {
    const [firstName, ...rest] = suggestion.name.split(" ");
    const [player] = await db
      .insert(players)
      .values({
        firstName: firstName || suggestion.name,
        lastName: rest.join(" ") || "-",
        email: str("contactEmail"),
        phone: str("contactPhone"),
        nationality: str("nationality"),
        currentCountry: str("currentCountry"),
        position: str("position") ?? "Unknown", // admin should fill this in if still missing
        secondaryPosition: str("secondaryPosition"),
        level,
        currentClub: str("currentClub"),
        yearsExperience: num("yearsExperience"),
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
  revalidatePath("/admin/coaches");
}

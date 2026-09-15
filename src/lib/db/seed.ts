// Populates the database with realistic-looking demo data so the app is
// browsable without a live Anthropic API key. Safe to run multiple times on
// a dev database; not intended for production use.
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { clubs, players, positionNeeds, contactLogs, sourcingSearches, sourcingSuggestions } from "./schema";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  console.log("Seeding demo data...");

  const [dragons] = await db
    .insert(clubs)
    .values({
      name: "Cardiff Dragons RFC",
      country: "Wales",
      region: "Cardiff",
      league: "WRU Championship",
      level: "SEMI_PRO",
      website: "https://example.com/cardiff-dragons",
      contactName: "Sam Rees",
      contactEmail: "sam@example.com",
      status: "IN_TALKS",
      source: "MANUAL",
      notes: "Rebuilding the front row after two retirements this summer.",
    })
    .returning();

  const [harbour] = await db
    .insert(clubs)
    .values({
      name: "Auckland Harbour RFC",
      country: "New Zealand",
      region: "Auckland",
      league: "Premier Club Rugby",
      level: "AMATEUR_LEAGUE",
      status: "NEW",
      source: "AI_SEARCH",
      sourceDetail: "clubs in NZ open to recruiting overseas backs",
      notes: "Looking to add depth at outside back for next season.",
    })
    .returning();

  await db.insert(positionNeeds).values([
    { clubId: dragons.id, position: "Loosehead prop", level: "SEMI_PRO" },
    { clubId: dragons.id, position: "Hooker", level: "SEMI_PRO" },
    { clubId: harbour.id, position: "Fullback", level: "AMATEUR_LEAGUE" },
  ]);

  const [tomasi] = await db
    .insert(players)
    .values({
      firstName: "Tomasi",
      lastName: "Veikune",
      email: "tomasi@example.com",
      nationality: "Fijian",
      currentCountry: "Fiji",
      position: "Loosehead prop",
      level: "SEMI_PRO",
      yearsExperience: 6,
      status: "SHORTLISTED",
      source: "MANUAL",
      needsAccommodation: true,
      notes: "Available from January, has UK visa sorted already.",
    })
    .returning();

  const [liam] = await db
    .insert(players)
    .values({
      firstName: "Liam",
      lastName: "O'Sullivan",
      currentCountry: "Ireland",
      position: "Fullback",
      secondaryPosition: "Wing",
      level: "AMATEUR_LEAGUE",
      yearsExperience: 3,
      status: "NEW",
      source: "SELF_SUBMITTED",
      notes: "Submitted via the player interest form, looking to relocate for work + rugby.",
    })
    .returning();

  await db.insert(contactLogs).values([
    {
      clubId: dragons.id,
      playerId: tomasi.id,
      method: "EMAIL",
      summary: "Introduced Tomasi's profile to Sam, awaiting reply.",
    },
  ]);

  const [search] = await db
    .insert(sourcingSearches)
    .values({
      targetType: "PLAYER",
      query: "props based in the Pacific Islands open to relocating to Wales",
      runByEmail: "demo@example.com",
    })
    .returning();

  await db.insert(sourcingSuggestions).values([
    {
      searchId: search.id,
      targetType: "PLAYER",
      name: "Demo candidate, run a real AI search to replace this",
      summary:
        "This is a placeholder row so you can see what a sourcing result looks like. Set ANTHROPIC_API_KEY and run a real search from the AI Sourcing page.",
      reviewStatus: "PENDING",
    },
  ]);

  console.log("Seed complete.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

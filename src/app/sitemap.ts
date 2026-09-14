import type { MetadataRoute } from "next";
import { and, eq, notInArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { players, clubs } from "@/lib/db/schema";

const SITE_URL = "https://rugby-snowy.vercel.app"; // update once a custom domain is live
const PUBLIC_EXCLUDED_STATUSES: Array<"ARCHIVED" | "PLACED"> = ["ARCHIVED", "PLACED"];

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [publicPlayers, publicClubs] = await Promise.all([
    db
      .select({ id: players.id, updatedAt: players.updatedAt })
      .from(players)
      .where(
        and(
          eq(players.source, "SELF_SUBMITTED"),
          eq(players.isPublished, true),
          notInArray(players.status, PUBLIC_EXCLUDED_STATUSES),
        ),
      ),
    db
      .select({ id: clubs.id, updatedAt: clubs.updatedAt })
      .from(clubs)
      .where(
        and(
          eq(clubs.source, "SELF_SUBMITTED"),
          eq(clubs.isPublished, true),
          notInArray(clubs.status, PUBLIC_EXCLUDED_STATUSES),
        ),
      ),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/players`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/clubs`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/join/player`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/join/club`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const playerRoutes: MetadataRoute.Sitemap = publicPlayers.map((p) => ({
    url: `${SITE_URL}/players/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const clubRoutes: MetadataRoute.Sitemap = publicClubs.map((c) => ({
    url: `${SITE_URL}/clubs/${c.id}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...playerRoutes, ...clubRoutes];
}

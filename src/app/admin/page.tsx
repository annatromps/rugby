import Link from "next/link";
import { and, count, eq, desc, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { clubs, players, sourcingSuggestions } from "@/lib/db/schema";
import { StatusBadge } from "@/components/admin/status-badge";

async function getStats() {
  const [
    [{ value: clubCount }],
    [{ value: playerCount }],
    [{ value: pendingSuggestions }],
    [{ value: activeTalks }],
    [{ value: pendingPlayers }],
    [{ value: pendingClubs }],
  ] = await Promise.all([
    db.select({ value: count() }).from(clubs),
    db.select({ value: count() }).from(players),
    db
      .select({ value: count() })
      .from(sourcingSuggestions)
      .where(eq(sourcingSuggestions.reviewStatus, "PENDING")),
    db
      .select({ value: count() })
      .from(clubs)
      .where(or(eq(clubs.status, "IN_TALKS"), eq(clubs.status, "CONTACTED"))),
    db
      .select({ value: count() })
      .from(players)
      .where(and(eq(players.source, "SELF_SUBMITTED"), eq(players.isPublished, false))),
    db
      .select({ value: count() })
      .from(clubs)
      .where(and(eq(clubs.source, "SELF_SUBMITTED"), eq(clubs.isPublished, false))),
  ]);

  return {
    clubCount,
    playerCount,
    pendingSuggestions,
    activeTalks,
    pendingSignups: pendingPlayers + pendingClubs,
  };
}

async function getRecentActivity() {
  const [recentClubs, recentPlayers] = await Promise.all([
    db
      .select({
        id: clubs.id,
        name: clubs.name,
        status: clubs.status,
        updatedAt: clubs.updatedAt,
      })
      .from(clubs)
      .orderBy(desc(clubs.updatedAt))
      .limit(5),
    db
      .select({
        id: players.id,
        firstName: players.firstName,
        lastName: players.lastName,
        status: players.status,
        updatedAt: players.updatedAt,
      })
      .from(players)
      .orderBy(desc(players.updatedAt))
      .limit(5),
  ]);
  return { recentClubs, recentPlayers };
}

export default async function DashboardPage() {
  const [stats, activity] = await Promise.all([
    getStats(),
    getRecentActivity(),
  ]);

  const cards = [
    { label: "Clubs", value: stats.clubCount, href: "/admin/clubs", accent: "bg-brand-navy" },
    { label: "Players", value: stats.playerCount, href: "/admin/players", accent: "bg-brand-navy" },
    {
      label: "Sourcing suggestions to review",
      value: stats.pendingSuggestions,
      href: "/admin/sourcing",
      accent: "bg-slate-400",
    },
    {
      label: "In active talks",
      value: stats.activeTalks,
      href: "/admin/clubs?status=IN_TALKS",
      accent: "bg-slate-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of clubs, players, and sourcing activity.
        </p>
      </div>

      {stats.pendingSignups > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-brand-coral/30 bg-brand-coral/[0.06] px-4 py-3 text-sm">
          <span className="text-slate-700">
            <strong className="font-semibold text-brand-navy">{stats.pendingSignups}</strong> self sign-up
            {stats.pendingSignups === 1 ? "" : "s"} from the public site {stats.pendingSignups === 1 ? "is" : "are"}{" "}
            waiting for review before going live.
          </span>
          <Link href="/admin/players?pending=1" className="shrink-0 font-medium text-brand-navy hover:underline">
            Review now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-slate-300"
          >
            <span className={`absolute inset-x-0 top-0 h-1 ${card.accent}`} />
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-1.5 text-2xl font-semibold tabular-nums text-slate-900">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Recently updated clubs
            </h2>
            <Link href="/admin/clubs" className="text-xs text-slate-500 hover:text-brand-navy hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {activity.recentClubs.length === 0 && (
              <li className="py-4 text-sm text-slate-400">No clubs yet.</li>
            )}
            {activity.recentClubs.map((club) => (
              <li key={club.id} className="flex items-center justify-between py-2">
                <Link
                  href={`/admin/clubs/${club.id}`}
                  className="text-sm font-medium text-slate-800 hover:underline"
                >
                  {club.name}
                </Link>
                <StatusBadge status={club.status} />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Recently updated players
            </h2>
            <Link href="/admin/players" className="text-xs text-slate-500 hover:text-brand-navy hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {activity.recentPlayers.length === 0 && (
              <li className="py-4 text-sm text-slate-400">No players yet.</li>
            )}
            {activity.recentPlayers.map((player) => (
              <li key={player.id} className="flex items-center justify-between py-2">
                <Link
                  href={`/admin/players/${player.id}`}
                  className="text-sm font-medium text-slate-800 hover:underline"
                >
                  {player.firstName} {player.lastName}
                </Link>
                <StatusBadge status={player.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

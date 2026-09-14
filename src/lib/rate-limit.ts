import "server-only";
import { createHash } from "crypto";
import { headers } from "next/headers";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { rateLimitEvents } from "@/lib/db/schema";

// Simple DB-backed rate limiter for the unauthenticated public forms
// (player/club sign-up, inquiries). No external service required -- it
// just uses a row per attempt in the existing Postgres database.
//
// The client IP is only ever stored as a one-way hash, never in the
// clear, and is used for nothing except this abuse check.

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_ATTEMPTS_PER_WINDOW = 5;
const RETENTION_MS = 24 * 60 * 60 * 1000; // prune anything older than this

function hashIp(ip: string) {
  const salt = process.env.RATE_LIMIT_SALT ?? "kickoff-rugby";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

async function getClientIp(): Promise<string> {
  const h = await headers();
  // Vercel sets x-forwarded-for to "client, proxy1, proxy2, ...".
  const forwardedFor = h.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}

// Returns true if this request should be allowed to proceed. As a side
// effect, records the attempt (so a legitimate submission still counts
// toward the limit) and opportunistically prunes old rows.
export async function checkRateLimit(formType: string): Promise<boolean> {
  const ip = await getClientIp();
  const ipHash = hashIp(ip);
  const windowStart = new Date(Date.now() - WINDOW_MS);

  // Prune old rows opportunistically rather than running a separate job.
  await db.delete(rateLimitEvents).where(lt(rateLimitEvents.createdAt, new Date(Date.now() - RETENTION_MS)));

  const [{ value: recentCount }] = await db
    .select({ value: sql<number>`count(*)`.mapWith(Number) })
    .from(rateLimitEvents)
    .where(
      and(
        eq(rateLimitEvents.ipHash, ipHash),
        eq(rateLimitEvents.formType, formType),
        gt(rateLimitEvents.createdAt, windowStart),
      ),
    );

  if (recentCount >= MAX_ATTEMPTS_PER_WINDOW) {
    return false;
  }

  await db.insert(rateLimitEvents).values({ ipHash, formType });
  return true;
}

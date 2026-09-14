// Shared constants mirroring the Postgres enums in src/lib/db/schema.ts.
// Kept in sync by hand since Drizzle doesn't export enum values as arrays
// for us automatically. If you add a value to an enum in schema.ts, add it
// here too.

export const RECORD_STATUSES = [
  "NEW",
  "REVIEWING",
  "SHORTLISTED",
  "CONTACTED",
  "IN_TALKS",
  "PLACED",
  "ARCHIVED",
] as const;

export const PLAYER_LEVELS = [
  "COMMUNITY",
  "AMATEUR_LEAGUE",
  "SEMI_PRO",
  "PROFESSIONAL",
  "INTERNATIONAL",
] as const;

export const CONTACT_METHODS = [
  "EMAIL",
  "PHONE",
  "WHATSAPP",
  "IN_PERSON",
  "OTHER",
] as const;

export const PLAYER_LEVEL_LABELS: Record<string, string> = {
  COMMUNITY: "Community",
  AMATEUR_LEAGUE: "Amateur league",
  SEMI_PRO: "Semi-pro",
  PROFESSIONAL: "Professional",
  INTERNATIONAL: "International",
};

// Shared logic for the outreach-email feature: turning a saved template
// (with {{variableName}} placeholders) into the actual subject/body for a
// specific club or player. Deliberately has no server-only dependency --
// the compose modal (a client component) re-renders the template live as
// an admin edits it, using the exact same function the admin settings
// preview uses.
import type { clubs, players, coaches } from "@/lib/db/schema";
import { PLAYER_LEVEL_LABELS } from "@/lib/constants";

export type TemplateVariable = { key: string; label: string; example: string };

// Keep this in sync with buildClubVariables below -- it's shown to the
// admin in the template editor as the list of {{...}} tags they can use.
export const CLUB_TEMPLATE_VARIABLES: TemplateVariable[] = [
  { key: "clubName", label: "Club name", example: "Cardiff Ravens RFC" },
  { key: "contactName", label: "Contact name", example: "Sam Jones" },
  { key: "country", label: "Country", example: "Wales" },
  { key: "region", label: "Region / city", example: "Cardiff" },
  { key: "league", label: "League", example: "WRU Championship" },
  { key: "level", label: "Level", example: "Semi-pro" },
  { key: "adminName", label: "Your name", example: "Anna Trompetas" },
];

// Keep this in sync with buildPlayerVariables below.
export const PLAYER_TEMPLATE_VARIABLES: TemplateVariable[] = [
  { key: "firstName", label: "First name", example: "Jamie" },
  { key: "lastName", label: "Last name", example: "Taylor" },
  { key: "position", label: "Position", example: "Tighthead prop" },
  { key: "level", label: "Level", example: "Semi-pro" },
  { key: "currentClub", label: "Current club", example: "Bristol Bears Community" },
  { key: "country", label: "Based in", example: "England" },
  { key: "adminName", label: "Your name", example: "Anna Trompetas" },
];

// Keep this in sync with buildCoachVariables below.
export const COACH_TEMPLATE_VARIABLES: TemplateVariable[] = [
  { key: "firstName", label: "First name", example: "Jamie" },
  { key: "lastName", label: "Last name", example: "Taylor" },
  { key: "specialization", label: "Specialization", example: "Forwards / scrum" },
  { key: "coachingLevel", label: "Coaching level", example: "Level 3" },
  { key: "currentClub", label: "Current club", example: "Bristol Bears Community" },
  { key: "country", label: "Based in", example: "England" },
  { key: "adminName", label: "Your name", example: "Anna Trompetas" },
];

export function templateVariablesFor(targetType: "CLUB" | "PLAYER" | "COACH"): TemplateVariable[] {
  if (targetType === "CLUB") return CLUB_TEMPLATE_VARIABLES;
  if (targetType === "COACH") return COACH_TEMPLATE_VARIABLES;
  return PLAYER_TEMPLATE_VARIABLES;
}

// Replaces every {{key}} in `template` with vars[key], leaving unknown
// tags untouched (so a typo'd variable is visible rather than silently
// vanishing) and blank for a known key with no value (e.g. no contact
// name on file) rather than printing "undefined".
export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key: string) => {
    if (!(key in vars)) return match;
    return vars[key] ?? "";
  });
}

type Club = typeof clubs.$inferSelect;
type Player = typeof players.$inferSelect;
type Coach = typeof coaches.$inferSelect;

export function buildClubVariables(club: Club, adminName: string): Record<string, string> {
  return {
    clubName: club.name,
    contactName: club.contactName ?? "",
    country: club.country,
    region: club.region ?? "",
    league: club.league ?? "",
    level: club.level ? (PLAYER_LEVEL_LABELS[club.level] ?? club.level) : "",
    adminName,
  };
}

export function buildPlayerVariables(player: Player, adminName: string): Record<string, string> {
  return {
    firstName: player.firstName,
    lastName: player.lastName,
    position: player.position,
    level: player.level ? (PLAYER_LEVEL_LABELS[player.level] ?? player.level) : "",
    currentClub: player.currentClub ?? "",
    country: player.currentCountry ?? "",
    adminName,
  };
}

export function buildCoachVariables(coach: Coach, adminName: string): Record<string, string> {
  return {
    firstName: coach.firstName,
    lastName: coach.lastName,
    specialization: coach.specialization,
    coachingLevel: coach.coachingLevel ?? "",
    currentClub: coach.currentClub ?? "",
    country: coach.currentCountry ?? "",
    adminName,
  };
}

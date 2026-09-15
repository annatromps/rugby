// Blurs an individual's name for anonymous visitors -- "Maria Santos"
// becomes "Maria S." Used on player/coach cards and profiles; clubs are
// organizations, not individuals, so their names are never fuzzed.
export function fuzzName(firstName: string, lastName: string) {
  const lastInitial = lastName?.[0] ? `${lastName[0]}.` : "";
  return [firstName, lastInitial].filter(Boolean).join(" ");
}

// Whether a player/coach/club record is placeholder demo data rather than
// a real submission. Demo rows are seeded with "(Demo)" in their display
// name, which is the one durable, human-visible marker we use everywhere
// (admin lists, this check) to keep fabricated data clearly labelled --
// see the standing rule against ever passing demo data off as real.
//
// It's used here to decide whether it's safe to show a fabricated photo
// or crest to a signed-out visitor: a real person's photo stays gated
// behind login like their name, but a demo one has no privacy to protect.
export function isDemoName(name: string): boolean {
  return name.includes("(Demo)");
}

@AGENTS.md

# Kickoff Rugby Recruitment -- project guide for Claude

Read `README.md` first for stack, structure, and local setup. This file is the extra context specific to working on this codebase as an AI agent.

## What this is

A rugby recruitment marketplace with two sides: a public site where clubs and players find each other and can self-submit a listing or an inquiry, and an admin dashboard (behind `/admin` login) where staff manage the pipeline through to placement and accommodation support. See `README.md` for the full picture, including the review-gate (`isPublished`) and verified-badge (`isVerified`) flags that control what the public actually sees.

Keep the two sides cleanly separated: public routes and Server Actions (`src/app/actions/public.ts`, `src/app/page.tsx`, `src/app/players/`, `src/app/clubs/`, `src/app/positions/`, `src/app/join/*`) never call `requireAdmin()` and must never expose unpublished/unverified records or admin-only fields. Admin routes and actions always call `requireAdmin()` (see the house rule below). If you're asked to add a new kind of public self-serve flow, extend this pattern rather than bolting public access onto `requireAdmin()`-protected code.

## House rules for changes here

- **Every page and Server Action that touches real data must call `requireAdmin()`** (from `src/lib/auth/dal.ts`) as its first line, even if the calling page already checked auth -- see the "Authorization" section of Next.js's own auth guide (bundled in `node_modules/next/dist/docs/app/guides/authentication.md` in whatever Next version is installed) for why defense-in-depth here matters: Server Actions are reachable directly, not just through the UI you built.
- **A `<select>` for an optional enum field submits `""` when left on its blank option**, not `undefined` -- this bit us once already (see git history / `src/lib/validation.ts`). Any new optional enum field in a form must go through `optionalEnum()` in that file, not a raw `z.enum(...).optional()`.
- **Don't add next/font's Google Fonts integration back.** It was removed deliberately -- fetching a font at build time adds a network dependency that fails outright on a restricted network (this sandbox's build failed on it). The system font stack in `globals.css` is intentional. If a brand typeface is wanted later, self-host it with `next/font/local`.
- **Don't add Prisma.** This project used to use it; the schema-engine binary download was blocked by this environment's network policy, which is exactly the kind of fragility a "solid foundation" should avoid. Drizzle was chosen deliberately as the fix, not a temporary workaround -- keep it.
- **Middleware is called "Proxy" in this Next.js version** (`src/proxy.ts`, not `middleware.ts`). If your training data suggests `middleware.ts`, that's stale -- check `node_modules/next/dist/docs/app/getting-started/proxy.md` in whatever Next version is actually installed before assuming file conventions, since this project deliberately tracks current Next.js rather than pinning to an older, more "familiar" version.
- **Shared enum values live in `src/lib/constants.ts`**, kept in sync by hand with the Postgres enums in `src/lib/db/schema.ts`. If you add a value to an enum in the schema, add it there too, and regenerate/apply a migration (`npm run db:generate && npm run db:migrate`).
- When you change `schema.ts`, always generate and commit a migration in the same change -- don't leave the schema file and the database out of sync for someone else to reconcile.
- **Public forms are rate-limited** (`src/lib/rate-limit.ts`, DB-backed, 5 submissions/hour/IP/form-type) and honeypot-protected. Any new public-facing form that writes to the database should call `checkRateLimit(formType)` the same way `src/app/actions/public.ts` does, right after the honeypot check.
- **A self-submitted player or club is unpublished by default** (`isPublished: false` on insert) -- this is deliberate, not a bug. Never flip that default without an explicit product decision; it's the whole point of the review gate. Admin-created records default to published since a staff member already vetted them by adding them.
- **`isVerified` is independent of `isPublished`.** Publishing controls whether something is visible at all; verifying is a separate manual trust signal staff apply after actually checking a listing. Don't conflate the two or auto-set one from the other.

## Before a handover to a new owner

If you're asked to help hand this project to a new owner, walk through:

1. Transfer the GitHub repo to an organization the new owner controls (or add them as owner if it's already org-owned).
2. Transfer or recreate the Vercel project under their account/team, and re-set the environment variables (`DATABASE_URL`, `SESSION_SECRET`, `ANTHROPIC_API_KEY`) -- don't copy `SESSION_SECRET` if you're regenerating it, since that invalidates existing sessions (fine for a handover).
3. Transfer database ownership (Neon/Supabase/etc.) or export and let them import into their own instance.
4. Transfer the domain registration if one exists.
5. Run `npm run create-admin -- ...` to give the new owner (and revoke old ones, if appropriate) a login.
6. Confirm they can reach `/admin/sourcing` and either have their own `ANTHROPIC_API_KEY` set, or understand that feature needs one.

This file, the README, and `ADMIN_RUNBOOK.md` are meant to make that handover need as little back-and-forth as possible -- keep all three current as the app grows.

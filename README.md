# Kickoff Rugby Recruitment

An internal tool for a rugby recruitment business: a two-sided marketplace connecting rugby clubs (looking for players) with players (looking for a club), plus tracking for accommodation/relocation support once a placement is made.

At this stage, matching is done by an admin (not self-serve) -- clubs and players are added by hand or surfaced by the AI-assisted sourcing tool, and an admin manages outreach and status through to placement.

## Tech stack, and why

- **Next.js (App Router) + TypeScript** -- the most mainstream full-stack React framework, chosen specifically so that any developer or AI coding tool (including a future owner's own Claude) can pick this codebase up without needing to learn anything unusual.
- **Postgres**, accessed through **Drizzle ORM** (`src/lib/db/schema.ts`) rather than Prisma. Drizzle is pure TypeScript with no native binary to download at install/build/deploy time -- it talks to Postgres through the plain `pg` driver. Migrations are plain, readable `.sql` files under `drizzle/`. This avoids a real class of failure (engine binaries blocked by a network/firewall policy) that this project hit early on with Prisma.
- **Admin auth is hand-rolled**, not an auth library: a signed httpOnly cookie (`jose` for the JWT, `bcryptjs` for password hashing), following the pattern Next.js's own docs recommend for this exact case (a single kind of account, email+password, no social login). There's a `requireAdmin()` / `verifySession()` pair in `src/lib/auth/dal.ts` that every page and Server Action calls -- see that file before changing anything auth-related.
- **Tailwind CSS** for styling.
- **AI-assisted sourcing** (`src/lib/ai/sourcing.ts`) calls the Anthropic Messages API directly with the web search tool, rather than a heavier agent framework, since it's a single well-defined job (search, then structure results into a reviewable list).

## Project structure

```
src/
  app/
    login/               Public login page
    admin/               Everything behind admin auth (layout.tsx enforces this)
      clubs/, players/    List + detail + new pages for each entity
      sourcing/           AI-assisted sourcing tool
    actions/             Server Actions (the only way pages mutate data)
  components/admin/       Shared UI: status badges/selects, contact log form
  lib/
    db/                  Drizzle schema, client, migration/seed scripts
    auth/                Session handling (session.ts) and the DAL (dal.ts)
    ai/                  Sourcing search implementation
    constants.ts         Enum value lists shared between schema and UI
    validation.ts        Shared Zod helpers
  proxy.ts               Next.js 16's renamed "Middleware" -- optimistic route
                          protection for /admin/*
drizzle/                 Generated SQL migrations (commit these)
```

## Local development

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` and `SESSION_SECRET` (generate one with `openssl rand -base64 32`). `ANTHROPIC_API_KEY` is optional -- everything works without it except AI Sourcing.
3. Point `DATABASE_URL` at a Postgres database (local, or a free-tier hosted one -- see Deploying below).
4. Apply the schema: `npm run db:migrate`
5. Create your first admin login: `npm run create-admin -- "you@example.com" "a strong password" "Your Name" OWNER`
6. (Optional) Load demo data so the app isn't empty: `npm run db:seed`
7. `npm run dev`, then sign in at `/login`.

### Changing the data model

Edit `src/lib/db/schema.ts`, then:

```
npm run db:generate   # writes a new .sql file under drizzle/ from the diff
npm run db:migrate    # applies it to whatever DATABASE_URL points at
```

Commit the generated migration file along with your schema change. Never hand-edit an already-applied migration file -- write a new one instead.

`npm run db:studio` opens Drizzle Studio, a browser GUI for looking at the data directly.

## Deploying

This app has no infrastructure-specific code, so it deploys the standard way for a Next.js app:

1. **Hosting**: [Vercel](https://vercel.com) is the simplest option -- it deploys straight from a GitHub repo with no configuration.
2. **Database**: any managed Postgres works ([Neon](https://neon.tech) and [Supabase](https://supabase.com) both have usable free tiers and are simple to set up).
3. Set `DATABASE_URL`, `SESSION_SECRET`, and (if using AI Sourcing) `ANTHROPIC_API_KEY` as environment variables in your hosting provider's project settings -- never commit real values.
4. Run `npm run db:migrate` against the production `DATABASE_URL` once (a one-off command, or wire it into your deploy pipeline as a pre-deploy step), then `npm run create-admin -- ...` to create the first real login.

### Ownership, for a future handover

If this project is ever transferred to a new owner, the cleanest handover is: a GitHub organization (not a personal account) holding this repo, a Vercel team (not a personal account) for hosting, and the database/domain registrar accounts under the same business identity. Transferring ownership of those few accounts is far simpler and safer than migrating code or data. See `CLAUDE.md` for a handover checklist aimed at whichever Claude session picks this project up next.

## Current scope / not yet built

- No public-facing site yet -- `/` redirects straight to `/admin`. When there's a public marketing site or self-submission forms for clubs/players, that's where the real homepage goes.
- No payments.
- Accommodation support (`accommodation_requests` table) is tracked but not automated -- it's a log an admin updates by hand.

# Kickoff Rugby Recruitment

A two-sided rugby recruitment marketplace: clubs looking for players and
players looking for a club can find each other on a public site
(`kickoff-rugby-recruitment`, currently hosted at
`https://rugby-snowy.vercel.app`), and a staff admin dashboard
(`/admin`) manages the pipeline from first contact through to placement,
plus accommodation/relocation support once a placement is made.

## How it fits together

- **Public site** (`/`, `/players`, `/clubs`, `/positions`, `/join/player`,
  `/join/club`) -- anyone can browse published players and clubs, browse a
  club's open positions, and submit themselves (or their club) for
  consideration, or send an inquiry about a specific listing.
- **Review gate** -- a self-submitted player or club is saved as
  unpublished (`isPublished: false`) and does not appear on the public
  site until a staff member approves it from the admin dashboard. This is
  what the sign-up forms' "your profile is reviewed before it goes live"
  copy actually enforces. Admin-added records (manual entry or AI
  sourcing) are published by default, since a staff member is already the
  one who added them.
- **Verified badge** -- separately from publishing, staff can mark a
  self-submitted player or club as "verified" once they've actually
  checked it's genuine. This shows a blue checkmark badge on the public
  listing; publishing and verifying are independent toggles.
- **Admin dashboard** (`/admin`, behind login) -- staff manage every club
  and player (however they were added), log outreach, track placements
  and accommodation requests, and run AI-assisted sourcing to find new
  candidates from the open web.

## Tech stack, and why

- **Next.js (App Router) + TypeScript** -- the most mainstream full-stack React framework, chosen specifically so that any developer or AI coding tool (including a future owner's own Claude) can pick this codebase up without needing to learn anything unusual.
- **Postgres**, accessed through **Drizzle ORM** (`src/lib/db/schema.ts`) rather than Prisma. Drizzle is pure TypeScript with no native binary to download at install/build/deploy time -- it talks to Postgres through the plain `pg` driver. Migrations are plain, readable `.sql` files under `drizzle/`. This avoids a real class of failure (engine binaries blocked by a network/firewall policy) that this project hit early on with Prisma.
- **Admin auth is hand-rolled**, not an auth library: a signed httpOnly cookie (`jose` for the JWT, `bcryptjs` for password hashing), following the pattern Next.js's own docs recommend for this exact case (a single kind of account, email+password, no social login). There's a `requireAdmin()` / `verifySession()` pair in `src/lib/auth/dal.ts` that every page and Server Action calls -- see that file before changing anything auth-related. Public routes and Server Actions under `src/app/actions/public.ts` deliberately do **not** call `requireAdmin()` -- that's the whole point of them.
- **Tailwind CSS** for styling, with the brand palette (`brand-navy`, `brand-coral`, etc.) defined as theme vars in `src/app/globals.css` and shared by both the public site and the admin dashboard.
- **AI-assisted sourcing** (`src/lib/ai/sourcing.ts`) calls the Anthropic Messages API directly with the web search tool, rather than a heavier agent framework, since it's a single well-defined job (search, then structure results into a reviewable list).
- **Vercel Web Analytics** (`@vercel/analytics`) for pageview counts -- zero-config, but needs Web Analytics turned on in the Vercel project's Analytics tab to actually collect data.

## Project structure

```
src/
  app/
    page.tsx              Public homepage (stats + calls to action)
    players/, clubs/       Public browse/search + profile pages
    positions/             Public "open positions" board
    join/player, join/club Public self-submission forms
    login/                 Staff login page
    admin/                 Everything behind admin auth (layout.tsx enforces this)
      clubs/, players/     List + detail + new pages for each entity
      sourcing/            AI-assisted sourcing tool
    actions/
      public.ts           Server Actions for the public site (no admin check, rate-limited)
      players.ts, clubs.ts Server Actions for the admin dashboard (requireAdmin())
    sitemap.ts, robots.ts  SEO
  components/
    admin/                 Admin-only UI: status badges/selects, publish/verified toggles, nav
    public/                Public-site UI: cards, header/footer, badges, forms
  lib/
    db/                    Drizzle schema, client, migration/seed scripts
    auth/                  Session handling (session.ts) and the DAL (dal.ts)
    ai/                    Sourcing search implementation
    rate-limit.ts          DB-backed per-IP rate limiting for public forms
    constants.ts           Enum value lists shared between schema and UI
    validation.ts          Shared Zod helpers
  proxy.ts                 Next.js 16's renamed "Middleware" -- optimistic route
                            protection for /admin/*
drizzle/                   Generated SQL migrations (commit these)
```

## Local development

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` and `SESSION_SECRET` (generate one with `openssl rand -base64 32`). `ANTHROPIC_API_KEY` is optional -- everything works without it except AI Sourcing.
3. Point `DATABASE_URL` at a Postgres database (local, or a free-tier hosted one -- see Deploying below).
4. Apply the schema: `npm run db:migrate`
5. Create your first admin login: `npm run create-admin -- "you@example.com" "a strong password" "Your Name" OWNER`
6. (Optional) Load demo data so the app isn't empty: `npm run db:seed`
7. `npm run dev`, then browse the public site at `/`, or sign in at `/login` for the admin dashboard.

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
5. Turn on Web Analytics in the Vercel project's Analytics tab if you want pageview data -- the code side is already wired up.

### Ownership, for a future handover

If this project is ever transferred to a new owner, the cleanest handover is: a GitHub organization (not a personal account) holding this repo, a Vercel team (not a personal account) for hosting, and the database/domain registrar accounts under the same business identity. Transferring ownership of those few accounts is far simpler and safer than migrating code or data. See `CLAUDE.md` for a handover checklist, and `ADMIN_RUNBOOK.md` for what day-to-day admin work looks like, aimed at whichever Claude session or developer picks this project up next.

## Current scope / not yet built

- No payments or monetization -- if that's added, it's a business-model decision first, not just a build task.
- Accommodation support (`accommodation_requests` table) is tracked but not automated -- it's a log an admin updates by hand; there's no player-facing request flow yet.
- Forgot-password email is built and working (see `src/app/actions/password-reset.ts`), but Resend has no verified sending domain yet, so it can currently only deliver to the address the Resend account itself was signed up with -- a real user resetting their password elsewhere will silently get no email. Verifying a domain in Resend (a few DNS records) unblocks this for real users.
- No self-serve login/inbox messaging system yet for players, coaches and clubs to message each other directly -- the `conversations`/`messages` tables exist but no UI is built on them.
- Privacy policy (`/privacy`) and terms of service (`/terms`) pages exist and are linked from the footer and every application form, but they have two bracketed placeholders (company legal details, governing law) that need filling in, and -- given the site now collects passport/ID scans -- are worth a lawyer's review before being relied on for compliance.

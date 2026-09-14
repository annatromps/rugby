# Admin runbook

Day-to-day operation of the Kickoff Rugby Recruitment admin dashboard,
for whoever is running it (Anna, another staff member, or a future
owner) and for whichever Claude session picks up support work on it.
Read `README.md` first for the overall architecture.

## Logging in

Go to `/login` (linked as "Staff login" in the site footer) and sign in
with an admin email/password. Accounts are created with:

```
npm run create-admin -- "email@example.com" "a strong password" "Full Name" OWNER
```

(role is `OWNER` or `STAFF` -- both can do everything today; the
distinction exists for future permission differences, not enforced yet).
There's no self-serve password reset -- resetting one means re-running
`create-admin` for that email, or updating `admin_users.password_hash`
directly.

## Reviewing new public sign-ups

1. The admin dashboard homepage (`/admin`) shows a coral banner whenever
   there are pending sign-ups, linking to a filtered view.
2. `/admin/players?pending=1` and `/admin/clubs?pending=1` list every
   self-submitted player/club that isn't published yet -- these are the
   ones a real person filled out the public sign-up form for.
3. Open a record, check it looks genuine (real name, plausible details,
   no spam), then use the **Published** toggle on its detail page to make
   it live on the public site. Toggling it back to "Pending review"
   un-publishes it again -- use this if something needs to come down.
4. Separately, the **Verified** toggle marks a listing as actually
   checked by staff (shows a blue badge on the public site). It's
   independent of publishing -- you can publish something without
   verifying it, though for self-submitted listings it's worth doing
   both at the same time once you've looked at it.
5. Manually-added players/clubs (added by staff, or promoted from an AI
   Sourcing suggestion) are published automatically and don't need this
   step -- the Published/Verified toggles are only shown for
   self-submitted records.

## Handling inquiries

When someone submits the inquiry form on a player or club's public
profile, it's logged as a **contact log** entry against that record
(visible on the record's admin detail page) -- there's no separate
inquiry inbox yet, and no email notification (see "Not yet built"
below), so checking `/admin/players` and `/admin/clubs` regularly is
currently the only way to notice a new one.

## Managing open positions

A club's open positions live on its own admin detail page ("Positions
needed" section) -- add, edit, or mark one filled there. Once a position
exists and isn't marked filled, and the club is published, it
automatically appears on the public `/positions` board and on the
club's own public profile -- no separate publishing step for positions.

## AI-assisted sourcing

`/admin/sourcing` searches the open web (via the Anthropic API) for
clubs or players matching a query, and returns a reviewable list of
suggestions. Accepting a suggestion promotes it into a real club/player
record (published immediately, since a staff member reviewed it before
accepting). Requires `ANTHROPIC_API_KEY` to be set -- without it, this
one feature is disabled but everything else works normally.

## Checking traffic

Vercel's **Analytics** tab (in the Vercel project dashboard, not in
`/admin`) shows pageviews once Web Analytics is turned on there --
see README.md's Deploying section.

## If something looks wrong on the live site

1. Check the deployment status in the Vercel dashboard
   (`https://vercel.com/<team>/<project>/deployments`) -- a red/"Error"
   deployment means the last push didn't build; the site keeps serving
   the previous working version until that's fixed.
2. Rate limiting: if someone reports "too many submissions" on a public
   form unexpectedly, that's `src/lib/rate-limit.ts` (5 submissions/
   hour/IP/form-type) -- it resets after an hour, no manual override
   exists today.
3. For anything else, the admin dashboard has no built-in error log --
   check Vercel's Logs tab for the project.

## Not yet built (see README.md's "Current scope")

Email notifications, photo uploads, a self-serve accommodation request
flow, and monetization are all deliberately not built yet -- each needs
either a product/business decision or a new third-party service account
before work on it should start. Don't build workarounds for these
without checking first.

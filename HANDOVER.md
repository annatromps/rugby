# Handover checklist

This project is currently run under Anna's own accounts. When it's handed
over to a new owner, the services below need to move to their accounts.
Keep this list updated as new services are added (payment processors,
a custom domain, analytics, etc).

## 1. GitHub repository

- Repo: `annatromps/rugby` on GitHub.
- To hand over: transfer ownership of the repo to the new owner's GitHub
  account (Settings > General > Danger Zone > Transfer ownership), or add
  them as a collaborator/owner and remove Anna's access afterwards.

## 2. Vercel (hosting)

- Project: `kickoff-rugby` under the `rugby4` Vercel team/account.
- Live domains: `kickoff-rugby.vercel.app` and `rugby-snowy.vercel.app`
  (both point at the same production deployment).
- To hand over: either transfer the project to the new owner's Vercel
  account (Settings > General > Transfer Project), or have them create
  their own Vercel account, connect it to the (transferred) GitHub repo,
  and redeploy, then update the domain(s) to point at the new project.
- Environment variables (database connection string, Resend API key,
  and any others added later) will need to be copied over to the new
  project, since Vercel doesn't move these automatically on a transfer.

## 3. Neon (database)

- Database: `rugby-db`, connected to the Vercel project via the Neon
  Vercel integration.
- To hand over: transfer the Neon project to the new owner's Neon
  account, or have them create a new Neon database and migrate the data
  across, then update the `DATABASE_URL` environment variable in Vercel.

## 4. Resend (transactional email)

- Used for sending emails from the site (e.g. password reset emails
  once that feature is built).
- Account currently under Anna's email.
- To hand over: either transfer the Resend account, or have the new
  owner create their own Resend account, verify a sending domain, and
  swap in their own API key as the `RESEND_API_KEY` environment
  variable in Vercel.

## 5. Admin accounts

- Not a third-party service, but worth noting here: the `admin_users`
  table holds staff logins (Anna and Jake Hunterbus currently have
  OWNER-level access). Whoever takes over should get their own admin
  account created, and old accounts no longer in use should be removed
  or have their passwords rotated.

## Not yet in use (add here if they're set up later)

- Custom domain (the site currently only has Vercel-assigned
  `*.vercel.app` domains).
- Payment processor, if the site ever takes payments.
- Analytics or monitoring tools.

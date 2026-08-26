# Invoice Tracker

Small MVP for tracking invoices, clients, payments, and reminders.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- ESLint
- PostgreSQL + Prisma ORM
- Auth.js (NextAuth v5) — credentials auth, JWT sessions, bcrypt password hashing

## Setup

```bash
npm install
cp .env.example .env   # then fill in local values
```

Required in `.env`:

- `DATABASE_URL` — PostgreSQL connection string
  (`postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`)
- `AUTH_SECRET` — session signing secret (`openssl rand -base64 32`)

Optional (email reminders via Resend): `RESEND_API_KEY`,
`REMINDER_FROM_EMAIL` (must be verified with Resend before sending works).

Optional (scheduled reminders): `CRON_SECRET` — Vercel Cron calls
`GET /api/cron/reminders` daily (see `vercel.json`, 18:30 UTC ≈ midnight IST)
with `Authorization: Bearer <CRON_SECRET>`; requests without the correct
secret are rejected with 401 before any processing.

## Database

```bash
npm run db:migrate   # create/apply migrations (requires DATABASE_URL)
npm run db:seed      # load 8 sample invoices into one dev user
```

The seed script refuses to run without a password. Set dev-only credentials
in your local `.env` (never commit them):

```bash
SEED_USER_EMAIL="dev@invoice.local"   # optional, defaults to this
SEED_USER_PASSWORD="choose-your-own"  # required, min 8 chars
```

## Authentication

Credentials-based server-side foundation only (no OAuth/magic links):

- `POST /api/auth/callback/credentials` — sign in with email + password
- `const session = await auth()` — returns `session.user.id` for the signed-in user

All invoice data access must scope queries by `session.user.id`
(e.g., `prisma.invoice.findMany({ where: { userId } })`). Invoices cascade-delete
with their owner.

## Development

```bash
npm run dev
```

Open http://localhost:3000.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

# SPA Design Consultants — Website

Production-grade portfolio site for SPA Design Consultants Pvt. Ltd.
Built on Next.js 14 (App Router) with TypeScript, Tailwind, GSAP/ScrollTrigger,
React Three Fiber, Lenis, Prisma + SQLite, and a custom HMAC-signed admin session.

## Quick start

```bash
# 1. Install
npm install

# 2. Configure env
cp .env.example .env       # then edit DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET

# 3. Initialise the local SQLite database
npm run db:migrate         # applies the Prisma migration → prisma/dev.db

# 4. Run
npm run dev                # → http://localhost:3000
```

Open the public site at <http://localhost:3000>, the admin at <http://localhost:3000/admin>
(redirects to `/admin/login` until authenticated).

## Environment variables

See [`.env.example`](.env.example) for the full list with comments. Required:

| Variable          | Purpose                                                                |
|-------------------|------------------------------------------------------------------------|
| `DATABASE_URL`    | Prisma datasource. Default: `file:./prisma/dev.db` (SQLite, local dev). |
| `ADMIN_EMAIL`     | Email accepted by `/admin/login`.                                       |
| `ADMIN_PASSWORD`  | Password accepted by `/admin/login`.                                    |
| `SESSION_SECRET`  | 32+ char random string. HMAC key for the admin session cookie.          |

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

## Lead capture + admin

- **Public form:** [`/start-project`](http://localhost:3000/start-project) — collects name, email,
  phone, project type, budget, location, and brief. Validated by zod (shared
  schema in `lib/leadSchema.ts`), submitted to `POST /api/leads`.
- **Persistence:** Prisma + SQLite. The `Lead` model lives in
  [`prisma/schema.prisma`](prisma/schema.prisma). To swap to Postgres / Supabase,
  change `provider` to `postgresql` and update `DATABASE_URL` — no app code
  changes required.
- **Admin dashboard:** [`/admin/leads`](http://localhost:3000/admin/leads) — gated by
  middleware (`middleware.ts`). Lists every inquiry newest-first, highlights
  `NEW` rows, shows totals by status, and lets you change status inline.
  Individual leads at `/admin/leads/[id]` show the full brief.
- **Admin auth:** lightweight HMAC-signed session cookie (`lib/auth.ts`). No
  NextAuth, no extra deps. The same cookie is verified in Edge middleware and
  Node route handlers via Web Crypto. Sessions expire after 8 hours.

## Scripts

| Script                | What it does                                |
|-----------------------|---------------------------------------------|
| `npm run dev`         | Next dev server on `:3000`.                 |
| `npm run build`       | `prisma generate` + `next build`.           |
| `npm start`           | Run the built production server.            |
| `npm run lint`        | Next/ESLint.                                |
| `npm run db:migrate`  | Create + apply a new Prisma migration.       |
| `npm run db:studio`   | Open Prisma Studio against the local DB.    |
| `npm run db:reset`    | Drop & re-apply migrations (destructive).   |

## Project structure (lead/admin slice)

```
app/
  api/
    leads/route.ts             POST (public) + GET (admin) — list / create
    leads/[id]/route.ts        PATCH status, GET single (admin)
    admin/login/route.ts       POST credentials → session cookie
    admin/logout/route.ts      clear cookie
  admin/
    layout.tsx                 admin chrome (header + logout) when authed
    page.tsx                   → redirects to /admin/leads
    login/page.tsx             /admin/login (open)
    leads/page.tsx             list + stats
    leads/[id]/page.tsx        detail + status update
  start-project/page.tsx       public inquiry form

components/
  forms/StartProjectForm.tsx   public form (RHF + zod)
  admin/LoginForm.tsx
  admin/LogoutButton.tsx
  admin/StatusSelect.tsx       inline status changer
  admin/StatusBadge.tsx
  providers/ChromeGate.tsx     hides the public Nav/Footer on /admin

lib/
  db.ts                        Prisma singleton
  auth.ts                      HMAC session sign/verify (Web Crypto, Edge-safe)
  leadSchema.ts                shared zod schemas + enums

middleware.ts                  gates /admin/** and the admin lead APIs
prisma/schema.prisma           Lead model
```

## Deployment notes

- Set the four env vars on the host. **Change `ADMIN_PASSWORD` and `SESSION_SECRET`
  to fresh random values** before any real deployment.
- For Postgres, change `provider` in `prisma/schema.prisma` and run
  `npx prisma migrate deploy` once the env var is set.
- `npm run build` already runs `prisma generate`.

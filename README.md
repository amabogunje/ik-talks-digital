# IK Talks Digital

Premium MVP learning platform for communication, public speaking, and MC/hosting skills with a cinematic African-first feel.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Cookie-based auth for MVP flows

## Local setup

1. Create a PostgreSQL database and set `DATABASE_URL` in `.env`
2. `cmd /c npm install`
3. `copy .env.example .env`
4. Update `.env` with your real Postgres connection string
5. `cmd /c npm run prisma:generate`
6. `cmd /c npm run prisma:push`
7. `cmd /c npm run seed`
8. `cmd /c npm run dev`

## Vercel deployment

1. Push this project to GitHub
2. Create a Neon Postgres database from your Vercel project's `Storage` or `Marketplace`
3. Add `DATABASE_URL` to the Vercel project environment variables
4. Import the repo into Vercel and deploy
5. After the first deploy, run the seed once against the hosted database

The `postinstall` and `vercel-build` scripts handle Prisma generation and schema push during deployment.

## Demo accounts

- Learner: `ada@iktalks.africa` / `password123`
- Admin: `admin@iktalks.africa` / `password123`

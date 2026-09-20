# Typeflow — Typeahead Search

React frontend + Spring Boot API + PostgreSQL (Supabase).

## Stack

- **Frontend:** React (Vite) with debounced autocomplete UI
- **Backend:** Spring Boot 3 + Spring Data JPA
- **Database:** PostgreSQL on Supabase (`search_items` table)

## Deploy on Vercel

Spring Boot cannot run on Vercel. Production uses the React app in `frontend/` plus a Node serverless function at `frontend/api/search.js` that queries the same Supabase `search_items` table via PostgREST.

### Option A — Vercel Dashboard (recommended)

1. Open [vercel.com/new](https://vercel.com/new) and import `ropenflash/ropeServer`
2. Set **Root Directory** to `frontend`
3. Framework preset: **Vite** (auto-detected)
4. Add environment variables:
   - `SUPABASE_URL` = `https://zgwtehnofcahlrzeselb.supabase.co`
   - `SUPABASE_ANON_KEY` = your project anon key (Supabase → Project Settings → API)
5. Deploy

### Option B — CLI

```bash
cd frontend
npx vercel login
npx vercel link   # root directory: frontend
npx vercel env add SUPABASE_URL
npx vercel env add SUPABASE_ANON_KEY
npx vercel --prod
```

## Quick start (local)

### 1. Database

Schema and seed data are already applied to the Supabase project. For local Spring Boot without a remote password, a local Postgres database works the same way:

```bash
# local defaults used by application.yml
# host: localhost, db: typeahead, user/pass: typeahead
```

To point Spring Boot at Supabase, copy the **Session pooler JDBC** string from the Supabase dashboard (Connect → Session pooler → JDBC) and set:

```bash
export SUPABASE_DB_URL='jdbc:postgresql://aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres?user=postgres.zgwtehnofcahlrzeselb&password=YOUR_PASSWORD&sslmode=require'
export SUPABASE_DB_USER='postgres.zgwtehnofcahlrzeselb'
export SUPABASE_DB_PASSWORD='YOUR_PASSWORD'
```

### 2. Backend (Spring Boot, optional locally)

```bash
cd backend
mvn spring-boot:run
```

API: `GET http://localhost:8080/api/search?q=react`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 and start typing. Vite proxies `/api` to Spring Boot on `:8080`.

## API

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `GET /api/search?q=&limit=` | Typeahead suggestions (default limit 8, max 20) |

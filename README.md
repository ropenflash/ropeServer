# Typeflow — Typeahead Search

React frontend + Spring Boot API + PostgreSQL (Supabase).

## Stack

- **Frontend:** React (Vite) with debounced autocomplete UI
- **Backend:** Spring Boot 3 + Spring Data JPA
- **Database:** PostgreSQL on Supabase (`search_items` table)

## Deploy on Vercel

The React app + a Vercel serverless `/api/search` function deploy from `frontend/`.
(Spring Boot cannot run on Vercel; use it locally or self-host. Production search uses Supabase PostgREST.)

Required env vars on the Vercel project:

- `SUPABASE_URL` — e.g. `https://zgwtehnofcahlrzeselb.supabase.co`
- `SUPABASE_ANON_KEY` — project anon / publishable key

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

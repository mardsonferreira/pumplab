# pumplab frontend

Next.js frontend for the pumplab monorepo. Consumes the backend API via `NEXT_PUBLIC_API_URL`.

## Prerequisites

- Node.js 18+
- pnpm

## Setup

```bash
cd frontend
pnpm install
```

## Run

```bash
cd frontend
pnpm dev
```

App: http://localhost:3000 (or the port shown in the terminal).

## Environment

- **NEXT_PUBLIC_API_URL** — Backend base URL for all API calls (e.g. `http://localhost:8000`). Used by `frontend/src/lib/api/client.ts`.
- **NEXT_PUBLIC_SUPABASE_URL**, **NEXT_PUBLIC_SUPABASE_ANON_KEY** — Supabase client config (auth, public data). No server-side secrets in the frontend.

`frontend/src/lib/api/client.ts` sends `credentials: include` and also attaches `Authorization: Bearer <token>` when available, which helps in cross-domain deployments.

## Backend

The frontend expects the backend to be running (see [backend/README.md](../backend/README.md)). To run both: start the backend on port 8000, then the frontend on port 3000; keep `NEXT_PUBLIC_API_URL` and the backend `ALLOWED_ORIGINS` in sync.

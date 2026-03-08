# PumpLab

AI-powered content generation tool for personal trainers to create Instagram Reels and Carousel posts.

This repository is a **monorepo** with a clear separation between frontend and backend.

## Structure

| Directory   | Responsibility |
|------------|-----------------|
| **frontend/** | Next.js 14 app (App Router). UI, pages, components. Consumes the backend API. |
| **backend/**  | FastAPI app. API, auth cookies endpoint, Stripe webhooks, OpenAI. |

## Quick start

### Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

- API docs: http://localhost:8000/docs
- See [backend/README.md](backend/README.md) for env vars and commands.

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

- App: http://localhost:3000
- See [frontend/README.md](frontend/README.md) for env vars and backend reference.

### Run both (rodar em paralelo)

Use two terminals: run the backend on port 8000 and the frontend on port 3000. Keep `NEXT_PUBLIC_API_URL` (frontend) and `ALLOWED_ORIGINS` (backend) in sync.

From root: `pnpm run dev:backend` (terminal 1) and `pnpm run dev:frontend` (terminal 2).

Configure the Stripe webhook (see backend/README.md) and the Supabase auth redirect to the frontend (e.g. `http://localhost:3000/auth/callback`).

## Auth flow notes

- Supabase OAuth redirect is handled by `frontend/src/app/auth/callback/route.ts` (`/auth/callback` in frontend).
- That route exchanges the code for a session and performs best-effort backend cookie sync via `POST /auth/set-cookies`.
- Backend API auth accepts both backend cookies and `Authorization: Bearer <token>` for cross-domain deployments.

## Root scripts

From repo root (with pnpm):

- `pnpm run dev:frontend` — start frontend dev server
- `pnpm run build:frontend` — build frontend
- `pnpm run lint:frontend` — lint frontend

## Tech stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: FastAPI, Python 3.12+, Supabase, Stripe, OpenAI

## License

MIT

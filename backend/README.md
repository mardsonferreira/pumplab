# pumplab backend

FastAPI backend for the pumplab monorepo. Handles API, auth cookies endpoint, Stripe webhooks, and OpenAI.

## Prerequisites

- Python 3.12+
- [uv](https://docs.astral.sh/uv/)

## Setup

```bash
cd backend
uv sync
```

## Run

```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Environment

Copy `backend/.env.example` to `.env` and set:

- **ALLOWED_ORIGINS** — Comma-separated CORS origins (e.g. `http://localhost:3000`)
- **FRONTEND_URL** — Frontend base URL for redirects (e.g. `http://localhost:3000`)
- **SUPABASE_URL**, **SUPABASE_SERVICE_ROLE_KEY**, **SUPABASE_ANON_KEY**
- **STRIPE_SECRET_KEY**, **STRIPE_WEBHOOK_SECRET**
- **OPENAI_API_KEY**

Configure Supabase redirect URL to the frontend auth callback (e.g. `http://localhost:3000/auth/callback`). Configure Stripe webhook to `https://your-backend/stripe/webhook` (use Stripe CLI for local forwarding).

The backend supports authentication via `Authorization: Bearer <token>` and backend-domain cookies (`sb-access-token`) to work in same-domain and cross-domain deployments.

## Tests

```bash
cd backend
uv run pytest
```

## Lint

```bash
cd backend
uv run ruff check .
```

## See also

- To run with the frontend: start the backend on port 8000 and the frontend on port 3000; keep `ALLOWED_ORIGINS` and the frontend `NEXT_PUBLIC_API_URL` in sync.

# Quickstart: Instagram Carousel Flow

**Branch**: `002-instagram-carousel-flow`

This quickstart validates the end-to-end carousel workflow with fixed 5 slides, per-slide retry, and ZIP download.

## Prerequisites

- Node.js 18+ and pnpm
- Python 3.12+ and uv
- Valid environment variables for frontend and backend (`NEXT_PUBLIC_API_URL`, `OPENAI_API_KEY`, Supabase auth vars)

## Run locally

### Backend

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

## Manual validation flow

1. Authenticate and open dashboard.
2. Select a narrative suggestion and generate options.
3. Pick one narrative and edit fields:
   - central thesis
   - main argument
   - 5 narrative steps
4. Trigger **Carrossel/Story** generation.
5. Confirm preview renders 5 slides with coherent text/image pairing.
6. Force or simulate partial image failure and retry only failed slides.
7. Confirm previously successful slides stay unchanged after retry.
8. Click **Baixar Post** and verify download of ZIP package.
9. Extract ZIP and verify structure:
   - `post/slide_01.png` ... `post/slide_05.png`
   - `post/caption.txt`

## Negative checks

- Try generating with one empty required narrative field -> action blocked with field-specific message.
- Change narrative after a successful generation -> preview/download state invalidated until regeneration.
- Try downloading before full generation -> blocked with actionable guidance.
- Simulate unstable connection on download -> show retry path without forcing full regeneration.

## Suggested automated checks

### Backend

```bash
cd backend
uv run pytest
uv run ruff check .
```

### Frontend

```bash
cd frontend
pnpm lint
```

# Quickstart: Server-Side Narrative Prompt (Theme-Only API)

**Branch**: `004-narrative-theme-server-side` | **Date**: 2026-04-05

Use this checklist after implementation to verify behavior end-to-end.

## Prerequisites

- Backend and frontend running with valid auth (same as existing dashboard flow).
- `OPENAI_API_KEY` set (or `USE_MOCK_LLM` for deterministic mock narratives in dev).

## Manual checks

1. **Happy path**
   - Open `/dashboard`.
   - Enter a short theme (e.g. “Disciplina no treino”) and submit.
   - Expect five narrative cards as before; no console errors; network request body contains **`theme`** only (not `prompt`).

2. **Empty theme**
   - Submit blocked in UI (existing `trim` check) OR if API called with empty theme, expect **422** with clear error.

3. **Long theme**
   - Paste > 2000 characters; expect **422** from API (and optional client-side max length if implemented).

4. **Stale client simulation** (optional)
   - `curl` with `{"prompt":"ignore instructions"}` and auth header → expect **422** / not executed as full LLM prompt.

5. **Regression**
   - Select a narrative and run carousel flow; no change expected from this feature alone.

## Automated tests (developer)

- Run backend tests: `pytest backend/tests/test_openai_routes.py` (or project’s test command).
- Run frontend lint/typecheck per repo convention.

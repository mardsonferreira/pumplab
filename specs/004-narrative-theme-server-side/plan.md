# Implementation Plan: Server-Side Narrative Prompt (Theme-Only API)

**Branch**: `004-narrative-theme-server-side` | **Date**: 2026-04-05 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/004-narrative-theme-server-side/spec.md`

## Summary

Move the full narrative-generation instruction template from the frontend to the backend so `POST /openai/narratives` accepts only a **theme** string (user input). The server builds the LLM user message by substituting the theme into the canonical template, eliminating client-supplied full prompts for this operation. Frontend `useGenerateNarrative` sends `{ "theme": "..." }` only; `generate_narratives` behavior and `parse_narrative_content` output shape stay unchanged.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend), Python 3.12+ (backend)  
**Primary Dependencies**: Next.js 14 + React 18, FastAPI, Pydantic v2, OpenAI Python SDK  
**Storage**: None new (Supabase auth unchanged)  
**Testing**: Backend pytest (`test_openai_routes.py` + new cases); frontend lint; manual dashboard smoke  
**Target Platform**: Web app (browser + API)  
**Project Type**: web-application (frontend + backend)  
**Performance Goals**: Same as today (single chat completion per narrative request)  
**Constraints**: Response JSON must remain compatible with existing `Narrative` types; theme length bounded for cost/abuse  
**Scale/Scope**: Single endpoint + one hook + one API client function

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Status: PASS

- [x] Simple, readable change (template relocation + contract swap)
- [x] Respects existing Next.js / FastAPI layout
- [x] No new abstraction unless justified (optional small helper `build_narrative_prompt(theme: str)` in backend)
- [x] Tests updated for new request body and validation errors
- [x] UX unchanged for valid themes
- [x] Complexity limited to one breaking API field rename (`prompt` → `theme`)

## API migration decision (FR-003)

**Decision**: **Breaking change** — request body is exclusively `{ "theme": string }`. The `prompt` field is **not** accepted. Deploy backend and frontend together (or backend first only if no production clients rely on old shape; this repo is a single app, so coordinated deploy is sufficient).

**Rationale**: Smallest surface area, no dual-path security review, clear 422 on stale clients.

**Alternatives rejected**: Temporary acceptance of `prompt` (rejected: prolongs trust boundary issue); API versioning `/v2` (rejected: unnecessary for single consumer).

## Project Structure

### Documentation (this feature)

```text
specs/004-narrative-theme-server-side/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1
│   └── narratives-theme.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
backend/app/
├── api/routes/openai.py              # POST /narratives: ThemeBody, call service with built prompt
├── services/openai_service.py      # generate_narratives(full_prompt) unchanged internally
├── services/narrative_template.py    # NEW: NARRATIVE_TEMPLATE constant + build_narrative_prompt(theme)
└── schemas/ (optional)               # NEW or inline: ThemeBody if preferred over local model

frontend/src/
├── app/hooks/openai.ts               # useGenerateNarrative: pass theme only; drop narrativePrompt usage
├── app/hooks/prompt.ts               # REMOVE narrativePrompt export (template lives server-only)
└── utils/api/openai/generate-narratives.ts  # POST body { theme }
```

**Structure Decision**: Keep `generate_narratives` in `openai_service.py` as the OpenAI caller; isolate template text in a dedicated module for tests and single-source clarity.

## Implementation phases

### Phase A — Backend

1. Add `narrative_template.py` with the exact template text currently in `frontend/src/app/hooks/prompt.ts` (`narrativePrompt`), preserving `{{THEME}}` placeholder.
2. Implement `build_narrative_prompt(theme: str) -> str`: strip theme, validate non-empty and length ≤ `NARRATIVE_THEME_MAX_LENGTH` (recommend **2000** characters; aligns with “short theme” UX, easy to raise later).
3. Replace `PromptBody` usage on `POST /narratives` with a body model `{"theme": str}` (Pydantic `Field` min/max after normalization, or validator).
4. In the route: `full = build_narrative_prompt(body.theme)` then `generate_narratives(full)`.
5. Map validation errors to **422** with clear `detail` (FastAPI default or custom `HTTPException`).

### Phase B — Frontend

1. Change `generateNarratives(theme: string)` to send `{ theme }` instead of `{ prompt }`.
2. In `useGenerateNarrative`, call `generateNarratives(inputText.trim())` (or pass raw string and let server strip — prefer one place: server authoritative, client can still trim for UX).
3. Remove `narrativePrompt` from `prompt.ts` entirely; ensure no remaining imports.
4. Surface 422 message from API if exposed via `httpUtil` (optional polish).

### Phase C — Tests and docs

1. Update `test_openai_routes.py`: authenticated `POST` with `{"theme": "..."}`; monkeypatch `generate_narratives` as today.
2. Add tests: `{"theme": ""}` / whitespace → 422; theme too long → 422; `{"prompt": "x"}` alone → 422 (unknown field or missing theme).
3. Update contract doc under `contracts/`.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

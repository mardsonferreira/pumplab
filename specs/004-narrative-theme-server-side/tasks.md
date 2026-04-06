# Tasks: Server-Side Narrative Prompt (Theme-Only API)

**Input**: Design documents from `/specs/004-narrative-theme-server-side/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Backend pytest for route + validation; frontend lint; manual steps in `quickstart.md`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependency)
- **[Story]**: `US1` = same narrative UX; `US2` = server-owned prompt / security
- Every task includes an exact file path

---

## Phase 1: Backend — template + validation

**Purpose**: Canonical prompt on server; `build_narrative_prompt(theme)` enforces trim + length (1–2000).

- [x] T001 Add `NARRATIVE_THEME_MAX_LENGTH` and full template text (parity with former `narrativePrompt` in `frontend/src/app/hooks/prompt.ts`) plus `build_narrative_prompt(theme: str) -> str` in `backend/app/services/narrative_template.py`
- [x] T002 [P] Add unit tests for `build_narrative_prompt` (empty/whitespace raises; overlong raises; happy path contains theme substring) in `backend/tests/test_narrative_template.py`

**Checkpoint**: Template module importable; validation logic covered.

---

## Phase 2: Backend — API contract

**Purpose**: `POST /openai/narratives` accepts `{ "theme" }` only; no execution of client `prompt`.

- [x] T003 Define request model `NarrativesThemeBody` (or equivalent) with `theme: str`, forbid extra fields so `{"prompt": "..."}` yields **422**, in `backend/app/api/routes/openai.py` or `backend/app/schemas/` (if extracted)
- [x] T004 Wire `post_narratives` to validate body, call `build_narrative_prompt(body.theme)`, then `generate_narratives(full_prompt)` in `backend/app/api/routes/openai.py`
- [x] T005 Keep `PromptBody` for `POST /openai/carousel-master-prompt` unchanged in `backend/app/api/routes/openai.py`

**Checkpoint**: Authenticated call with `{"theme": "x"}` reaches `generate_narratives` with built string; `prompt` key rejected.

---

## Phase 3: Frontend — client + hook

**Purpose**: Send theme only; remove bundled narrative template.

- [x] T006 Change `generateNarratives` to POST `{ theme }` (rename parameter to `theme`) in `frontend/src/utils/api/openai/generate-narratives.ts`
- [x] T007 [US1] Update `useGenerateNarrative` to call `generateNarratives` with user theme only (remove `narrativePrompt.replace`) in `frontend/src/app/hooks/openai.ts`
- [x] T008 [US2] [P] Remove `narrativePrompt` export and its string block from `frontend/src/app/hooks/prompt.ts`; fix imports (carousel code still uses `carouselMasterPrompt`, `buildCarouselPromptFromDraft`)

**Checkpoint**: Dashboard narrative generation works; `narrativePrompt` absent from client bundle.

---

## Phase 4: Automated tests + polish

**Purpose**: Contract tests and repo hygiene.

- [x] T009 Update authenticated narrative test to use `{"theme": "test"}` and monkeypatch `generate_narratives` in `backend/tests/test_openai_routes.py`
- [x] T010 [P] Add tests: empty/whitespace theme → 422; theme length > 2000 → 422; body `{"prompt": "only"}` → 422, in `backend/tests/test_openai_routes.py`
- [x] T011 [P] Run backend tests (`pytest backend/tests/test_openai_routes.py backend/tests/test_narrative_template.py`)
- [x] T012 [P] Run frontend lint in `frontend/` per `package.json`
- [x] T013 Validate manual checklist in `specs/004-narrative-theme-server-side/quickstart.md` (automated parity: pytest + lint; run dashboard smoke when deploying)

---

## Dependencies & execution order

```text
T001 → T002 (template tests depend on module)
T001 → T003 → T004 → T005 (route depends on builder)
T004 → T006 → T007 → T008 (frontend after API stable; T006–T008 sequential on same feature)
T004 + T008 → T009 → T010 → T011 → T012 → T013
```

**Parallel opportunities**: T002 can follow T001; T010 can follow T009; T011–T012 parallel after T010.

---

## Traceability

| Task | spec.md |
|------|---------|
| T001–T005 | FR-002, FR-003, FR-004, FR-005 |
| T006–T008 | FR-001, FR-006, US1, US2 |
| T009–T013 | SC-001–SC-003, success criteria |

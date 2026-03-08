# Tasks: Finalizar fluxo de carrossel Instagram

**Input**: Design documents from `specs/002-instagram-carousel-flow/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Keep test scope lean for this feature: prioritize essential backend pytest coverage for high-risk behavior (retry parcial e export ZIP), plus manual validation per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/app/`, `backend/tests/`
- **Frontend**: `frontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependencies for the feature

- [x] T001 Verify project structure and backend/frontend paths per plan.md (backend/app/api/routes/openai.py, backend/app/services/openai_service.py, frontend/src/components/post, frontend/src/utils/api/openai) and confirm existing narrative suggestion/option selection flow remains compatible with the new pipeline (no reimplementation)
- [x] T002 Check existing backend libraries for image fetch/ZIP generation first; only add a new runtime dependency in backend/pyproject.toml if a real gap is confirmed, with a short justification in the task/PR notes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared schemas and types that all user stories depend on

**Checkpoint**: Foundation ready — user story implementation can proceed

- [x] T003 Define backend Pydantic schemas for carousel payloads (carousel-master-prompt response: style + caption + slides with role, text, image_prompt; carousel-images request/response; carousel-export request) in backend/app/api/routes/openai.py or backend/app/schemas/
- [x] T004 [P] Define frontend types for CarouselSlide, PostPreview, and NarrativeDraft alignment with data-model.md in frontend/src/types.ts or feature-specific types file
- [x] T005 Ensure new carousel routes (carousel-master-prompt, carousel-images, carousel-export) use existing auth via get_current_user_id in backend/app/api/routes/openai.py and backend/app/api/deps.py

---

## Phase 3: User Story 1 — Gerar carrossel alinhado com narrativa (Priority: P1) — MVP

**Goal**: User can choose a narrative, review texts, and generate a carousel where each image reflects the corresponding slide text.

**Independent Test**: Select a narrative suggestion → pick one option → adjust thesis, argument, and steps → click "Carrossel/Story"; result shows 5 slides with coherent text and image per slide.

### Implementation for User Story 1

- [x] T006 [US1] Ensure carousel-master-prompt returns JSON with `style`, `caption`, and `slides` (5 items: role, text, image_prompt) and parse/validate in backend/app/services/openai_service.py
- [x] T007 [P] [US1] Use Pydantic response model for carousel-master-prompt in backend/app/api/routes/openai.py so response matches contract (content with style, caption, and slides)
- [x] T008 [P] [US1] Use typed request/response models for carousel-images in backend/app/api/routes/openai.py (slides with image_prompt; response urls array)
- [x] T009 [US1] Build frontend prompt from NarrativeDraft for carousel-master-prompt (tese, argumento, sequência) in frontend/src/utils/api/openai or frontend/src/app/hooks/openai.ts
- [x] T010 [US1] Wire frontend flow: call carousel-master-prompt then carousel-images, store slides with status (pending/success/failed) in frontend state (e.g. frontend/src/utils/stores/dashboard/narrative or components)
- [x] T011 [US1] Add required-field validation before generation and field-specific error messages in frontend (block submit when central_thesis, main_argument, or any narrative step is empty)
- [x] T012 [US1] Implement per-slide retry: send only failed slides to POST /openai/carousel-images and merge returned URLs into existing slides in frontend
- [x] T013 [US1] Render preview of 5 slides with text and image (loading/error per slide) in frontend/src/components/post or frontend/src/components/common/carousel
- [x] T014 [US1] Invalidate carousel and preview when user edits narrative (discard generated slides and ready_to_download state on draft edit) in frontend

**Checkpoint**: User Story 1 is testable end-to-end: narrative → generate → preview with text/image alignment and per-slide retry

---

## Phase 4: User Story 2 — Refinar prompts para consistência (Priority: P2)

**Goal**: Prompts are organized so results keep tone, theme, and narrative progression with less undue variation.

**Independent Test**: Generate multiple carousels with similar inputs; verify results maintain consistent tone, theme, and logical progression between slides.

### Implementation for User Story 2

- [x] T015 [US2] Add shared global style context to carousel master prompt and to each image prompt in backend/app/services/openai_service.py
- [x] T016 [US2] Ensure image generation prompts combine global style, slide description, and typography instructions in backend/app/services/openai_service.py
- [x] T017 [US2] Align frontend prompt builder with narrative progression (theme, order) when building the prompt for carousel-master-prompt in frontend

**Checkpoint**: User Story 2 delivers more consistent carousel output across runs

---

## Phase 5: User Story 3 — Baixar postagem pronta (Priority: P3)

**Goal**: User can download the post as a ZIP (post/slide_01.png … slide_05.png + caption.txt) when generation is complete.

**Independent Test**: After generating a full carousel, click "Baixar Post"; receive ZIP; extract and verify post/slide_01.png … post/slide_05.png and post/caption.txt.

### Implementation for User Story 3

- [x] T018 [US3] Implement POST /openai/carousel-export in backend: accept caption and 5 slides (index, image_url, text), fetch images via HTTP, build ZIP with post/slide_01.png … post/slide_05.png and post/caption.txt, return application/zip with filename instagram_post_<timestamp>.zip in backend/app/api/routes/openai.py
- [x] T019 [US3] Enable "Baixar Post" only when ready_to_download (all 5 slides success and caption present) and call carousel-export to trigger file download in frontend (e.g. frontend/src/components/post/index.tsx)
- [x] T020 [US3] On carousel-export failure (400/502), show actionable message and allow retry without regenerating content in frontend (message must state the issue, suggest immediate next action, and preserve already valid state)

**Checkpoint**: User Story 3 is testable: full carousel → Baixar Post → valid ZIP; download blocked when incomplete; retry on failure

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validation and quality checks across the feature

- [ ] T021 [P] Run quickstart.md manual validation (auth → narrative → generate → preview → retry failed slide → download → verify ZIP structure)
- [x] T022 [P] Run backend lint (ruff) and frontend lint (pnpm lint) and fix reported issues in backend/ and frontend/
- [x] T023 Add one backend pytest covering partial retry behavior (only failed slides are regenerated, successful slides remain unchanged) under backend/tests/
- [x] T024 Add one backend pytest covering carousel-export ZIP structure (post/slide_01.png … slide_05.png + post/caption.txt) under backend/tests/

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational — no dependency on US2/US3
- **User Story 2 (Phase 4)**: Depends on Foundational; refines US1 prompts — best after US1
- **User Story 3 (Phase 5)**: Depends on Foundational; uses US1 preview state — best after US1
- **Polish (Phase 6)**: Depends on all user stories to be complete

### User Story Dependencies

- **US1 (P1)**: Start after Phase 2. Delivers core carousel generation and preview.
- **US2 (P2)**: Start after Phase 2; refines US1 prompt pipeline. Can overlap with US1 if prompt modules are isolated.
- **US3 (P3)**: Start after Phase 2; requires US1 preview/slides state for download. Implement after US1.

### Within Each User Story

- Backend schemas/models before route behavior changes
- Service layer (prompt logic) before or with route updates
- Frontend types and API calls before UI wiring
- Validation and error handling before polish

### Parallel Opportunities

- T002 can run in parallel with T001
- T004 can run in parallel with T003
- T007 and T008 can run in parallel (different request/response models)
- T015 and T016 can run in parallel (same file but distinct prompt areas)
- T021 and T022 can run in parallel
- T023 and T024 can run in parallel

---

## Parallel Example: User Story 1

```text
# After T006, backend route typing can be done in parallel:
T007: Use Pydantic response model for carousel-master-prompt in backend/app/api/routes/openai.py
T008: Use typed request/response models for carousel-images in backend/app/api/routes/openai.py
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Manual test per quickstart (narrative → generate → preview → retry)
5. Demo or iterate

### Incremental Delivery

1. Setup + Foundational → shared types and auth
2. Add US1 → test narrative-to-preview flow (MVP)
3. Add US2 → test prompt consistency
4. Add US3 → test download and ZIP structure
5. Polish → quickstart validation and lint

### Suggested Order for Single Developer

1. T001 → T002 → T003 → T004 → T005
2. T006 → T007 → T008 → T009 → T010 → T011 → T012 → T013 → T014
3. T015 → T016 → T017
4. T018 → T019 → T020
5. T021 → T022 → T023 → T024

---

## Notes

- [P] tasks use different files or independent changes and can be parallelized
- [Story] label links tasks to spec.md user stories for traceability
- Each user story is independently testable per Independent Test criteria
- During implementation, add short comments in English only for non-obvious logic, especially business rules and flow decisions; avoid redundant comments.
- Commit after each task or logical group
- Backend already has POST /openai/narratives, carousel-master-prompt, and carousel-images; tasks refine contract compliance and add carousel-export

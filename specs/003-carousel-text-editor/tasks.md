# Tasks: Carousel Overlay Editing

**Input**: Design documents from `/specs/003-carousel-text-editor/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Scope note**: Product delivery is **text overlays only**. Tasks that referred to shapes, `OverlayEditor`, or separate control panels are **removed/superseded**; implementation lives in `post/index.tsx`, `OverlayCanvas.tsx`, `FloatingTextToolbar.tsx`, and overlay module helpers.

**Tests**: Include focused automated coverage for frontend overlay behavior and contract/export regressions, plus quickstart manual validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (`US1` core text, `US2` polish + export)
- Every task includes an exact file path

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Feature module skeleton and base types.

- [X] T001 Create overlay editor module folder structure in `frontend/src/components/post/overlay-editor/`
- [X] T002 [P] Add overlay domain type definitions (text-only) in `frontend/src/types.ts`
- [X] T003 [P] Create overlay utility constants and bounds helpers in `frontend/src/components/post/overlay-editor/constants.ts`
- [X] T004 [P] Create text overlay factory in `frontend/src/components/post/overlay-editor/factories.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Session state, generation prompts, export contract.

- [X] T005 Extend `PostPreview` and slide types for per-slide overlay session state in `frontend/src/types.ts`
- [X] T006 Implement overlay session store actions/selectors in `frontend/src/utils/stores/dashboard/narrative/index.tsx`
- [X] T007 [P] Update carousel master prompt rules for image-first slides without baked text in `frontend/src/app/hooks/prompt.ts`
- [X] T008 [P] Remove image typography instruction from image generation prompt builder in `backend/app/services/openai_service.py`
- [X] T009 Initialize overlay state from returned slide text in `frontend/src/app/hooks/openai.ts`
- [X] T010 Extend export API client for optional `flattened_image_base64` per slide in `frontend/src/utils/api/openai/export-carousel-post.ts`
- [X] T011 Extend export API schema in `backend/app/schemas/carousel.py`
- [X] T012 Export route precedence (`flattened_image_base64` over `image_url`) in `backend/app/api/routes/openai.py`

**Checkpoint**: Foundation ready.

---

## Phase 3: User Story 1 - Text overlays on slides (P1)

**Goal**: Create/edit/move/recolor text overlays per slide with immediate feedback and in-session persistence.

**Independent Test**: Generate carousel, edit text, add boxes, move within bounds, switch slides and return.

- [X] T013 [P] [US1] Overlay reducer (add/delete/update/move text) in `frontend/src/components/post/overlay-editor/state.ts`
- [X] T014 [P] [US1] Pointer drag + bounds clamp in `frontend/src/components/post/overlay-editor/use-overlay-drag.ts`
- [X] T015 [P] [US1] Text fit (wrap, auto-size, overflow flag) in `frontend/src/components/post/overlay-editor/text-fit.ts`
- [X] T016 [US1] Canvas renderer for text over slide image in `frontend/src/components/post/overlay-editor/OverlayCanvas.tsx`
- [X] T017 [US1] Post screen integration: carousel, add-text control, floating toolbar in `frontend/src/components/post/index.tsx`
- [X] T018 [US1] Floating toolbar for size/color/delete in `frontend/src/components/post/overlay-editor/FloatingTextToolbar.tsx`
- [X] T019 [US1] Carousel active slide + overlay context in `frontend/src/components/common/carousel/index.tsx`

**Checkpoint**: Text overlay MVP complete.

---

## Phase 4: User Story 2 - Export + resilience (P2)

**Goal**: WYSIWYG export and usable editor when an image fails.

- [X] T020 [P] [US2] Slide flattening in `frontend/src/components/post/overlay-editor/export/flatten-slide.ts`
- [X] T021 [US2] Flatten before download in `frontend/src/components/post/index.tsx`
- [X] T022 [US2] Export client mapping in `frontend/src/utils/api/openai/export-carousel-post.ts`
- [X] T023 [US2] API tests for flattened precedence in `backend/tests/test_carousel_retry_export.py`
- [X] T024 [US2] Image-failure fallback while keeping overlays in `frontend/src/components/post/overlay-editor/OverlayCanvas.tsx`

**Checkpoint**: Export matches preview; failed slides still editable where specified.

---

## Phase 5: Polish

- [X] T025 [P] Frontend lint via `frontend/package.json` script `lint`
- [X] T026 [P] Backend carousel export tests in `backend/tests/test_carousel_retry_export.py`
- [ ] T027 Validate manual checklist in `specs/003-carousel-text-editor/quickstart.md`
- [X] T028 [P] Reducer/unit tests in `frontend/src/components/post/overlay-editor/state.test.ts`
- [X] T029 [P] Text-fit tests in `frontend/src/components/post/overlay-editor/text-fit.test.ts`
- [X] T030 [P] Session/drag/max-limits tests in `frontend/src/components/post/overlay-editor/overlay-session.test.ts`

---

## Dependencies & Execution Order

- **Phase 2** depends on Phase 1; blocks Phase 3–4.
- **Phase 3** (text UI) before Phase 4 (export uses same overlay model).
- **Phase 5** after functional phases.

---

## Parallel Opportunities

- **Foundation**: T007 and T008; T010 and T011 in parallel.
- **US1**: T013, T014, T015 in parallel before T016–T019.
- **US2**: T020 and T023 in parallel while T021–T022 integrate.
- **Polish**: T025, T026, T028, T029, T030 in parallel.

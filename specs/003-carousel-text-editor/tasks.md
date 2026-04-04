# Tasks: Carousel Overlay Editing

**Input**: Design documents from `/specs/003-carousel-text-editor/`
**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Include focused automated coverage for frontend overlay behavior and contract/export regressions, plus quickstart manual validation per story.
**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`)
- Every task includes an exact file path

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the feature module skeleton and align base types/contracts before story work.

- [X] T001 Create overlay editor module folder structure in `frontend/src/components/post/overlay-editor/`
- [X] T002 [P] Add overlay domain type definitions in `frontend/src/types.ts`
- [X] T003 [P] Create overlay utility constants and guards (limits, bounds helpers) in `frontend/src/components/post/overlay-editor/constants.ts`
- [X] T004 [P] Create overlay element factory helpers for text/shape defaults in `frontend/src/components/post/overlay-editor/factories.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared state and generation/export contract changes that all stories depend on.

**⚠️ CRITICAL**: No user story work should start before this phase is complete.

- [X] T005 Extend `PostPreview` and slide types for per-slide overlay session state in `frontend/src/types.ts`
- [X] T006 Implement overlay session store actions/selectors in `frontend/src/utils/stores/dashboard/narrative/index.tsx`
- [X] T007 [P] Update carousel master prompt rules to request image-first slides without baked text in `frontend/src/app/hooks/prompt.ts`
- [X] T008 [P] Remove image typography/text-overlay instruction from image generation prompt builder in `backend/app/services/openai_service.py`
- [X] T009 Update carousel generation hook to initialize overlay state from returned slide text in `frontend/src/app/hooks/openai.ts`
- [X] T010 Extend export API client request types/interfaces to support optional `flattened_image_base64` per slide in `frontend/src/utils/api/openai/export-carousel-post.ts`
- [X] T011 Extend export API schema to accept `flattened_image_base64` in `backend/app/schemas/carousel.py`
- [X] T012 Implement export route precedence (`flattened_image_base64` over `image_url`) in `backend/app/api/routes/openai.py`

**Checkpoint**: Foundation ready - user story implementation can begin.

---

## Phase 3: User Story 1 - Edit text directly on slide image (Priority: P1) 🎯 MVP

**Goal**: Let users create/edit/move/resize/recolor text overlays per slide with immediate feedback and in-session persistence.

**Independent Test**: Generate carousel, edit/add text overlays, move/resize/recolor, switch slides and return, verify state remains per slide in same session.

### Implementation for User Story 1

- [X] T013 [P] [US1] Implement overlay state reducer/actions for text edit/move/resize/delete in `frontend/src/components/post/overlay-editor/state.ts`
- [X] T014 [P] [US1] Implement pointer drag and bounds clamp hooks for overlays in `frontend/src/components/post/overlay-editor/use-overlay-drag.ts`
- [X] T015 [P] [US1] Implement text fit logic (wrap + auto-size + overflow warning flag) in `frontend/src/components/post/overlay-editor/text-fit.ts`
- [X] T016 [US1] Implement overlay canvas renderer for text elements over slide image in `frontend/src/components/post/overlay-editor/OverlayCanvas.tsx`
- [X] T017 [US1] Implement text controls panel (content, color, font size, add/delete text box) in `frontend/src/components/post/overlay-editor/TextControls.tsx`
- [X] T018 [US1] Integrate overlay editor shell into post screen in `frontend/src/components/post/index.tsx`
- [X] T019 [US1] Refactor carousel presentation to support active slide selection + overlay editing context in `frontend/src/components/common/carousel/index.tsx`
- [X] T020 [US1] Add UX feedback for text overflow warning and bounds-limit messages in `frontend/src/components/post/overlay-editor/OverlayFeedback.tsx`

**Checkpoint**: User Story 1 works independently and is demo-ready as MVP.

---

## Phase 4: User Story 2 - Add simple visual highlight elements (Priority: P2)

**Goal**: Let users add/edit/move shapes (rectangle, rounded rectangle, circle) with color/fill/opacity and layer controls.

**Independent Test**: Add each supported shape type, style it, move it, and adjust layer order while keeping editability and bounds rules.

### Implementation for User Story 2

- [X] T021 [P] [US2] Extend overlay state/actions for shape create/update/delete and shape defaults behind text in `frontend/src/components/post/overlay-editor/state.ts`
- [X] T022 [P] [US2] Implement shape rendering styles (rectangle, rounded rectangle, circle; fill/opacity) in `frontend/src/components/post/overlay-editor/ShapeLayer.tsx`
- [X] T023 [US2] Implement shape controls panel (type, color, fill toggle, opacity) in `frontend/src/components/post/overlay-editor/ShapeControls.tsx`
- [X] T024 [US2] Implement layer order controls (bring forward/send backward) for selected overlay in `frontend/src/components/post/overlay-editor/LayerControls.tsx`
- [X] T025 [US2] Enforce max 10 combined overlays per slide with clear UI blocking feedback in `frontend/src/components/post/overlay-editor/OverlayEditor.tsx`
- [X] T026 [US2] Wire shape tools and selection model into post editor composition in `frontend/src/components/post/index.tsx`

**Checkpoint**: User Stories 1 and 2 both function independently.

---

## Phase 5: User Story 3 - Keep editing simple and intuitive + export exact preview (Priority: P3)

**Goal**: Keep editor usable end-to-end and ensure download matches preview with flattened overlays.

**Independent Test**: Complete common editing tasks without leaving slide view, then click `Baixar Post` and verify exported images match preview for all overlays.

### Implementation for User Story 3

- [X] T027 [P] [US3] Implement slide flattening utility (image + overlays to PNG base64) in `frontend/src/components/post/overlay-editor/export/flatten-slide.ts`
- [X] T028 [US3] Integrate flattening pipeline into download flow before API call in `frontend/src/components/post/index.tsx`
- [X] T029 [US3] Update export API client mapping to send flattened payload per slide in `frontend/src/utils/api/openai/export-carousel-post.ts`
- [X] T030 [US3] Add API route handling tests for flattened export precedence in `backend/tests/test_carousel_retry_export.py`
- [X] T031 [US3] Add graceful image-failure editor fallback states while preserving overlay editing in `frontend/src/components/post/overlay-editor/OverlayCanvas.tsx`
- [X] T032 [US3] Add readability and interaction hints (contrast cue + selected element clarity) in `frontend/src/components/post/overlay-editor/OverlayFeedback.tsx`
- [X] T033 [US3] Add simple-scope guardrails in editor controls to block unsupported advanced tooling (e.g., rotation, effects, font families) in `frontend/src/components/post/overlay-editor/OverlayEditor.tsx`

**Checkpoint**: All user stories are independently functional and export is WYSIWYG.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Stabilize implementation quality and validate full workflow.

- [X] T034 [P] Run and fix frontend lint issues for touched files via `frontend/package.json` script `lint`
- [X] T035 [P] Run backend test subset for carousel export route in `backend/tests/test_carousel_retry_export.py`
- [ ] T036 Validate full manual acceptance checklist against `specs/003-carousel-text-editor/quickstart.md`
- [X] T037 [P] Document final behavior/contracts updates in `specs/003-carousel-text-editor/quickstart.md`
- [X] T038 [P] Add frontend reducer/unit tests for text/shape actions, per-slide independence, and max-element limits in `frontend/src/components/post/overlay-editor/state.test.ts`
- [X] T039 [P] Add frontend unit tests for text wrapping/auto-size/overflow warning behavior in `frontend/src/components/post/overlay-editor/text-fit.test.ts`
- [X] T040 [P] Add frontend interaction test for drag bounds clamping and slide navigation persistence in `frontend/src/components/post/overlay-editor/OverlayEditor.test.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: no dependencies.
- **Phase 2 (Foundational)**: depends on Phase 1; blocks all user story phases.
- **Phase 3 (US1)**: depends on Phase 2; delivers MVP.
- **Phase 4 (US2)**: depends on Phase 2 and integrates with US1 editor shell.
- **Phase 5 (US3)**: depends on US1 and US2 to export final composed overlays.
- **Phase 6 (Polish)**: depends on all selected stories being complete.

### User Story Dependencies

- **US1 (P1)**: first deliverable; independent after foundation.
- **US2 (P2)**: depends on US1 editor baseline but remains independently testable.
- **US3 (P3)**: depends on overlay model from US1/US2 for final export behavior.

### Within Each User Story

- State/hooks/helpers before UI wiring.
- Rendering before controls integration.
- Export composition before route/test validation.

---

## Parallel Opportunities

- **Foundation**: T007 and T008 can run in parallel; T010 and T011 can run in parallel.
- **US1**: T013, T014, and T015 can run in parallel before T016/T017.
- **US2**: T021 and T022 can run in parallel before T023/T024.
- **US3**: T027 and T030 can run in parallel while T028/T029 integrate client flow.
- **Polish**: T034, T035, T038, T039, and T040 can run in parallel.

---

## Parallel Example: User Story 1

```bash
Task: "T013 [US1] Implement overlay state reducer/actions in frontend/src/components/post/overlay-editor/state.ts"
Task: "T014 [US1] Implement pointer drag hook in frontend/src/components/post/overlay-editor/use-overlay-drag.ts"
Task: "T015 [US1] Implement text fit logic in frontend/src/components/post/overlay-editor/text-fit.ts"
```

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1 and Phase 2.
2. Deliver Phase 3 (US1) end-to-end.
3. Validate US1 independent test before expanding scope.

### Incremental Delivery

1. Add US2 shape tooling without breaking US1 text editing.
2. Add US3 flatten/export fidelity.
3. Run polish phase validation and regression checks.

### Team Parallel Strategy

1. One developer handles backend contract/export tasks (T008, T011, T012, T030).
2. One developer handles frontend state + overlay editor core (T013-T020).
3. One developer handles shapes/export UX integration (T021-T029, T031-T033).
4. One developer handles frontend automated coverage (T038-T040).

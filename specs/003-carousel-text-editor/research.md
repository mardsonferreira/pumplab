# Research: Carousel Overlay Editing

## Decision 1: Keep overlay editor implementation inside existing React stack (no new editor framework)
- Decision: Build text/shape overlay interactions with React state, existing Zustand store, and native browser events/CSS transforms.
- Rationale: The scope is intentionally simple (move, resize text, recolor, simple shapes), so adding a full canvas/editor library would increase dependency weight and long-term maintenance for little gain.
- Alternatives considered:
  - `fabric.js`: mature but adds a heavier abstraction and shifts app architecture to canvas-first editing.
  - `konva/react-konva`: solid community usage, but still introduces non-trivial rendering/event layers unnecessary for this limited feature set.

## Decision 2: Use a dedicated frontend module to isolate complexity
- Decision: Introduce an organized overlay editor module (state + render + controls) under post-related components instead of mixing all logic into a single page component.
- Rationale: Feature touches many behaviors (selection, bounds constraints, z-order, overflow warnings, per-slide state), and modularization keeps the code understandable and maintainable without over-abstracting.
- Alternatives considered:
  - Single large component in `post` page: faster initially but high readability and regression risk.
  - Generic cross-app editor framework: over-engineered for a single workflow.

## Decision 3: Keep overlay data session-scoped only
- Decision: Store overlay edits in client memory for the active tab session and do not persist to backend/database.
- Rationale: This directly matches FR-023 and avoids unnecessary backend persistence complexity.
- Alternatives considered:
  - Persist in localStorage/sessionStorage: could survive refresh but exceeds explicit session discard expectation and adds migration/state recovery concerns.
  - Persist remotely: clearly out of scope and violates simplicity target.

## Decision 4: Enforce bounds/limits in the client state layer
- Decision: Enforce max 10 overlay elements per slide and image-bound constraints in the overlay state/update functions.
- Rationale: Centralized guardrails avoid scattered checks across UI controls and drag handlers.
- Alternatives considered:
  - Validate only on submit/download: late feedback harms UX and allows invalid intermediate states.
  - Validate only in UI widgets: brittle when multiple actions can mutate overlays.

## Decision 5: Export should flatten exactly the visible preview
- Decision: Produce flattened slide images from the same overlay model used by preview, then send resulting images through existing export flow.
- Rationale: Keeps WYSIWYG behavior (FR-026) and minimizes backend changes.
- Alternatives considered:
  - Let backend compose overlays: requires sending full overlay schema and duplicating layout/render logic server-side.
  - Export original images only: does not satisfy the feature requirement.

## Decision 6: Prefer existing and consolidated project dependencies
- Decision: Do not add new dependencies by default; if a utility is truly needed, choose mature/community-consolidated options and justify in implementation notes.
- Rationale: Aligns with constitution principles and explicit product guidance to minimize libraries.
- Alternatives considered:
  - Add niche drag/resize package quickly: speeds initial coding but increases maintenance and integration surface.

# Research: Instagram Carousel Flow

**Feature**: `002-instagram-carousel-flow` | **Date**: 2026-03-07

## Decisions and rationale

### Slide schema and fixed size

- **Decision**: Standardize carousel generation to exactly 5 slides, with explicit `role` values (`central_thesis`, `argument`, `sequence`, `cta`) and `text` + `image_prompt` per slide.
- **Rationale**: The spec fixes scope at 5 slides and requires semantic alignment between narrative and image per slide (FR-003, FR-004, FR-011, FR-012).
- **Alternatives considered**: Keep model output flexible (rejected because it causes mismatch with fixed download package and preview expectations).

### Prompt pipeline organization

- **Decision**: Keep a 4-step pipeline with clear contracts:
  1) narrative options, 2) narrative structure, 3) carousel structure, 4) image generation.
- **Rationale**: Explicit handoff between steps reduces ambiguity in prompt construction and makes failures easier to isolate.
- **Alternatives considered**: Single monolithic prompt for full generation (rejected because it reduces control and worsens partial retries).

### Retry strategy for partial failures

- **Decision**: Implement per-slide retry by resubmitting only failed slides to image generation while preserving successful slide text and image URLs.
- **Rationale**: Directly satisfies clarified behavior and FR-012 while reducing cost/time versus full regeneration.
- **Alternatives considered**: Regenerate the full carousel on any failure (rejected due to unnecessary recomputation and poorer UX).

### Download package generation

- **Decision**: Generate export ZIP in backend with deterministic structure: `post/slide_01.png` ... `post/slide_05.png` and `post/caption.txt`.
- **Rationale**: Server-side export avoids browser CORS/file-origin issues when converting remote image URLs to PNG and ensures consistent output format (FR-009).
- **Alternatives considered**: Client-side ZIP assembly in frontend (rejected due to cross-origin constraints and fragile behavior on unstable connections).

### Narrative edits and state invalidation

- **Decision**: Any change to selected narrative content invalidates previous carousel preview/download readiness until user triggers generation again.
- **Rationale**: Required by clarified edge-case rule and prevents stale assets from being downloaded after text changes.
- **Alternatives considered**: Keep previous assets after edits (rejected because assets can become semantically inconsistent with edited narrative).

### Validation and actionable errors

- **Decision**: Validate empty mandatory fields before generation and return field-specific + operation-specific errors (generation/retry/download).
- **Rationale**: Required by FR-010 and edge cases; actionable messages reduce user confusion and failed attempts.
- **Alternatives considered**: Generic "something went wrong" errors (rejected due to low debuggability and poor UX).

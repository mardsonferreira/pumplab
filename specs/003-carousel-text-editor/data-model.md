# Data Model: Carousel Overlay Editing

## Entity: CarouselSlideEditState
- Purpose: Holds editable visual state for one carousel slide during current session.
- Fields:
  - `slideIndex` (number, required, 1..5)
  - `baseImageUrl` (string | null, optional when image failed)
  - `overlays` (`TextOverlay[]`, required, max length 10)
  - `selectedOverlayId` (string | null)
  - `imageStatus` (`"pending" | "success" | "failed"`)
  - `imageErrorMessage` (string | null)
- Validation rules:
  - `overlays.length <= 10`
  - Each overlay must stay within image bounds after move operations.
  - `selectedOverlayId` must refer to an existing overlay or be `null`.

## Entity: TextOverlay
- Purpose: Editable text rendered over a slide image.
- Fields:
  - `id` (string, required, unique in slide scope)
  - `kind` (`"text"`, required)
  - `x`, `y`, `width`, `height` (numbers, required; width/height > 0)
  - `zIndex` (number, required; used for draw/export ordering among text boxes)
  - `text` (string, required)
  - `fontSize` (number, required, min bound enforced by editor)
  - `color` (string, required, CSS color)
  - `lineHeight` (number, required)
  - `overflow` (`"none" | "warning"`, required)
- Validation rules:
  - Automatic line wrap always applied in layout/fit logic.
  - Automatic font reduction attempts fit before setting `overflow = "warning"`.
  - If still not fitting, keep full text unchanged and set overflow warning (FR-019).

## Entity: OverlaySessionState
- Purpose: Container for per-slide edit states in current tab/session.
- Fields:
  - `slides` (Record<number, CarouselSlideEditState>, required for available slides)
  - `activeSlideIndex` (number, required)
- Validation rules:
  - Edits are independent by slide (FR-012).
  - Navigating between slides must keep state in memory (FR-011).
  - Refresh/tab close may discard unsaved state (FR-017).

## State Transitions
- `initialize_from_generation`:
  - Input: generated slide text/image metadata.
  - Output: creates initial `TextOverlay` per slide from generated text when present.
- `add_text_overlay`:
  - Guard: reject when slide already has 10 overlays.
- `update_text`:
  - Applies text/color/font size changes, recomputes overflow when text or font size changes.
- `move_overlay`:
  - Applies drag delta, then clamps to image bounds.
- `delete_overlay`:
  - Removes overlay by id and clears selection if needed.
- `prepare_export`:
  - Flattens base image + text overlays in z-index order for WYSIWYG export.

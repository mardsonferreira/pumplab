# Data Model: Carousel Overlay Editing

## Entity: CarouselSlideEditState
- Purpose: Holds editable visual state for one carousel slide during current session.
- Fields:
  - `slideIndex` (number, required, 1..5)
  - `baseImageUrl` (string | null, optional when image failed)
  - `overlays` (OverlayElement[], required, max length 10)
  - `selectedOverlayId` (string | null)
  - `imageStatus` (`"pending" | "success" | "failed"`)
  - `imageErrorMessage` (string | null)
- Validation rules:
  - `overlays.length <= 10`
  - Each overlay must stay within image bounds after move/resize operations.
  - `selectedOverlayId` must refer to an existing overlay or be `null`.

## Entity: OverlayElement (union)
- Purpose: Base polymorphic overlay rendered over a slide image.
- Common fields:
  - `id` (string, required, unique in slide scope)
  - `kind` (`"text" | "shape"`, required)
  - `x` (number, required, normalized or pixel coordinate based on implementation)
  - `y` (number, required)
  - `width` (number, required, > 0)
  - `height` (number, required, > 0)
  - `zIndex` (number, required)
- Validation rules:
  - Position + size must not exceed visible image rectangle after constraint logic.
  - `zIndex` updates only by single-step forward/backward commands.

## Entity: TextOverlay
- Extends: `OverlayElement` where `kind = "text"`
- Fields:
  - `text` (string, required, non-empty allowed after trim check on save/export warning flow)
  - `fontSize` (number, required, min bound enforced by editor)
  - `color` (string, required, CSS color)
  - `lineHeight` (number, optional default)
  - `overflow` (`"none" | "warning"`, required)
- Validation rules:
  - Automatic line wrap always applied.
  - Automatic font reduction attempts fit before setting `overflow = "warning"`.
  - If still not fitting, keep full text unchanged and set overflow warning (FR-025).

## Entity: ShapeOverlay
- Extends: `OverlayElement` where `kind = "shape"`
- Fields:
  - `shapeType` (`"rectangle" | "rounded_rectangle" | "circle"`)
  - `color` (string, required)
  - `filled` (boolean, required)
  - `opacity` (number, required, 0..1)
- Validation rules:
  - New shapes default behind text layers.
  - Shape style changes must instantly update preview.

## Entity: OverlaySessionState
- Purpose: Container for per-slide edit states in current tab/session.
- Fields:
  - `slides` (Record<number, CarouselSlideEditState>, required for available slides)
  - `activeSlideIndex` (number, required)
  - `lastUpdatedAt` (ISO string, optional)
- Validation rules:
  - Edits are independent by slide (FR-017).
  - Navigating between slides must keep state in memory (FR-016).
  - Refresh/tab close may discard unsaved state (FR-023).

## State Transitions
- `initialize_from_generation`:
  - Input: generated slide text/image metadata.
  - Output: creates initial `TextOverlay` per slide from generated text.
- `add_text_overlay` / `add_shape_overlay`:
  - Guard: reject when slide already has 10 elements.
- `update_overlay_content_or_style`:
  - Applies text/color/font/shape style changes, recomputes overflow when text changes.
- `move_or_resize_overlay`:
  - Applies drag/resize delta, then clamps to image bounds.
- `change_layer_order`:
  - Moves selected overlay one step forward/backward.
- `delete_overlay`:
  - Removes overlay by id and clears selection if needed.
- `prepare_export`:
  - Flattens base image + overlays preserving visible content and layer order.

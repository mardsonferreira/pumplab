# Data Model: Instagram Carousel Flow

**Branch**: `002-instagram-carousel-flow` | **Date**: 2026-03-07

## Entities

### NarrativeSuggestion

- **Description**: Short starter topic shown in dashboard to bootstrap content ideation.
- **Fields**:
  - `id` (string)
  - `title` (string)
  - `context` (string)
- **Validation**:
  - Must be selectable by authenticated user before generating narrative options.

### NarrativeOption

- **Description**: Generated option from Prompt 1 for user selection.
- **Fields**:
  - `id` (string)
  - `theme` (string)
  - `central_thesis` (string)
  - `main_argument` (string)
  - `narrative_sequence` (array of 5 steps)
- **Validation**:
  - `narrative_sequence` must contain exactly 5 ordered steps (`step` 1..5).

### NarrativeDraft

- **Description**: Editable narrative state after user chooses one option.
- **Fields**:
  - `central_thesis` (string, required)
  - `main_argument` (string, required)
  - `narrative_sequence` (array of 5 step descriptions, all required)
  - `caption` (string, required before export)
- **Validation**:
  - No empty required field on submit.
  - Editing any draft field invalidates previous generated carousel.

### CarouselSlide

- **Description**: One slide of the generated carousel.
- **Fields**:
  - `index` (int, 1..5)
  - `role` (enum: `central_thesis`, `argument`, `sequence`, `cta`)
  - `text` (string, required)
  - `image_prompt` (string, required)
  - `image_url` (string, optional until generation succeeds)
  - `status` (enum: `pending`, `success`, `failed`)
  - `error_message` (string, optional)
- **Validation**:
  - `index` unique and contiguous.
  - `text` and `image_prompt` required before calling image generation.

### PostPreview

- **Description**: User-facing preview state before download.
- **Fields**:
  - `slides` (array of 5 `CarouselSlide`)
  - `caption` (string)
  - `ready_to_download` (boolean)
  - `last_generation_at` (datetime/string)
- **Validation**:
  - `ready_to_download = true` only when all 5 slides are `success` and caption is present.

### DownloadPackage

- **Description**: Final ZIP payload downloaded by user.
- **Fields**:
  - `filename` (string, e.g. `instagram_post_<timestamp>.zip`)
  - `entries` (fixed):
    - `post/slide_01.png`
    - `post/slide_02.png`
    - `post/slide_03.png`
    - `post/slide_04.png`
    - `post/slide_05.png`
    - `post/caption.txt`
- **Validation**:
  - Must preserve slide order.
  - Download blocked when generation is incomplete/invalid.

## Relationships

- `NarrativeSuggestion` -> generates many `NarrativeOption`.
- One selected `NarrativeOption` becomes one editable `NarrativeDraft`.
- One `NarrativeDraft` generates one `PostPreview` containing exactly 5 `CarouselSlide`.
- One valid `PostPreview` can produce one `DownloadPackage` per download action.

## State transitions

- **Selection**: suggestion selected -> narrative options generated -> one option selected.
- **Editing**: option selected -> draft editable; any edit marks preview as stale.
- **Generation**: valid draft -> carousel structure -> image generation per slide.
- **Partial failure**: slide status `failed` -> retry only failed slides -> update status and URLs.
- **Download**: all slides success + caption present -> ZIP generation -> download started.

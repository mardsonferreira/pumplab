# API Contract: Instagram Carousel Flow

**Feature**: `002-instagram-carousel-flow` | **Version**: 0.1.0

Backend base URL is configured in frontend (`NEXT_PUBLIC_API_URL`). Routes below are relative to that base.

## Authentication

All endpoints in this contract require authenticated user context via backend cookie or `Authorization: Bearer <token>`.

## Endpoints

### POST `/openai/narratives`

- **Purpose**: Generate narrative options (Prompt 1).
- **Request** (`application/json`):
  - `prompt` (string, required)
- **Response 200**:
  - `narratives` (array of `NarrativeOption`)
- **Errors**:
  - `401` unauthorized
  - `500` provider/generation failure

### POST `/openai/carousel-master-prompt`

- **Purpose**: Generate structured carousel content (Prompt 3 output shape).
- **Request** (`application/json`):
  - `prompt` (string, required)
- **Response 200**:
  - `content` (string JSON-encoded object with `style` and `slides`)
- **Expected `slides` structure**:
  - array length exactly `5`
  - each item contains:
    - `role` (`central_thesis` | `argument` | `sequence` | `cta`)
    - `text` (string)
    - `image_prompt` (string)
- **Errors**:
  - `401`, `500`

### POST `/openai/carousel-images`

- **Purpose**: Generate images for given slides (initial generation or retry subset).
- **Request** (`application/json`):
  - `slides` (array, required)
    - each item must contain at least `image_prompt` (string)
    - optional metadata for mapping (`index`, `role`, `text`)
- **Response 200**:
  - `urls` (array of strings, same order as request `slides`)
- **Retry semantics**:
  - Client can send only failed slides.
  - Successful slides from prior attempts must remain unchanged on client state.
- **Errors**:
  - `401`, `500`

### POST `/openai/carousel-export`

- **Purpose**: Build and return the final downloadable ZIP package.
- **Request** (`application/json`):
  - `caption` (string, required)
  - `slides` (array length `5`, required)
    - each item:
      - `index` (1..5)
      - `image_url` (string, required)
      - `text` (string, required)
- **Response 200**:
  - `application/zip` file download
  - recommended filename: `instagram_post_<timestamp>.zip`
  - archive entries:
    - `post/slide_01.png` ... `post/slide_05.png`
    - `post/caption.txt`
- **Errors**:
  - `400` invalid payload or missing generated content
  - `401` unauthorized
  - `502` transient fetch/asset processing failure

## Validation rules

- Slide count is fixed at `5`.
- Download is only valid when all 5 slide image URLs are present.
- Empty narrative fields must be rejected before generation in frontend and/or backend validation.

## Compatibility notes

- Existing `/openai/*` routes remain in use.
- `carousel-export` is additive and does not break existing consumers.
- Contract changes require synchronized updates in:
  - `frontend/src/utils/api/openai/index.ts`
  - `backend/app/api/routes/openai.py`

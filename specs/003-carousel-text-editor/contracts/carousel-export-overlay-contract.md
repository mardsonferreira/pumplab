# Contract: Carousel Export With Overlays

## Scope
Defines the API contract for exporting final carousel slides that include user-edited overlays exactly as shown in the frontend preview.

## Endpoint
- Method: `POST`
- Path: `/openai/carousel-export`
- Auth: same current authenticated user requirement

## Request Body
```json
{
  "caption": "string",
  "slides": [
    {
      "index": 1,
      "image_url": "https://...",
      "flattened_image_base64": "optional_base64_png_without_data_prefix"
    }
  ]
}
```

## Field Rules
- `caption`: required string (may be empty).
- `slides`: required array with exactly 5 items.
- `slides[].index`: integer between 1 and 5.
- At least one of these must be provided per slide:
  - `image_url` (existing behavior)
  - `flattened_image_base64` (new behavior for overlay-flattened output)
- If both are provided, `flattened_image_base64` takes precedence.

## Response
- Success:
  - Status `200`
  - Body: binary ZIP (`application/zip`) with:
    - `post/slide_01.png` ... `post/slide_05.png`
    - `post/caption.txt`
- Error:
  - `400` invalid payload constraints
  - `502` remote image fetch failed (when `image_url` path is used)
  - `500` unexpected export failure

## Backward Compatibility
- Existing clients that send only `image_url` continue to work unchanged.
- New overlay editor clients may send `flattened_image_base64` to guarantee WYSIWYG export.

## Notes
- This contract intentionally avoids introducing a new export endpoint to minimize integration changes.
- PNG is preferred for deterministic visual output and compatibility with current ZIP structure.

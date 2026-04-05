# Quickstart: Carousel Overlay Editing

## 1) Start services
- Backend:
  - `cd /home/sergio/Documentos/pessoal/codes/pumplab/backend`
  - `uv sync`
  - `uv run uvicorn app.main:app --reload --port 8000`
- Frontend (new terminal):
  - `cd /home/sergio/Documentos/pessoal/codes/pumplab/frontend`
  - `pnpm install`
  - `pnpm dev`

## 2) Generate a carousel
- Open the app and complete narrative generation flow until the post/carousel preview screen.
- Confirm slides are shown with generated images (text-free backgrounds) and initial text overlays populated from the generated slide text.

## 3) Validate text overlay workflow
- Select a text overlay on the active slide; use the floating toolbar (font size, color) and inline editing on the slide.
- Add a new text box (control below the carousel) and verify per-slide independence.
- Drag text using the grab rail / move behavior and ensure it cannot leave image bounds.
- Change text color and font size and verify instant visual feedback.
- Enter long text to trigger auto-wrap/auto-size; if still not fitting, verify overflow handling per spec (state flag / any UI hint in place).

## 4) Validate session behavior and limits
- Navigate between slides using the carousel arrows and return; edits must remain in current tab session.
- Attempt adding more than 10 text overlays on one slide; verify the action is blocked with clear feedback.
- Refresh the page and confirm unsaved edits are discarded (overlay session is not persisted).

## 5) Validate export
- Click `Baixar Post`.
- Each slide is flattened (image + text overlays → PNG) before export.
- Downloaded ZIP must contain slide images with text flattened as previewed (position, color, size).

## 6) Regression checks
- Failed image slide still allows overlay editing and shows clear image error state with retry action where applicable.
- Existing carousel generation and retry flow continue working.
- Backend export endpoint accepts both old format (image_url only) and new format (flattened_image_base64 takes precedence).

## 7) Architecture notes
- Overlay state lives in the Zustand narrative store under `postPreview.overlaySession` and is excluded from localStorage persistence (session-scoped only).
- Text-free image generation: master prompt and image prompt builder both instruct the model to avoid rendering text/typography in images.
- Export contract: carousel export accepts optional `flattened_image_base64` per slide; when present it takes precedence over `image_url`.
- Overlay editing is client-side with no backend persistence for overlay geometry.

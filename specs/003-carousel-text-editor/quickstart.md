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

## 3) Validate text overlay workflow (P1)
- Edit text content on a slide via the text controls below the carousel and verify immediate preview update.
- Add a new text box ("Novo" button) and verify per-slide independence.
- Drag text on the slide and ensure it cannot leave image bounds.
- Change text color (color picker) and size (number input) and verify instant visual feedback.
- Enter long text to trigger auto-wrap/auto-size; if still not fitting, verify overflow warning appears and full text is preserved.

## 4) Validate shape workflow (P2)
- Add rectangle, rounded rectangle, and circle via the shape controls.
- Change color, fill toggle (checkbox), and opacity (slider).
- Move each shape by dragging and verify it remains selectable/editable.
- Confirm new shapes start behind text; test bring-forward/send-backward controls.

## 5) Validate session behavior and limits
- Navigate between slides using the carousel arrows and return; edits must remain in current tab session.
- Attempt adding more than 10 overlays in one slide; verify the action is blocked with clear feedback.
- Refresh the page and confirm unsaved edits are discarded (overlay session is not persisted).

## 6) Validate export (P3)
- Click `Baixar Post`.
- Each slide is flattened (image + overlays → PNG) before export.
- Downloaded ZIP must contain 5 slide images with overlays flattened exactly as previewed.
- Verify color, position, opacity, and layer order match what user saw.

## 7) Regression checks
- Failed image slide still allows overlay editing and shows clear image error state with retry action.
- Existing carousel generation and retry flow continue working.
- Backend export endpoint accepts both old format (image_url only) and new format (flattened_image_base64 takes precedence).

## 8) Architecture notes
- Overlay state lives in the Zustand narrative store under `postPreview.overlaySession` and is excluded from localStorage persistence (session-scoped only).
- Text-free image generation: master prompt and image prompt builder both instruct the model to avoid rendering text/typography in images.
- Export contract: `CarouselExportSlide` now accepts optional `flattened_image_base64` field; when present it takes precedence over `image_url`.
- All overlay editing is client-side with no backend persistence needed.

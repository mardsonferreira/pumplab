# Feature Specification: Carousel Overlay Editing

**Feature Branch**: `003-carousel-text-editor`
**Created**: 2026-04-04
**Status**: Draft
**Input**: User description: "Adicionar edição simples e intuitiva do texto sobre imagens do carrossel, permitindo redimensionar, reposicionar e mudar cor da fonte no frontend, removendo do prompt da LLM a instrução de gerar texto na imagem."

**Scope note (2026)**: Product scope is **text overlays only** (no shape layers or layer-order controls). Export still flattens whatever text overlays are on each slide.

## Clarifications

### Session 2026-04-04

- Q: Maximum number of overlay elements per slide? → A: Up to 10 **text** overlays per slide.
- Q: Overlay persistence scope? → A: Keep edits only in the current session/tab; page refresh discards unsaved overlays.
- Q: Element removal behavior? → A: Users can delete any text box at any time.
- Q: When text still does not fit after automatic size reduction? → A: Keep full text and show overflow warning requiring user adjustment (state flag; surface in UI as available).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edit text directly on slide image (Priority: P1)

As a content creator, I can edit one or more text boxes directly over each generated image so that I can quickly fix readability and positioning issues before publishing.

**Why this priority**: This is the core value of the feature and directly solves the current failure mode where generated text in images is unusable.

**Independent Test**: Generate a carousel with image-only outputs, open a slide, create additional text boxes, change text position/size/color/content, and confirm changes appear immediately in preview and persist while navigating slides.

**Acceptance Scenarios**:

1. **Given** a generated carousel slide is visible, **When** the user drags a text box, **Then** the text position updates, remains inside image bounds, and stays in the chosen place for that slide.
2. **Given** a generated carousel slide is visible, **When** the user changes text size and text color, **Then** the preview reflects the new style without regenerating the image.
3. **Given** a generated carousel slide is visible, **When** the user edits text content or creates another text box, **Then** each text box remains independently editable on that slide.
4. **Given** the user edited a slide text overlay, **When** the user navigates away and returns to that slide in the same session, **Then** all edited text boxes and styles remain intact.

---

### User Story 2 - Keep editing simple and intuitive + export exact preview (Priority: P2)

As a content creator, I can complete basic text overlay adjustments with minimal steps so that editing remains fast and accessible, and the downloaded post matches the preview.

**Why this priority**: Ease of use determines adoption; the export must match what users see.

**Independent Test**: Perform common tasks (create text box, move text, change font size, recolor text), then click `Baixar Post` and verify exported images match preview.

**Acceptance Scenarios**:

1. **Given** a user is on the slide editor, **When** they adjust text content, position, size, and color, **Then** they can complete those tasks without leaving the slide view.
2. **Given** the user applies styling that hurts readability, **When** they continue editing, **Then** the platform provides enough feedback where implemented (e.g. contrast hints, overflow state) to identify issues before publishing.
3. **Given** the user finalized overlay edits, **When** the user clicks `Baixar Post`, **Then** the downloaded output contains the final image with text overlays applied exactly as shown in preview.

---

### Edge Cases

- Text exceeds available area (very long sentence or many line breaks).
- User chooses a text color with low contrast against the image background.
- User moves text partially or fully outside the visible image area (system should clamp to bounds).
- User creates multiple text boxes and overlapping elements that can affect readability.
- Text does not fit in current text box dimensions even after automatic line wrapping and size reduction.
- Carousel generation returns fewer slides than expected.
- One or more slide images fail to load while text content is available.
- Download generation fails after user edits overlays.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST generate carousel images intended to be used without relying on model-rendered text as the final readable copy.
- **FR-002**: System MUST provide a text overlay layer per slide populated from the slide text returned by the content generation flow.
- **FR-003**: Users MUST be able to edit the overlay text content for each slide.
- **FR-004**: Users MUST be able to create additional text boxes on each slide (up to the per-slide limit).
- **FR-005**: Users MUST be able to reposition text boxes by dragging them.
- **FR-006**: System MUST constrain text box movement to stay within image bounds.
- **FR-007**: Users MUST be able to change font size in each text box.
- **FR-008**: Users MUST be able to change text color in each text box.
- **FR-009**: System MUST automatically apply line wrapping for long text within text boxes.
- **FR-010**: System MUST automatically reduce text size to try to fit text within image constraints.
- **FR-011**: System MUST preserve each slide's text overlay edits while the user navigates between slides during the same editing session.
- **FR-012**: System MUST keep overlay properties independent per slide so that edits on one slide do not overwrite others.
- **FR-013**: System MUST provide visual preview feedback after text edit actions (content, position, size, color) within 200ms for direct changes in normal usage.
- **FR-014**: System MUST handle image loading failures by showing a clear error state with retry action while preserving overlay editing for the current slide where applicable.
- **FR-015**: System MUST keep the overlay editor intentionally limited to simple post creation and MUST NOT include advanced design tooling beyond the capabilities listed in this specification.
- **FR-016**: System MUST limit each slide to a maximum of 10 text overlays.
- **FR-017**: System MUST keep overlay edits only for the active browser session/tab and MAY discard unsaved overlay edits after page refresh or tab close.
- **FR-018**: Users MUST be able to delete any text box at any time during editing.
- **FR-019**: If text still cannot fit after automatic line wrapping and size reduction, system MUST keep the full text unchanged and set a clear overflow warning state for user adjustment.
- **FR-020**: When user clicks `Baixar Post`, system MUST generate and download final slide images with all text overlays flattened into each image, preserving visible content and position from the editor preview.

### Non-Functional Requirements

- **NFR-001 (Interaction Responsiveness)**: Overlay interactions MUST remain responsive in normal usage, targeting at least 20 FPS during drag operations on a standard laptop browser profile used by the team.
- **NFR-002 (Preview Consistency)**: What users see in editor preview MUST match exported output for text overlay content, position, size, and color in at least 95% of tested exports.
- **NFR-003 (Scope Simplicity Guardrail)**: The editor UI MUST expose only the simple capabilities defined in this spec (text content, position, font size, color, add/delete text boxes), without advanced controls such as rotation, blur/effects, typography families, or non-text overlay layers.

### Key Entities *(include if feature involves data)*

- **Carousel Slide**: A single card in the generated sequence containing image reference, textual message, and slide role.
- **Text Box Overlay**: Editable text element associated with one slide, including content, position, size, color, line height, and overflow status.
- **Editing Session**: Temporary in-tab state that stores unsaved text overlay changes while the user reviews multiple slides.

### Assumptions

- This feature targets simple editing needs only (text content, position, size, color), not advanced typography or professional design controls.
- Users edit overlays before final publishing/export in the existing carousel workflow.
- Slide text from generation remains the default initial text, with user edits allowed afterward.

### Dependencies

- Carousel generation flow must continue returning slide text and image references for each slide.
- Existing preview experience must support per-slide visualization of image and text overlays together.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of carousel generation attempts produce slides that are publishable without requiring text inside generated images.
- **SC-002**: At least 90% of users complete core text tasks (edit content, add text box, move, change size, recolor) on a slide in under 90 seconds during usability testing.
- **SC-003**: Support requests related to unreadable or misspelled text in generated carousel images decrease by at least 70% within 30 days of release.
- **SC-004**: In at least 95% of download attempts, users confirm the exported images visually match the final on-screen preview for text overlay content and styling.

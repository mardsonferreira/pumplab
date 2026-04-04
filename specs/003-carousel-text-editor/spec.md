# Feature Specification: Carousel Overlay Editing

**Feature Branch**: `003-carousel-text-editor`
**Created**: 2026-04-04
**Status**: Draft
**Input**: User description: "Adicionar edição simples e intuitiva do texto sobre imagens do carrossel, permitindo redimensionar, reposicionar e mudar cor da fonte no frontend, removendo do prompt da LLM a instrução de gerar texto na imagem."

## Clarifications

### Session 2026-04-04

- Q: Layering behavior between text and shapes? → A: Shapes start behind text by default, with simple bring forward/backward controls.
- Q: Maximum number of overlay elements per slide? → A: Up to 10 total elements per slide (text + shapes).
- Q: Overlay persistence scope? → A: Keep edits only in the current session/tab; page refresh discards unsaved overlays.
- Q: Element removal behavior? → A: Users can delete any text box or shape at any time.
- Q: When text still does not fit after automatic size reduction? → A: Keep full text and show overflow warning requiring user adjustment.

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

### User Story 2 - Add simple visual highlight elements (Priority: P2)

As a content creator, I can add simple shape elements over slide images to improve text legibility and emphasis without using advanced design tooling.

**Why this priority**: These lightweight visual elements improve readability while preserving speed and simplicity for post creation.

**Independent Test**: On a generated slide, add rectangle, rounded rectangle, and circle elements; change color/fill/opacity; drag each element; verify each element remains editable and within slide context.

**Acceptance Scenarios**:

1. **Given** a slide editor is open, **When** the user adds a shape element, **Then** the system provides one of the supported types: rectangle, rounded rectangle, or circle.
2. **Given** a shape element exists, **When** the user edits its style, **Then** the user can set color, choose filled or not filled, and adjust opacity.
3. **Given** one or more shapes exist on a slide, **When** the user drags them, **Then** each shape repositions like a canvas element and remains selectable for further edits.

---

### User Story 3 - Keep editing simple and intuitive (Priority: P3)

As a content creator, I can complete basic text and shape overlay adjustments with minimal steps so that editing remains fast and accessible.

**Why this priority**: Ease of use determines adoption; complex controls would block users from realizing the feature value.

**Independent Test**: Run a usability check where users perform common tasks (create text box, move text, resize text, recolor text, add shape, set fill/opacity, move shape) without guidance and measure completion success/time.

**Acceptance Scenarios**:

1. **Given** a user is on the slide editor, **When** they perform common adjustments (text content, move, resize, recolor, add shape, style shape), **Then** they can complete all tasks without leaving the slide view.
2. **Given** the user applies styling that hurts readability, **When** they continue editing, **Then** the platform provides enough visual feedback to identify that readability issue before publishing.
3. **Given** the user finalized overlay edits, **When** the user clicks `Baixar Post`, **Then** the downloaded output contains the final image with text and shape overlays applied exactly as shown in preview.

---

### Edge Cases

- Text exceeds available area (very long sentence or many line breaks).
- User chooses a text color with low contrast against the image background.
- User moves text partially or fully outside the visible image area.
- User creates multiple text boxes and overlapping elements that can affect readability.
- Shape opacity or fill configuration reduces text legibility instead of improving it.
- Text does not fit in current text box dimensions even after automatic line wrapping and size reduction.
- Carousel generation returns fewer slides than expected.
- One or more slide images fail to load while text content is available.
- Download generation fails after user edits overlays.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST generate carousel images intended to be used without relying on model-rendered text as the final readable copy.
- **FR-002**: System MUST provide a text overlay layer per slide populated from the slide text returned by the content generation flow.
- **FR-003**: Users MUST be able to edit the overlay text content for each slide.
- **FR-004**: Users MUST be able to create additional text boxes on each slide.
- **FR-005**: Users MUST be able to reposition text boxes by dragging them.
- **FR-006**: System MUST constrain text box movement to stay within image bounds.
- **FR-007**: Users MUST be able to resize text in each text box.
- **FR-008**: Users MUST be able to change text color in each text box.
- **FR-009**: System MUST automatically apply line wrapping for long text within text boxes.
- **FR-010**: System MUST automatically reduce text size to try to fit text within image constraints.
- **FR-011**: System MUST support adding simple shape elements per slide with these types only: rectangle, rounded rectangle, and circle.
- **FR-012**: Users MUST be able to drag shape elements to reposition them.
- **FR-013**: Users MUST be able to set shape color.
- **FR-014**: Users MUST be able to set whether each shape has fill enabled or disabled.
- **FR-015**: Users MUST be able to set shape opacity.
- **FR-016**: System MUST preserve each slide's text and shape overlay edits while the user navigates between slides during the same editing session.
- **FR-017**: System MUST keep overlay properties independent per slide so that edits on one slide do not overwrite others.
- **FR-018**: System MUST provide visual preview feedback after every overlay edit action (text content, position, size, color, shape style) within 200ms for direct style/content changes in normal usage.
- **FR-019**: System MUST handle image loading failures by showing a clear error state with retry action while preserving overlay editing actions for the current slide.
- **FR-020**: System MUST keep the overlay editor intentionally limited to simple post creation and MUST NOT include advanced design tooling beyond the capabilities listed in this specification.
- **FR-021**: System MUST place new shapes behind text by default and provide simple controls to move selected elements one layer forward or backward.
- **FR-022**: System MUST limit each slide to a maximum of 10 overlay elements combined (text boxes plus shapes).
- **FR-023**: System MUST keep overlay edits only for the active browser session/tab and MAY discard unsaved overlay edits after page refresh or tab close.
- **FR-024**: Users MUST be able to delete any text box or shape element at any time during editing.
- **FR-025**: If text still cannot fit after automatic line wrapping and size reduction, system MUST keep the full text unchanged and display a clear overflow warning for manual adjustment.
- **FR-026**: When user clicks `Baixar Post`, system MUST generate and download final slide images with all overlay elements flattened into each image, preserving visible content, position, color, opacity, and layer order from the editor preview.

### Non-Functional Requirements

- **NFR-001 (Interaction Responsiveness)**: Overlay interactions MUST remain responsive in normal usage, targeting at least 20 FPS during drag operations on a standard laptop browser profile used by the team.
- **NFR-002 (Preview Consistency)**: What users see in editor preview MUST match exported output for overlay attributes (content, position, color, opacity, layer order) in at least 95% of tested exports.
- **NFR-003 (Scope Simplicity Guardrail)**: The editor UI MUST expose only the simple capabilities defined in this spec (text content/position/size/color; shape type/color/fill/opacity/layer order; delete), without advanced controls such as rotation, blur/effects, or typography families.

### Key Entities *(include if feature involves data)*

- **Carousel Slide**: A single card in the generated sequence containing image reference, textual message, and slide role.
- **Text Box Overlay**: Editable text element associated with one slide, including content, position, size, and color.
- **Shape Overlay**: Simple visual element associated with one slide with type (rectangle, rounded rectangle, circle), position, color, fill mode, and opacity.
- **Editing Session**: Temporary in-tab state that stores unsaved text and shape overlay changes while the user reviews multiple slides.

### Assumptions

- This feature targets simple editing needs only (text content, text position, text size, text color, and simple shapes), not advanced typography or professional design controls.
- Users edit overlays before final publishing/export in the existing carousel workflow.
- Slide text from generation remains the default initial text, with user edits allowed afterward.

### Dependencies

- Carousel generation flow must continue returning slide text and image references for each slide.
- Existing preview experience must support per-slide visualization of image, text boxes, and shape overlays together.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of carousel generation attempts produce slides that are publishable without requiring text inside generated images.
- **SC-002**: At least 90% of users complete text tasks (edit content, add text box, move, resize, recolor) on a slide in under 90 seconds during usability testing.
- **SC-003**: At least 85% of users successfully add and style at least one shape element (type, color, fill mode, opacity, position) on the first attempt.
- **SC-004**: Support requests related to unreadable or misspelled text in generated carousel images decrease by at least 70% within 30 days of release.
- **SC-005**: In at least 95% of download attempts, users confirm the exported images visually match the final on-screen preview for overlay content and styling.

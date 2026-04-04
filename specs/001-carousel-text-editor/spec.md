# Feature Specification: Carousel Text Overlay Editing

**Feature Branch**: `001-carousel-text-editor`
**Created**: 2026-04-04
**Status**: Draft
**Input**: User description: "Adicionar edição simples e intuitiva do texto sobre imagens do carrossel, permitindo redimensionar, reposicionar e mudar cor da fonte no frontend, removendo do prompt da LLM a instrução de gerar texto na imagem."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edit text directly on slide image (Priority: P1)

As a content creator, I can edit each slide text directly over the generated image so that I can quickly fix readability and positioning issues before publishing.

**Why this priority**: This is the core value of the feature and directly solves the current failure mode where generated text in images is unusable.

**Independent Test**: Generate a carousel with image-only outputs, open a slide, change text position/size/color, and confirm changes appear immediately in preview and persist while navigating slides.

**Acceptance Scenarios**:

1. **Given** a generated carousel slide is visible, **When** the user drags the text block, **Then** the text position updates and remains in the chosen place for that slide.
2. **Given** a generated carousel slide is visible, **When** the user changes text size and text color, **Then** the preview reflects the new style without regenerating the image.
3. **Given** the user edited a slide text overlay, **When** the user navigates away and returns to that slide in the same session, **Then** the edited content and style remain intact.

---

### User Story 2 - Start from clean images and editable text (Priority: P2)

As a content creator, I receive generated images without baked-in text and get the slide text as an editable overlay so that typo-prone text rendering from the image model is no longer required.

**Why this priority**: It prevents recurring text quality errors at the source and ensures users can always correct copy visually.

**Independent Test**: Trigger carousel generation and verify resulting images do not contain model-rendered text while each slide still includes editable text content from the generated slide text.

**Acceptance Scenarios**:

1. **Given** the user requests carousel generation, **When** the backend returns slide data, **Then** each slide provides an image and a separate editable text overlay content.
2. **Given** a newly generated carousel, **When** the user inspects any slide image, **Then** the platform does not rely on model-generated text embedded in the image as the final copy layer.

---

### User Story 3 - Keep editing simple and intuitive (Priority: P3)

As a content creator, I can complete basic text overlay adjustments with minimal steps so that editing remains fast and accessible.

**Why this priority**: Ease of use determines adoption; complex controls would block users from realizing the feature value.

**Independent Test**: Run a usability check where users perform common tasks (move text, resize, recolor) without guidance and measure completion success/time.

**Acceptance Scenarios**:

1. **Given** a user is on the slide editor, **When** they perform common adjustments (move, resize, recolor), **Then** they can complete all tasks without leaving the slide view.
2. **Given** the user applies styling that hurts readability, **When** they continue editing, **Then** the platform provides enough visual feedback to identify that readability issue before publishing.

---

### Edge Cases

- Text exceeds available area (very long sentence or many line breaks).
- User chooses a text color with low contrast against the image background.
- User moves text partially or fully outside the visible image area.
- Carousel generation returns fewer slides than expected.
- One or more slide images fail to load while text content is available.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST generate carousel images intended to be used without relying on model-rendered text as the final readable copy.
- **FR-002**: System MUST provide a text overlay layer per slide populated from the slide text returned by the content generation flow.
- **FR-003**: Users MUST be able to edit the overlay text content for each slide.
- **FR-004**: Users MUST be able to reposition the text overlay on each slide.
- **FR-005**: Users MUST be able to resize text in the overlay on each slide.
- **FR-006**: Users MUST be able to change text color in the overlay on each slide.
- **FR-007**: System MUST preserve each slide's text overlay edits while the user navigates between slides during the same editing session.
- **FR-008**: System MUST keep text overlay properties independent per slide so that edits on one slide do not overwrite others.
- **FR-009**: System MUST provide immediate visual preview feedback after every text edit action (content, position, size, and color).
- **FR-010**: System MUST handle image loading failures gracefully by preserving text editing capability and clearly indicating the image issue.

### Key Entities *(include if feature involves data)*

- **Carousel Slide**: A single card in the generated sequence containing image reference, textual message, and slide role.
- **Text Overlay**: Editable layer associated with one slide, including content, position, size, and color.
- **Editing Session**: Temporary user interaction state that stores unsaved overlay changes while the user reviews multiple slides.

### Assumptions

- This feature targets simple editing needs only (content, position, size, color), not advanced typography controls.
- Users edit overlays before final publishing/export in the existing carousel workflow.
- Slide text from generation remains the default initial text, with user edits allowed afterward.

### Dependencies

- Carousel generation flow must continue returning slide text and image references for each slide.
- Existing preview experience must support per-slide visualization of image and overlay together.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of carousel generation attempts produce slides that are publishable without requiring text inside generated images.
- **SC-002**: At least 90% of users complete text move, resize, and color-change tasks on a slide in under 60 seconds during usability testing.
- **SC-003**: At least 90% of users successfully adjust text on all slides of a 5-slide carousel on the first attempt.
- **SC-004**: Support requests related to unreadable or misspelled text in generated carousel images decrease by at least 70% within 30 days of release.

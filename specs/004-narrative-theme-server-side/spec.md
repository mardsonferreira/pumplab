# Feature Specification: Server-Side Narrative Prompt (Theme-Only API)

**Feature Branch**: `004-narrative-theme-server-side`  
**Created**: 2026-04-05  
**Status**: Draft  
**Input**: User description: "At `useGenerateNarrative` we pass the full prompt to the API and the API executes it. For security, pass only the text the user typed (theme) and compose the prompt on the API with that theme."

## Problem Statement

Today the frontend builds the full LLM user message using `narrativePrompt` (from `frontend/src/app/hooks/prompt.ts`) by substituting `{{THEME}}`, then sends that entire string as `POST /openai/narratives` body `{ "prompt": "..." }`. The backend forwards `prompt` verbatim to the model.

That design allows any authenticated client (or compromised bundle) to send **arbitrary prompt text**, bypassing product instructions, increasing abuse risk (cost, policy violations, jailbreak-style misuse), and coupling prompt intellectual property to the client bundle.

## Goal

- The **only** user-controlled input for narrative generation MUST be the **theme** (free text the user typed in the dashboard).
- The **instruction template** (role, JSON shape, constraints, examples) MUST live **only on the server** and MUST NOT be required from the client to complete generation.
- Behavior from the end-user perspective (type a theme → receive five narrative options with the same structure as today) MUST remain equivalent unless this spec explicitly changes product rules.

## Clarifications

### Session 2026-04-05 (planning)

- **Q**: How to migrate `POST /openai/narratives` from `{ "prompt" }` to theme-only? → **A**: **Breaking change**: request body is `{ "theme": string }` only; `prompt` is removed. Single app — deploy backend and frontend together. See [plan.md](./plan.md).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Same narrative generation UX (Priority: P1)

As a creator, I enter a theme for my post and receive multiple narrative suggestions so I can pick one and continue the carousel flow.

**Why this priority**: Core product path must not regress.

**Independent Test**: Enter a short theme on the dashboard, submit, and verify five narratives load with valid structure (`central_thesis`, `main_argument`, `narrative_sequence`, etc.) matching existing frontend types.

**Acceptance Scenarios**:

1. **Given** I am authenticated and within plan limits, **When** I submit a non-empty theme, **Then** the app requests narrative generation using only my theme as the variable input and displays a list of narratives.
2. **Given** I submit the same theme twice, **When** responses differ due to model sampling, **Then** the UI still accepts the same JSON shape and does not error solely because of wording differences.

---

### User Story 2 - Server owns the narrative prompt template (Priority: P1)

As a security- and compliance-minded operator, I need the API to ignore client-supplied “full prompts” for this operation so prompts cannot be replaced or extended by untrusted clients.

**Why this priority**: Addresses the stated security requirement.

**Acceptance Scenarios**:

1. **Given** a client sends a request to generate narratives, **When** the request body contains only a theme field (or equivalent), **Then** the backend constructs the full user message to the LLM using the canonical template stored server-side plus the theme.
2. **Given** an old client or manual caller sends `{ "prompt": "..." }` to the narratives endpoint, **When** the server implements this spec, **Then** that input MUST NOT be executed as the full LLM user message for narrative generation (reject, ignore in favor of theme-only contract, or versioned endpoint — see FR-003).

---

### Edge Cases

- Empty or whitespace-only theme: block with validation error; do not call the model.
- Very long theme: enforce a maximum length server-side (and mirror on the client for UX) to bound tokens and cost.
- Special characters / Unicode: allowed as user content; template substitution must be safe (no template injection if using string formatting — prefer explicit placeholder replacement or structured message parts).
- Monthly quota / billing: unchanged except that abuse surface for arbitrary prompts is reduced.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Frontend MUST send only the user-entered **theme** (string) to the backend for narrative generation; it MUST NOT send the full narrative instruction prompt for this operation.
- **FR-002**: Backend MUST store the canonical narrative generation instructions (equivalent to today’s `narrativePrompt` semantics, including `{{THEME}}` substitution) and MUST build the final LLM user message by combining that template with the theme.
- **FR-003**: API contract for `POST /openai/narratives` MUST be updated so the request body accepts theme-only input (e.g. `{ "theme": "..." }`). The server MUST NOT treat a client-provided field as the entire unchecked LLM prompt for this feature. *(If backward compatibility is required, define a short deprecation: e.g. reject `prompt` with 400 and document migration, or support one release with dual parsing — decision belongs in planning.)*
- **FR-004**: Backend MUST validate theme: trim whitespace, reject empty, enforce max length; return **4xx** with a clear message when invalid.
- **FR-005**: Parsed narrative list returned to the client MUST remain compatible with existing `Narrative` typing and `parse_narrative_content` behavior (same JSON array shape and field expectations as today).
- **FR-006**: Frontend hook `useGenerateNarrative` MUST call the updated API with the raw user theme string (after any existing UI-level trim) and MUST NOT depend on `narrativePrompt` for the network request path.

### Non-Functional Requirements

- **NFR-001 (Security)**: After implementation, an authenticated user MUST NOT be able to override the narrative system instructions solely by altering the request body from the browser (for this endpoint).
- **NFR-002 (Consistency)**: Model choice, temperature, and parsing pipeline for narratives SHOULD remain aligned with current behavior unless a deliberate change is documented in `plan.md`.

### Explicitly Out of Scope (this spec)

- **Carousel master prompt** (`POST /openai/carousel-master-prompt`): still sends a constructed prompt from the client today; hardening that path is a **separate** follow-up if desired.
- Changing narrative JSON schema or copywriting of the template beyond moving it server-side (content parity is the default).

### Key Entities

- **Theme**: User-provided short text describing the topic for narrative suggestions.
- **Narrative instruction template**: Server-side fixed instructions plus placeholder for theme, used to build the LLM user message.

## Success Criteria *(mandatory)*

- **SC-001**: E2E or integration test proves narratives are generated when submitting a valid theme without sending `narrativePrompt` from the client.
- **SC-002**: Automated tests cover invalid theme (empty / too long) and updated API contract.
- **SC-003**: `narrativePrompt` is not bundled or not used for the generate-narratives API path on the client (so the instruction text is not the trust boundary for that request).

## Assumptions

- Moving the template to the backend preserves parity with the current `narrativePrompt` text unless product requests edits in the same delivery.
- Authentication and monthly narrative limits remain enforced as today.

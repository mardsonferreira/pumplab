# Research: Server-Side Narrative Prompt (Theme-Only API)

**Feature**: `004-narrative-theme-server-side` | **Date**: 2026-04-05

## Decisions and rationale

### Where the template lives

- **Decision**: Store the full narrative instruction string in **`backend/app/services/narrative_template.py`** (or equivalent single module), exported as a constant plus `build_narrative_prompt(theme: str)`.
- **Rationale**: Keeps OpenAI service focused on I/O; template is versioned with backend; easy to unit-test substitution without mocking HTTP.
- **Alternatives considered**: Environment variable for full template (rejected: too large and awkward for multiline JSON rules); database-stored template (rejected: no requirement for runtime edits).

### Template substitution safety

- **Decision**: Use **`.replace("{{THEME}}", theme)`** once on a constant string. Do not use `str.format` or f-strings on raw user input (avoids accidental `{` / `%` interpretation).
- **Rationale**: Theme may contain quotes, Unicode, or braces; single placeholder replace is predictable.
- **Alternatives considered**: JSON-escape theme before injection (rejected: theme is natural language inside the prompt, not a JSON value; escaping could corrupt user intent).

### Theme length limit

- **Decision**: **2000 characters** maximum after strip (constant `NARRATIVE_THEME_MAX_LENGTH`).
- **Rationale**: Dashboard textarea is a short “tema”; bounds token usage and aligns with abuse prevention without blocking normal Portuguese paragraphs.
- **Alternatives considered**: 500 chars (rejected as possibly tight for power users); 10k (rejected as weak bound).

### Breaking API vs dual support

- **Decision**: **Breaking** — only `theme` field; remove `prompt` from contract.
- **Rationale**: Dual support would keep a privileged code path accepting full prompts; security goal is to remove that entirely for this endpoint.
- **Alternatives considered**: Deprecation window with logging (possible for a public API; unnecessary here).

### Frontend removal of `narrativePrompt`

- **Decision**: Delete the template from the client bundle for this flow.
- **Rationale**: Satisfies SC-003 and NFR-001; reduces leakage of prompt IP and avoids accidental reuse.
- **Alternatives considered**: Keep string for “offline docs” (rejected: duplication risk).

### Carousel master route

- **Decision**: **Out of scope** — `POST /openai/carousel-master-prompt` unchanged in this feature.
- **Rationale**: Spec explicitly scopes to narrative generation; carousel hardening is a separate spec if needed.

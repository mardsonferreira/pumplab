# Data Model: Server-Side Narrative Prompt (Theme-Only API)

**Branch**: `004-narrative-theme-server-side` | **Date**: 2026-04-05

## Entities

### Theme (request input)

- **Description**: User-typed topic for narrative generation (dashboard textarea / suggestion chip).
- **Fields**:
  - `theme` (string, required in JSON body)
- **Validation** (server authoritative):
  - Trim leading/trailing whitespace.
  - Length after trim: **1 … 2000** characters (see `NARRATIVE_THEME_MAX_LENGTH` in implementation).
  - Empty after trim → reject with **422**.
  - Unicode allowed.

### NarrativeInstructionTemplate (server-only)

- **Description**: Fixed multiline instructions for the LLM, including JSON shape rules and Portuguese-only constraints.
- **Storage**: Python module constant(s); not exposed via API.
- **Substitution**: Single placeholder `{{THEME}}` replaced by validated theme string.

### Narrative (response — unchanged)

- **Description**: One of five generated options returned as JSON array elements from the model; parsed by `parse_narrative_content`.
- **Fields**: Align with existing frontend `Narrative` / `NarrativeDraft` types (`id`, `theme`, `central_thesis`, `main_argument`, `narrative_sequence` with five steps).
- **Validation**: Same as today; no schema change intended.

## API payload summary

| Direction | Shape |
|-----------|--------|
| Client → `POST /openai/narratives` | `{ "theme": "<string>" }` |
| Server → OpenAI | Full user message string (template + theme) |
| Server → Client | `{ "narratives": [ ... ] }` (unchanged) |

## Removed / obsolete

- **Request field `prompt`**: Removed from contract; sending it must not drive narrative generation (FastAPI will typically return **422** Unprocessable Entity for extra fields if configured, or **422** for wrong shape).

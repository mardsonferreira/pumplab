# Contract: `POST /openai/narratives` (theme-only)

**Feature**: `004-narrative-theme-server-side` | **Date**: 2026-04-05  
**Base URL**: Same as existing API (e.g. `NEXT_PUBLIC_API_URL`).

## Authentication

- **Required**: Same as today (Bearer session / cookie per `get_current_user_id`).

## Request

- **Method**: `POST`
- **Path**: `/openai/narratives`
- **Content-Type**: `application/json`

### Body (JSON)

```json
{
  "theme": "string"
}
```

| Field | Type | Constraints |
|-------|------|----------------|
| `theme` | string | Required. After server-side trim: length 1–2000 inclusive. |

**Removed**: `prompt` — no longer part of this contract.

## Success response

- **Status**: `200`
- **Body**:

```json
{
  "narratives": [ /* array of narrative objects */ ]
}
```

Shape unchanged: array compatible with `parse_narrative_content` and frontend `Narrative[]`.

## Error responses

| Status | Condition |
|--------|-----------|
| `401` | Unauthenticated |
| `422` | Invalid body (missing `theme`, empty theme, too long, or validation failure) |
| `500` | OpenAI or parsing failure (same behavior as today for downstream errors) |

## Notes

- Server builds the full LLM user message; clients must not send instruction text for this operation.

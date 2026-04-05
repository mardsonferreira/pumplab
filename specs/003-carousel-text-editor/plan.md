# Implementation Plan: Carousel Overlay Editing

**Branch**: `003-carousel-text-editor` | **Date**: 2026-04-04 | **Spec**: `/specs/003-carousel-text-editor/spec.md`
**Input**: Feature specification from `/specs/003-carousel-text-editor/spec.md`

## Summary

Replace image-baked text with a simple in-editor **text-only** overlay system: users add/edit text directly over each carousel slide, keep changes per slide during the active tab session, and export exactly what is previewed (flattened PNG per slide).
Implementation keeps the current stack and prioritizes a focused frontend module (overlay state + canvas rendering + floating toolbar and post-level actions) with minimal backend contract extension only where export must receive overlay-ready image data.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend), Python 3.12+ (backend runtime already established)
**Primary Dependencies**: Next.js 14 App Router, React 18, Zustand, react-slick, FastAPI, Pydantic
**Storage**: N/A (overlay edits are in-memory/session-tab only; no persistence required)
**Testing**: Frontend lint (`next lint`) + focused frontend automated tests for overlay state/interaction logic + backend pytest pattern for API contracts where applicable
**Target Platform**: Web browsers (desktop/mobile responsive) + Linux-hosted FastAPI backend
**Project Type**: Web application (monorepo with frontend + backend)
**Performance Goals**: Overlay style/content updates visible in preview within 200ms and drag interactions targeting >=20 FPS in normal usage
**Constraints**: Keep editor simple (no advanced design tooling), max 10 overlay elements/slide, keep overlays within slide bounds, avoid adding new libraries unless strictly needed and community-proven
**Scale/Scope**: 5-slide carousel flow, per-slide independent overlays, single-session editing before export

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Código simples, legível e de fácil manutenção
- [x] Organização e padrões existentes respeitados
- [x] Abstrações novas justificadas por ganho claro
- [x] Testes alinhados ao padrão do projeto quando aplicável
- [x] Experiência do usuário consistente com o app
- [x] Complexidade reduzida ou justificada no plano

## Project Structure

### Documentation (this feature)

```text
specs/003-carousel-text-editor/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md             # Created later by /speckit.tasks
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── api/routes/openai.py
│   ├── schemas/carousel.py
│   └── services/openai_service.py
└── tests/

frontend/
├── src/app/post/page.tsx
├── src/components/post/
├── src/components/common/carousel/
├── src/app/hooks/openai.ts
├── src/utils/stores/dashboard/narrative/
├── src/utils/api/openai/export-carousel-post.ts
└── src/types.ts
```

**Structure Decision**: Use the existing web monorepo structure. Concentrate overlay editor UI/state/rendering in a dedicated frontend feature module under `frontend/src/components/post` (and adjacent types/store helpers), keeping API/schema updates minimal and only for export needs.

## Complexity Tracking

No constitution violations expected.
If a new abstraction is introduced (e.g., overlay state manager module), it must replace duplicated logic and reduce overall component complexity, not add generic layers.

## Post-Design Constitution Check

- [x] Código simples, legível e de fácil manutenção
- [x] Organização e padrões existentes respeitados
- [x] Abstrações novas justificadas por ganho claro
- [x] Testes alinhados ao padrão do projeto quando aplicável
- [x] Experiência do usuário consistente com o app
- [x] Complexidade reduzida ou justificada no plano

All gates remain satisfied after Phase 0 (research) and Phase 1 (design/contracts).

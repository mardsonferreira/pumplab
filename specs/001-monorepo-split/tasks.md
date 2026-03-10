---
description: "Task list for Monorepo Frontend/Backend Split implementation"
---

# Tasks: Monorepo Frontend/Backend Split

**Input**: Design documents from `/specs/001-monorepo-split/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluídos conforme FR-011 (checklist manual + testes automatizados para autenticação, cobrança e geração de conteúdo).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo**: `frontend/` (Next.js), `backend/` (FastAPI); raiz com pnpm workspace para frontend
- Backend: `backend/app/`, `backend/tests/`
- Frontend: `frontend/src/`, `frontend/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Estrutura do monorepo e criação dos diretórios frontend e backend.

- [X] T001 Create backend directory structure per plan (backend/app/main.py, backend/app/api/routes/, backend/app/core/, backend/app/services/, backend/app/models/, backend/tests/)
- [X] T002 Initialize backend Python project with uv and pyproject.toml in backend/ (Python 3.12+, FastAPI, uvicorn, pytest, ruff)
- [X] T003 Create frontend/ by moving existing Next.js app from repo root (src/, public/ if exists, package.json, next.config.js, tailwind.config.ts, postcss.config.js, tsconfig.json, next-env.d.ts, .eslintrc.json, .prettierrc)
- [X] T004 Configure pnpm workspace at repo root (pnpm-workspace.yaml with packages: ['frontend']) and adjust root package.json for monorepo scripts if needed
- [X] T005 [P] Add backend README.md in backend/README.md with commands (uv sync, uv run uvicorn, uv run pytest)
- [X] T006 [P] Update frontend README.md in frontend/README.md with commands (pnpm install, pnpm dev) and reference to backend

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core do backend (config, CORS, deps) que toda rota e o frontend vão depender.

**⚠️ CRITICAL**: Nenhuma user story de implementação de rotas pode começar sem esta fase.

- [X] T007 Implement backend config in backend/app/core/config.py (ALLOWED_ORIGINS, FRONTEND_URL, Supabase, Stripe, OpenAI env vars per quickstart.md)
- [X] T008 Implement CORS middleware in backend/app/core/cors.py using FastAPI CORSMiddleware with origins from config (FR-010)
- [X] T009 Wire backend app in backend/app/main.py (FastAPI app, include config and CORS, mount routes placeholder)
- [X] T010 Create backend/app/api/deps.py with shared dependencies (e.g. get_supabase_client, auth dependency) for use by routes
- [X] T011 Add backend .env.example in backend/.env.example documenting ALLOWED_ORIGINS, FRONTEND_URL, SUPABASE_*, STRIPE_*, OPENAI_API_KEY per quickstart.md

**Checkpoint**: Foundation ready — rotas e frontend client podem ser implementados

---

## Phase 3: User Story 1 — Estrutura clara de apps (Priority: P1) 🎯 MVP

**Goal**: Separação clara entre frontend e backend; executar cada app de forma independente seguindo a documentação.

**Independent Test**: Ao abrir o repositório, identificar diretórios frontend/ e backend/ e rodar cada um com os comandos documentados (backend: uv run uvicorn; frontend: pnpm dev).

### Implementation for User Story 1

- [X] T012 [US1] Add minimal health or docs endpoint in backend (e.g. GET /health in backend/app/api/routes/health.py or rely on /docs) and register in backend/app/main.py
- [X] T013 [US1] Ensure frontend runs from frontend/ (pnpm install && pnpm dev from frontend/) and fix any path or config broken by the move in frontend/
- [X] T014 [US1] Add or update root README.md at repository root describing monorepo structure (frontend/, backend/), responsibilities, and links to frontend/README.md and backend/README.md (FR-007)

**Checkpoint**: User Story 1 complete — estrutura clara e ambos os apps executáveis de forma independente

---

## Phase 4: User Story 2 — Frontend como cliente da API (Priority: P2)

**Goal**: Frontend consome a API via base configurável; sem lógica exclusiva de servidor no frontend.

**Independent Test**: Frontend usa NEXT_PUBLIC_API_URL para todas as chamadas de dados; não há integrações diretas Supabase/Stripe/OpenAI que deveriam estar no backend.

### Backend routes (contracts)

- [X] T015 [P] [US2] Implement auth callback route in backend/app/api/routes/auth.py (GET redirect: recebe callback Supabase, trata cookies/sessão, redirect para FRONTEND_URL) e registrar em backend/app/main.py
- [X] T016 [P] [US2] Implement POST /stripe/create-checkout-session in backend/app/api/routes/stripe.py (planId, sessão autenticada, retorna url) e registrar rota
- [X] T017 [US2] Implement POST /stripe/webhook in backend/app/api/routes/stripe.py (body bruto, stripe-signature, STRIPE_WEBHOOK_SECRET, evento checkout.session.completed → atualizar subscription no Supabase) conforme research.md
- [X] T018 [P] [US2] Implement POST /openai/narratives in backend/app/api/routes/openai.py (prompt → OpenAI chat completion → content) e registrar
- [X] T019 [P] [US2] Implement POST /openai/carousel-master-prompt and POST /openai/carousel-images in backend/app/api/routes/openai.py conforme contracts/api-backend.md e registrar
- [X] T020 [US2] Add backend services if needed (e.g. backend/app/services/stripe_service.py, backend/app/services/openai_service.py) and use from routes; keep Supabase/Stripe/OpenAI usage only in backend

### Frontend as API client

- [X] T021 [US2] Add API client base URL from env in frontend: ensure NEXT_PUBLIC_API_URL is used in frontend (e.g. frontend/src/lib/api/client.ts or equivalent) and document in frontend README
- [X] T022 [US2] Replace direct Supabase/Stripe/OpenAI usage in frontend with calls to backend API (frontend/src/app/api/* routes → remove or proxy to backend; frontend pages/hooks use fetch to NEXT_PUBLIC_API_URL for checkout, narratives, carousel)
- [X] T023 [US2] Remove or redirect auth callback from frontend (frontend/src/app/auth/callback/) so login flow uses backend callback; update Supabase redirect URL config to point to backend
- [X] T024 [US2] Implement friendly error message and manual retry when backend is unavailable in frontend (FR-009) (e.g. frontend/src/components/ or frontend/src/lib/api error handling)
- [X] T025 [US2] Remove server-only integrations from frontend codebase: ensure no direct Supabase admin/service role, Stripe secret, or OpenAI API key in frontend; only NEXT_PUBLIC_* and API calls

**Checkpoint**: User Story 2 complete — frontend 100% cliente da API; fluxos principais (auth, cobrança, conteúdo) via backend

---

## Phase 5: User Story 3 — Configuração e documentação separadas (Priority: P3)

**Goal**: Configurações e documentação por app; setup sem etapas ocultas.

**Independent Test**: Documentação descreve variáveis e comandos por app; seguir passos permite iniciar frontend e backend sem ajustes manuais adicionais.

- [X] T026 [US3] Document frontend env vars in frontend/README.md or frontend/.env.example (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SUPABASE_*, etc.) per quickstart.md
- [X] T027 [US3] Document backend env vars in backend/README.md and backend/.env.example (ALLOWED_ORIGINS, FRONTEND_URL, SUPABASE_*, STRIPE_*, OPENAI_*) and webhook/callback URLs per quickstart.md
- [X] T028 [US3] Add or update root docs with “Rodar em paralelo” (dois terminais: backend porta 8000, frontend porta 3000; coerência NEXT_PUBLIC_API_URL e ALLOWED_ORIGINS) in README or specs/001-monorepo-split/quickstart.md linked from root
- [X] T029 [US3] Ensure scripts allow running frontend and backend separately and in parallel (FR-006): verify backend (uv run uvicorn) and frontend (pnpm dev) commands work from respective dirs; add convenience scripts at root if desired (e.g. pnpm run dev:backend, pnpm run dev:frontend)

**Checkpoint**: User Story 3 complete — configuração e documentação separadas; setup reproduzível

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validação final, testes automatizados dos fluxos principais e consistência.

- [X] T030 Create or update checklist manual for main flows (autenticação, cobrança, geração de conteúdo) in specs/001-monorepo-split/checklists/ or README (FR-011)
- [X] T031 Add backend integration or E2E tests for main flows (auth callback, stripe checkout/webhook, openai narratives/carousel) in backend/tests/ (pytest), executable via `uv run pytest` (FR-011)
- [X] T032 Run quickstart.md validation: follow quickstart steps and confirm frontend + backend start and main flows work
- [X] T033 [P] Update contracts in specs/001-monorepo-split/contracts/api-backend.md if any route or payload changed during implementation
- [X] T034 Verify CORS and env are configurable per environment (no hardcoded origins or keys in code)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — blocks route implementation and US2
- **User Story 1 (Phase 3)**: Depends on Setup + Foundational — structure and runnable apps
- **User Story 2 (Phase 4)**: Depends on Foundational; benefits from US1 (structure already in place)
- **User Story 3 (Phase 5)**: Depends on US1/US2 (docs refer to existing structure and env)
- **Polish (Phase 6)**: Depends on all user stories

### User Story Dependencies

- **User Story 1 (P1)**: After Foundational — no dependency on US2/US3
- **User Story 2 (P2)**: After Foundational; can start after US1 (frontend/ already exists)
- **User Story 3 (P3)**: After US1; docs reference structure and env from US1/US2

### Parallel Opportunities

- T005 and T006 (READMEs) can run in parallel
- Within US2: T015, T016, T018, T019 can run in parallel (different route files); T021 can run in parallel with backend route tasks
- T033 can run in parallel with T030, T031, T032

---

## Parallel Example: User Story 2

```bash
# Backend routes em paralelo (arquivos diferentes):
Task: "Implement auth callback route in backend/app/api/routes/auth.py"
Task: "Implement POST /stripe/create-checkout-session in backend/app/api/routes/stripe.py"
Task: "Implement POST /openai/narratives in backend/app/api/routes/openai.py"
Task: "Implement POST /openai/carousel-master-prompt and POST /openai/carousel-images in backend/app/api/routes/openai.py"

# Depois: T017 (webhook), T020 (services), T021–T025 (frontend client)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (backend skeleton, frontend moved, workspace)
2. Complete Phase 2: Foundational (config, CORS, main.py, deps)
3. Complete Phase 3: User Story 1 (health/docs, frontend runs, root README)
4. **STOP and VALIDATE**: Run backend and frontend from docs; confirm structure is clear

### Incremental Delivery

1. Setup + Foundational → base pronta
2. US1 → estrutura clara e ambos executáveis (MVP do split)
3. US2 → frontend como cliente da API (fluxos via backend)
4. US3 → documentação e configuração por app
5. Polish → checklist + testes automatizados + quickstart validation

### Parallel Team Strategy

- After Foundational: one developer can own backend routes (T015–T020, T031), another frontend client (T021–T025) and docs (T026–T029), with sync on contract and env names.

---

## Notes

- [P] = different files, no dependencies
- [USn] maps task to user story for traceability
- Backend: sempre `uv run` para app e testes (backend/)
- Contratos em specs/001-monorepo-split/contracts/ são a referência da API
- FR-011: checklist manual e testes automatizados obrigatórios antes de dar o refactor por concluído

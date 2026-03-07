# Implementation Plan: Monorepo Frontend/Backend Split

**Branch**: `001-monorepo-split` | **Date**: 2026-02-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-monorepo-split/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Refatorar o repositório para monorepo com separação clara entre frontend (Next.js) e backend (FastAPI). O backend concentra integrações (Supabase, Stripe, OpenAI), callbacks de autenticação e webhooks; o frontend consome a API via base configurável. Configurações e documentação separadas por app; CORS restrito às origens do frontend.

## Technical Context

**Language/Version**: TypeScript (frontend), Python 3.12+ (backend)
**Primary Dependencies**: Next.js 14 (App Router), React 18, FastAPI (backend), Supabase, Stripe, OpenAI
**Storage**: Supabase (PostgreSQL); backend pode acessar via cliente server-side
**Testing**: Jest/React Testing Library (frontend), pytest (backend, executado via `uv run` em `backend/`), E2E ou integração para fluxos principais
**Target Platform**: Web (frontend: browser; backend: servidor Linux/Node-compatível)
**Project Type**: web-application (frontend + backend)
**Performance Goals**: Respostas de API adequadas ao uso atual; sem requisitos formais de throughput
**Constraints**: CORS configurável por ambiente; callback de auth e webhooks no backend
**Scale/Scope**: Monorepo com 2 apps (frontend, backend); fluxos principais: autenticação, cobrança, geração de conteúdo

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Código simples, legível e de fácil manutenção
- [x] Organização e padrões existentes respeitados (frontend mantém stack; backend FastAPI alinhado à Constituição)
- [x] Abstrações novas justificadas por ganho claro (split explicado pela spec)
- [x] Testes alinhados ao padrão do projeto quando aplicável
- [x] Experiência do usuário consistente com o app
- [x] Complexidade reduzida ou justificada no plano (separação reduz confusão)

## Project Structure

### Documentation (this feature)

```text
specs/001-monorepo-split/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   ├── stripe.py
│   │   │   └── openai.py
│   │   └── deps.py
│   ├── core/
│   │   ├── config.py
│   │   └── cors.py
│   ├── services/
│   └── models/
├── tests/
├── pyproject.toml
└── README.md

frontend/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── utils/
├── tests/
├── package.json
└── README.md
```

**Structure Decision**: Opção 2 (web application). Raiz do repositório mantém configuração de monorepo (pnpm/workspaces se aplicável). `frontend/` contém o app Next.js atual migrado; `backend/` novo app FastAPI com rotas de API, callbacks de autenticação e webhooks (Stripe). Contratos de API documentados em `specs/001-monorepo-split/contracts/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

# Implementation Plan: Finalizar fluxo de carrossel Instagram

**Branch**: `002-instagram-carousel-flow` | **Date**: 2026-03-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-instagram-carousel-flow/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Concluir o fluxo de carrossel do Instagram com pipeline de prompts mais consistente (narrativa -> estrutura do carrossel -> imagens), validações de campos obrigatórios, retry por slide em falha parcial e download final em ZIP (`post/slide_01.png`...`slide_05.png` + `caption.txt`). A implementação preserva a arquitetura atual (frontend Next.js + backend FastAPI), com contratos explícitos para payloads de slides e exportação.

## Technical Context

**Language/Version**: TypeScript 5.x (frontend), Python 3.12+ (backend)
**Primary Dependencies**: Next.js 14 + React 18, Zustand, FastAPI, OpenAI SDK
**Storage**: Supabase (dados de usuário/autenticação); ativos do post gerados sob demanda (sem persistência obrigatória no escopo)
**Testing**: frontend com validação manual do fluxo + lint existente; backend com pytest para contratos/integração quando houver mudança de rota
**Target Platform**: aplicação web (browser + backend Linux)
**Project Type**: web-application (frontend + backend)
**Performance Goals**: geração completa do carrossel e download em tempo compatível com SC-004 (mediana < 6 min no fluxo inteiro)
**Constraints**: carrossel fixo em 5 slides; retry apenas nos slides falhos; download só após geração válida; sem publicação direta no Instagram
**Scale/Scope**: fluxo de narrativa -> edição -> geração -> preview -> download para usuários autenticados

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Status: PASS in pre-research gate and PASS after Phase 1 design artifacts.

- [x] Código simples, legível e de fácil manutenção
- [x] Organização e padrões existentes respeitados (frontend Next.js e backend FastAPI mantidos)
- [x] Abstrações novas justificadas por ganho claro (pipeline de prompts modular e contrato explícito)
- [x] Testes alinhados ao padrão do projeto quando aplicável
- [x] Experiência do usuário consistente com o app (preview, mensagens acionáveis e CTA existente)
- [x] Complexidade reduzida ou justificada no plano (evita reprocessamento total ao retentar por slide)

## Project Structure

### Documentation (this feature)

```text
specs/002-instagram-carousel-flow/
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
│   ├── api/
│   │   ├── routes/
│   │   │   └── openai.py
│   │   └── deps.py
│   ├── services/
│   │   └── openai_service.py
│   └── main.py
└── tests/

frontend/
├── src/
│   ├── app/
│   │   ├── hooks/
│   │   └── narrative/edit/
│   ├── components/
│   │   ├── common/carousel/
│   │   └── post/
│   ├── utils/
│   │   ├── api/openai/
│   │   ├── parseNarratives.ts
│   │   └── stores/dashboard/narrative/
│   └── types.ts
└── tests/
```

**Structure Decision**: Opção web-application (frontend + backend). O frontend continua responsável por entrada/edição/preview; o backend mantém geração via OpenAI e entrega artefatos finais quando necessário (incluindo payloads de imagens e exportação ZIP), mantendo fronteira de responsabilidades clara.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |

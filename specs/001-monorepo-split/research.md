# Research: Monorepo Split (Backend FastAPI)

**Feature**: `001-monorepo-split` | **Date**: 2026-02-28

## Decisões e rationale

### Backend: FastAPI (Python)

- **Decision**: API e integrações de servidor em FastAPI (Python 3.12+).
- **Rationale**: Alinhado à Constituição (Padrões do Projeto). FastAPI oferece tipagem, documentação OpenAPI automática, async nativo e ecossistema Python para Supabase, Stripe e OpenAI. Separação clara de responsabilidades em relação ao frontend Next.js.
- **Alternatives considered**: Manter API em Next.js Route Handlers (rejeitado: spec exige backend separado); Node/Express (rejeitado: decisão explícita do usuário por FastAPI).

### CORS configurável

- **Decision**: Usar `CORSMiddleware` do FastAPI com lista de origens carregada de variável de ambiente (ex.: `ALLOWED_ORIGINS`, CSV).
- **Rationale**: Produção exige origens explícitas; wildcard não é compatível com `allow_credentials=True`. Valores por ambiente evitam hardcode e atendem FR-010.
- **Alternatives considered**: `allow_origins=["*"]` (rejeitado para produção); arquivo de config por ambiente (aceitável, mas env é mais simples para deploy).

### Webhooks Stripe no backend

- **Decision**: Endpoint POST no FastAPI que recebe o body bruto, lê o header `stripe-signature` e usa `stripe.Webhook.construct_event(body, signature, endpoint_secret)` para validar; tratamento de eventos (ex.: `checkout.session.completed`) após validação.
- **Rationale**: Validação de assinatura requer body em bytes inalterados; FastAPI permite injeção do body bruto via `Request.body()`. Segredo do webhook em variável de ambiente.
- **Alternatives considered**: Proxy no Next.js (rejeitado: webhooks devem ficar no backend conforme spec).

### Callback de autenticação (Supabase)

- **Decision**: Rota no backend FastAPI que recebe o redirect do Supabase, trata cookies/sessão no domínio do backend e redireciona o usuário de volta ao frontend (URL configurável). Documentar domínio de cookies e fluxo em quickstart/README do backend.
- **Rationale**: FR-008 exige callback como rota do backend; cookies e domínio devem ser coerentes com o host da API. Frontend apenas inicia o fluxo e recebe o redirect final.
- **Alternatives considered**: Callback no Next.js (rejeitado pela spec).

### Testes backend

- **Decision**: pytest para testes unitários e de integração do backend; fluxos críticos (auth, cobrança, geração de conteúdo) cobertos por checklist manual e testes automatizados (E2E ou integração), conforme FR-011.
- **Rationale**: Padrão dominante em projetos Python/FastAPI; alinhado ao princípio de testes do projeto.

## Referências úteis

- FastAPI CORS: [tiangolo.com/tutorial/cors](https://fastapi.tiangolo.com/tutorial/cors/)
- Stripe webhooks: usar body bruto e `stripe.Webhook.construct_event`; nunca deserializar JSON antes da verificação de assinatura.

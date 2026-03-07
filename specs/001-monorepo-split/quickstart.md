# Quickstart: Monorepo Frontend + Backend

**Branch**: `001-monorepo-split`

Após a implementação do split, seguir estes passos para rodar o projeto localmente.

## Pré-requisitos

- Node.js 18+ e pnpm (frontend)
- Python 3.12+ e uv (backend)

## Variáveis de ambiente

### Frontend (`frontend/`)

- `NEXT_PUBLIC_API_URL`: URL base do backend (ex.: `http://localhost:8000`)
- Variáveis Supabase usadas apenas no cliente (se aplicável): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Outras já existentes no projeto (ex.: Stripe publishable key se usado no cliente)

### Backend (`backend/`)

- `ALLOWED_ORIGINS`: Origens CORS permitidas, separadas por vírgula (ex.: `http://localhost:3000`)
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (ou equivalente para admin)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- URL de redirect pós-login (ex.: `FRONTEND_URL=http://localhost:3000`) para o callback de autenticação

## Comandos

### Backend

```bash
cd backend
# Ambiente virtual em backend/.venv (criado por uv). Sempre usar uv run para app e testes.
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

Testes e lint (sempre com o Python do venv):

```bash
cd backend
uv run pytest
uv run ruff check .
```

Documentação interativa: `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

App: `http://localhost:3000` (ou porta configurada).

### Rodar em paralelo

Em dois terminais: um com o backend (porta 8000), outro com o frontend (porta 3000). Garantir que `NEXT_PUBLIC_API_URL` e `ALLOWED_ORIGINS` estejam coerentes (frontend aponta para o backend; backend permite origem do frontend).

## Webhooks e callbacks

- **Stripe**: Configurar no dashboard do Stripe a URL do webhook como `https://seu-backend.com/stripe/webhook` (em dev, usar Stripe CLI para encaminhar).
- **Supabase**: Configurar redirect URL de autenticação para a rota de callback do frontend (ex.: `http://localhost:3000/auth/callback`).
- **Auth backend**: O frontend sincroniza cookies de backend via `POST /auth/set-cookies` e usa `Authorization: Bearer <token>` como fallback para cenários com domínios diferentes.

## Validação

- Checklist manual e testes automatizados cobrindo autenticação, cobrança e geração de conteúdo (ver spec e data-model).
- Contratos em `specs/001-monorepo-split/contracts/` como referência da API do backend.

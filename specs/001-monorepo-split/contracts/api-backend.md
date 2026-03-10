# Contrato da API do Backend (FastAPI)

**Feature**: `001-monorepo-split` | **Versão**: 0.1.0

Base URL do backend é configurável no frontend (ex.: `NEXT_PUBLIC_API_URL`). Todas as rotas abaixo são relativas a essa base.

## Autenticação

### Callback OAuth (frontend)

- **Rota**: Callback OAuth do frontend (ex.: `/auth/callback` em Next.js).
- **Uso**: Supabase redireciona o usuário ao frontend; o frontend troca o código por sessão e faz `POST /auth/set-cookies` no backend para sincronizar cookies do domínio da API.
- **Resposta**: 302 redirect interno no frontend para a rota `next` sanitizada (fallback `/dashboard`).

### POST /auth/set-cookies

- **Request**: `application/json`
  - `access_token` (string, obrigatório)
  - `refresh_token` (string, opcional)
- **Uso**: Define cookies `HttpOnly` no domínio do backend para autenticação em chamadas com `credentials: include`.
- **Response 200**: `application/json`
  - `success` (boolean)
- **Erros**: 400 quando `access_token` ausente.

## Cobrança (Stripe)

### POST /stripe/create-checkout-session

- **Request**: `application/json`
  - `planId` (string, obrigatório): ID do plano (tabela `plan` no Supabase).
- **Headers**: Credenciais/cookies de sessão (usuário autenticado via Supabase).
- **Response 200**: `application/json`
  - `url` (string): URL do Stripe Checkout para redirecionar o usuário.
- **Erros**: 400 (planId inválido ou plano não encontrado), 401 (não autenticado), 500 (erro ao criar sessão ou perfil).

### POST /stripe/webhook

- **Request**: Body bruto (bytes); header `stripe-signature` obrigatório.
- **Uso**: Recebido pelo Stripe; o backend valida a assinatura com `STRIPE_WEBHOOK_SECRET`.
- **Evento tratado**: `checkout.session.completed` — persiste/atualiza subscription no Supabase (profile_id, plan_id, stripe_subscription_id).
- **Response**: 200 com `{ "received": true }` em sucesso; 400 em falha de validação ou payload inválido.

## Geração de conteúdo (OpenAI)

### POST /openai/narratives

- **Request**: `application/json`
  - `prompt` (string): texto para geração de narrativas (chat completion).
- **Response 200**: `application/json`
  - `narratives` (array): lista de narrativas parseadas retornadas pelo backend.
- **Erros**: 401 se não autenticado (quando aplicável), 500 em falha da OpenAI.

### POST /openai/carousel-master-prompt

- **Request**: `application/json`
  - `prompt` (string): prompt para geração do master prompt do carrossel.
- **Response 200**: `application/json`
  - `content` (string): texto retornado pelo modelo.
- **Erros**: idem acima.

### POST /openai/carousel-images

- **Request**: `application/json`
  - `slides` (array de objetos com pelo menos `image_prompt`): lista de slides para geração de imagens (DALL-E 3).
- **Response 200**: `application/json`
  - `urls` (array de strings): URLs das imagens geradas, na mesma ordem que `slides`.
- **Erros**: idem acima.

---

**Manutenção**: Ao alterar rotas, payloads ou respostas, atualizar este contrato e o consumidor (frontend) em conjunto.

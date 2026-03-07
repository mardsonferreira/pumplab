# Manual checklist: main flows (FR-011)

**Feature**: 001-monorepo-split | **Purpose**: Validate auth, billing, and content generation after split.

Run with backend on port 8000 and frontend on port 3000; `NEXT_PUBLIC_API_URL` and `ALLOWED_ORIGINS` set correctly.

## Autenticação

- [ ] Open frontend, click login (Google). Redirects to Supabase OAuth.
- [ ] After OAuth, redirect goes to frontend `/auth/callback` (exchange), then to backend `/auth/set-cookies`, then to frontend `/auth/set-session`, then to `/dashboard` (or `next` path).
- [ ] Dashboard (or protected page) loads with user session; no redirect to home.
- [ ] Logout (if implemented) clears session; protected routes redirect to home.

## Cobrança (Stripe)

- [ ] Pricing page lists plans (from Supabase or backend).
- [ ] Click “Confirmar assinatura” on a plan: redirects to Stripe Checkout (or shows “Faça login” if not logged in).
- [ ] After successful payment, redirect to dashboard with success message.
- [ ] Stripe webhook (e.g. via Stripe CLI forward): `checkout.session.completed` is received by backend; subscription is created/updated in Supabase.

## Geração de conteúdo (OpenAI)

- [ ] Dashboard: enter theme, submit. Narratives are generated and displayed (via backend `/openai/narratives`).
- [ ] Select a narrative, go to edit. Carousel/Story flow calls backend `/openai/carousel-master-prompt` and `/openai/carousel-images`; images or placeholders appear.
- [ ] If backend is down, frontend shows friendly error and option to retry (no raw stack trace).

## Notes

- Backend integration tests cover route wiring and mocked external services; this checklist validates real E2E with real (or test) Supabase/Stripe/OpenAI.

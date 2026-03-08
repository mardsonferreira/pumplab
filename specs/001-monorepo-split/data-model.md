# Data Model (Feature: Monorepo Split)

**Branch**: `001-monorepo-split` | **Date**: 2026-02-28

Este documento descreve as entidades e fluxos relevantes para o split frontend/backend. Não introduz novo modelo de dados de negócio; foca na organização dos apps e contratos.

## Entidades

### Aplicação Frontend

- **Responsabilidade**: UI, páginas, layouts, componentes e lógica de interação.
- **Campos/concern**: Base URL da API (configurável), tratamento de erro quando backend indisponível (mensagem + retry).
- **Regras**: Não conter lógica exclusiva de servidor; todas as chamadas de dados via API externa (backend).

### Aplicação Backend

- **Responsabilidade**: API HTTP, integrações (Supabase, Stripe, OpenAI), callbacks de autenticação, webhooks.
- **Campos/concern**: CORS (origens permitidas configuráveis), rotas documentadas, variáveis de ambiente por ambiente.
- **Regras**: Aceitar apenas origens do frontend (CORS); callbacks e webhooks implementados e documentados no backend.

### Contrato de API

- **Descrição**: Conjunto de rotas, métodos, payloads e respostas acordados entre frontend e backend.
- **Relacionamento**: Frontend consome; backend expõe. Contratos documentados em `contracts/` e mantidos atualizados.
- **Regras**: Mudanças em rotas ou payloads exigem atualização do contrato e do consumidor.

### Configuração de Ambiente

- **Descrição**: Variáveis e parâmetros separados por app (frontend vs backend).
- **Regras**: Documentadas por app; sem variáveis de backend no frontend e vice-versa, exceto o que for necessário para integração (ex.: URL do backend no frontend).

## Transições de estado (fluxos)

- **Autenticação**: Usuário inicia login no frontend → redirect para Supabase → callback no **backend** → backend trata cookies/sessão → redirect de volta ao **frontend**.
- **Cobrança (Stripe)**: Frontend chama backend para criar sessão de checkout → backend usa Supabase + Stripe → retorna URL de checkout; webhooks Stripe são recebidos apenas no **backend**.
- **Geração de conteúdo (OpenAI)**: Frontend chama backend → backend chama OpenAI e retorna resultado; chave da API fica apenas no backend.

## Validação pós-split

- Checklist manual e testes automatizados cobrindo autenticação, cobrança e geração de conteúdo (FR-011).
- Contratos em `contracts/` como referência para manter frontend e backend sincronizados.

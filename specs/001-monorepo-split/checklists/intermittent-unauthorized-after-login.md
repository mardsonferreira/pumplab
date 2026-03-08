# Bug: "Não autorizado" intermitente após login

## Sintoma observado

Após logar e entrar no `Dashboard`, em alguns momentos, ao clicar nas sugestões de tema (ex.: "Consistência vence a motivação"), a aplicação mostra:

- `Não autorizado. Tente novamente abaixo.`

Esse erro aparece durante chamadas para geração de conteúdo (`/openai/*`) e, na prática, o problema costuma ser resolvido temporariamente ao fazer logout e login novamente.

## Como a autenticação funciona hoje

### 1) Login e criação de sessão

- O frontend usa Supabase OAuth (`signInWithOAuth`) e redireciona para `frontend/src/app/auth/callback/route.ts`.
- No callback, o frontend troca `code` por sessão (`exchangeCodeForSession`), obtém `access_token` e `refresh_token`, e:
  - grava cookies no contexto do frontend;
  - chama `POST /auth/set-cookies` no backend para o backend gravar cookies httpOnly no domínio da API (`sb-access-token`, `sb-refresh-token`).

#### Papel do método `auth_set_cookies` (`backend/app/api/routes/auth.py:11-42`)

O endpoint `POST /auth/set-cookies`, implementado pelo método `auth_set_cookies`, é a ponte entre a sessão criada no callback do frontend e os cookies usados nas chamadas ao backend:

- recebe `access_token` e `refresh_token` no body;
- valida presença mínima de `access_token` (retorna 400 se ausente);
- grava `sb-access-token` e `sb-refresh-token` como cookies `httponly` no domínio do backend;
- retorna `{ "success": true }`.

Participação no processo:

- **o que ele resolve:** sincroniza os tokens do login para o backend, permitindo autenticação por cookie nas requisições seguintes;
- **o que ele não resolve sozinho:** não faz renovação automática dos cookies ao longo da sessão (após expiração do access token), a menos que seja chamado novamente com tokens renovados.

### 2) Chamadas do frontend para o backend

- O cliente HTTP (`frontend/src/lib/api/client.ts`) usa:
  - `credentials: "include"` (envia cookies para a API);
  - `Authorization: Bearer <token>` quando `supabase.auth.getSession()` retorna token.
- As rotas de OpenAI (`frontend/src/utils/api/openai/index.ts`) falham com `"Não autorizado."` quando recebem status HTTP 401.

### 3) Validação no backend

- O backend (`backend/app/api/deps.py`) autentica com esta ordem:
  1. Header `Authorization: Bearer ...`
  2. Cookie `sb-access-token`
- Em seguida valida JWT com Supabase (`client.auth.get_user(jwt=access_token)`).
- Se token ausente ou inválido/expirado, retorna 401 (`Unauthorized`).

## Evidência coletada no incidente

No request com falha:

- Não havia header `Authorization: Bearer ...`.
- Havia cookie `sb-access-token` e `sb-refresh-token`.
- O `sb-access-token` estava expirado:
  - `iat`: 07/03/2026 12:36:48 -03
  - `exp`: 07/03/2026 13:36:48 -03
  - horário da falha: 07/03/2026 16:42:04 -03

Conclusão: o backend recebeu token vencido e respondeu 401 corretamente.

## Motivo raiz do problema

O fluxo atual não garante renovação e ressincronização dos tokens para o backend no momento da falha:

- quando a chamada vai sem `Authorization`, o backend depende do `sb-access-token` em cookie;
- se esse cookie estiver expirado, a requisição falha;
- o backend hoje não tenta refresh automático a partir do `sb-refresh-token` antes de retornar 401;
- o frontend também não faz retry com refresh automático ao receber 401 nessas chamadas.

Por isso o erro é intermitente e "volta ao normal" após novo login (que recria/sincroniza tokens válidos).

## Sugestão de resolução

### Opção recomendada (frontend + backend mais resiliente)

1. **Frontend: retry em 401**
   - No `apiFetch`, ao receber 401:
     - executar `supabase.auth.refreshSession()`;
     - atualizar header `Authorization` com novo token;
     - repetir a request uma única vez.

2. **Frontend: ressincronizar cookies do backend após refresh**
   - Após refresh bem-sucedido, chamar `POST /auth/set-cookies` com novos tokens para manter backend e frontend alinhados.

3. **Backend: fallback com refresh token (defesa extra)**
   - Se `sb-access-token` falhar por expiração, tentar renovação com `sb-refresh-token` antes de devolver 401 final.

### Alternativa mínima

- Implementar apenas o retry com `refreshSession()` no frontend já reduz bastante o problema, mas a solução completa fica mais robusta com a ressincronização e fallback no backend.

## Critérios de validação após correção

1. Login no app e uso contínuo por período maior que 1h.
2. Ao clicar em sugestões no `Dashboard`, as chamadas `/openai/narratives` devem continuar em 200.
3. Em expiração de token, a aplicação deve se recuperar sem exigir logout/login manual.
4. Não deve aparecer o alerta `"Não autorizado. Tente novamente abaixo."` em fluxo normal.

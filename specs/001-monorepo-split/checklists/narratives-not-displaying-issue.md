# Bug: Narrativas não aparecem após gerar no dashboard

## Sintoma

Usuário digita um tema (ou clica em sugestão, ex.: "Consistência vence a motivação"), o front chama `POST /openai/narratives`, o backend responde **200 OK** com o body correto, mas **nada acontece na tela** — os cards de narrativas não aparecem; só o tema permanece no campo de texto.

## Fluxo esperado

1. **Front** (dashboard, client): `generateNarrative(input)` → `generateNarratives(prompt)` (fetch) → `parseNarratives(content)` → `setNarratives(...)`.
2. **Backend**: recebe `{ "prompt": "..." }`, chama OpenAI, devolve `{ "content": "<string>" }`.
3. **Front**: lê `data.content`, faz parse e exibe os cards.

Arquivos principais:

- `frontend/src/app/hooks/openai.ts` — hook que chama a API e faz `setNarratives(parseNarratives(content))`.
- `frontend/src/utils/api/openai/index.ts` — `generateNarratives()` faz POST e retorna `data.content ?? ""`.
- `frontend/src/utils/parseNarratives.ts` — `parseNarratives(raw)` faz `raw.replace(/'/g, '"')` e `JSON.parse(normalized)`; em erro retorna `[]`.

## Contexto relevante

- **Backend**: logs mostram `POST /openai/narratives` 200 OK; o response body tem a forma `{ "content": "[{'id':'...','theme':'...', ...}]" }` (string no estilo Python, aspas simples).
- **Response de exemplo**: o `content` é uma string longa com lista de objetos (id, theme, central_thesis, main_argument, narrative_sequence). Em alguns trechos há `\"` dentro do texto (ex.: `\"eu\"`, `\"sou uma pessoa ativa\"`).
- **Parse atual**: substituição global `'` → `"` é frágil; qualquer apóstrofo dentro de um valor (ex.: "don't", "d'água") quebra o JSON e faz `parseNarratives` retornar `[]` (e o catch só faz `console.error("Failed to parse narratives:", error)`).
- **Rede**: em alguns ambientes apareceram erros `ENETUNREACH` em fetches no **servidor** Next (ex.: Supabase auth). O request de narrativas é feito no **cliente** (browser); se o 200 que você vê é do mesmo request no Network do browser, então o problema é no front (parse ou uso da resposta).

## O que verificar / como resolver

1. **Console do browser**: ao gerar narrativas, procurar por `"Failed to parse narratives:"` — se aparecer, o parse está falhando (retorna `[]` e nada é exibido).
2. **Debug rápido no hook**: logo após obter `content` e antes de `setNarratives`, fazer `console.log('narratives raw length', content?.length)` e `console.log('parsed', parseNarratives(content))` para confirmar se o body chega e se o parse devolve array ou vazio/erro.
3. **Solução robusta**: fazer o backend devolver JSON já válido (aspas duplas) em vez de string estilo Python, e no front usar `JSON.parse(content)` sem o `replace(/'/g, '"')`; ou então melhorar `parseNarratives` para lidar com o formato atual (ex.: parser mais seguro que não quebre em apóstrofos).
4. **Contrato**: `specs/001-monorepo-split/contracts/api-backend.md` — POST /openai/narratives response é `content` (string). Front já espera `data.content`.

## Resumo em uma linha

Backend retorna 200 com `content` correto; o front depende de `parseNarratives(content)` para popular os cards — se o parse falhar (ou o conteúdo não chegar), o array fica vazio e “nada acontece”.

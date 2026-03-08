# Feature Specification: Finalizar fluxo de carrossel Instagram

**Feature Branch**: `002-instagram-carousel-flow`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "Finalizar o fluxo de geração de imagens/texto para carrossel do instagram. A tarefa envolve organizar e melhorar os prompts."

## Clarifications

### Session 2026-03-07

- Q: What format should "Baixar Post" (download) deliver? → A: ZIP containing a folder `post/` with one PNG per slide (`slide_01.png` … `slide_05.png`) and `caption.txt` for the caption/legenda.
- Q: When image generation fails for only some slides, how should retry work? → A: Per-slide retry: user can retry only the failed slide(s); successful slides and texts are kept.
- Q: Is the number of slides fixed at 5 or configurable? → A: Fixed at 5 slides.
- Q: When the user changes the narrative after reviewing fields, what should happen to preview/carousel state? → A: Discard carousel and preview; keep the newly selected/edited narrative only. User must trigger "Carrossel/Story" again to regenerate.
- Q: What is explicitly out of scope for this feature? → A: Only the carousel flow and download as described; no scheduling, no direct publish to Instagram, no multi-account.

## Pipeline de Prompts

A geração do carrossel segue um pipeline sequencial de prompts. Cada etapa transforma o conteúdo narrativo em uma representação mais estruturada até a geração final das imagens.

### Prompt 1 — Geração de Opções de Narrativa

Após o usuário selecionar um tema ou sugestão inicial, o sistema gera múltiplas opções de narrativa para escolha.

**Entrada:**

- tema selecionado pelo usuário

**Saída:**

- lista de narrativas candidatas

### Prompt 2 — Estrutura Narrativa

Após o usuário selecionar uma narrativa, o sistema gera (ou refina) a estrutura completa do conteúdo.

**Entrada:**

- narrativa escolhida

**Saída:**

- tese central
- argumento principal
- sequência narrativa

### Prompt 3 — Estrutura do Carrossel

Transforma a narrativa em conteúdo específico para slides e legenda do post.

**Entrada:**

- tese
- argumento
- sequência narrativa

**Saída:**

- slides (5 slides, conforme escopo da feature)
- legenda do post

Regra de negocio do pipeline:

- o Prompt 3 finaliza o conteudo textual do post (slides + legenda)
- a legenda segue para preview e exportacao
- apenas os slides seguem para o Prompt 4 (geracao de imagens)

Cada slide MUST conter:

- `text`
- `role`

Valores possíveis de `role`:

- `central_thesis`
- `argument`
- `sequence`
- `cta` (call to action)

### Prompt 4 — Geração de Imagens

Para cada slide, o sistema gera uma imagem baseada no texto do slide.

**Entrada:**

- texto do slide
- papel narrativo (`role`)
- prompt global de estilo

**Saída:**

- imagem do slide

O Prompt 4 nao gera nem altera a legenda; ele processa apenas os 5 slides definidos no Prompt 3.

O prompt final de geração de imagem MUST combinar:

- estilo visual global do carrossel
- descrição visual derivada do texto do slide
- instruções de tipografia para o texto sobreposto

Isso garante consistência visual entre os slides (FR-011) e alinhamento entre imagem e narrativa (FR-004).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gerar carrossel alinhado com narrativa (Priority: P1)

Como criador de conteúdo, quero escolher uma narrativa, revisar os textos e gerar um carrossel em que cada imagem reflita o texto correspondente para publicar conteúdo coerente e atrativo.

**Why this priority**: Esse é o núcleo do valor da funcionalidade. Sem alinhamento entre texto e imagem, o fluxo não atende o objetivo principal de gerar carrossel pronto para Instagram.

**Independent Test**: Pode ser testado fim a fim escolhendo uma sugestao de narrativa, selecionando uma opcao, ajustando os campos e gerando o carrossel; o resultado deve exibir slides com texto e imagem coerentes em cada pagina.

**Acceptance Scenarios**:

1. **Given** que o usuario selecionou uma sugestao de narrativa e escolheu uma opcao da lista, **When** ele ajusta tese, argumento e sequencia e clica em "Carrossel/Story", **Then** o sistema gerar slides em que cada imagem represente visualmente o texto narrativo correspondente.
2. **Given** que ha textos de passos definidos na narrativa, **When** o carrossel e gerado, **Then** cada slide contem uma imagem visualmente relacionada ao texto daquele passo e nao apenas imagens genericas repetidas.
3. **Given** que o usuario informou legenda principal e sequencia de passos, **When** o conteudo e preparado, **Then** o sistema separa o que vai para legenda e o que vai para os slides de forma consistente com a narrativa.

---

### User Story 2 - Refinar prompts para consistencia de resultado (Priority: P2)

Como criador de conteúdo, quero que os prompts de geração sejam organizados e claros para reduzir resultados inconsistentes entre os slides e melhorar a qualidade narrativa do carrossel.

**Why this priority**: A qualidade dos prompts impacta diretamente relevancia visual, consistencia entre slides e retrabalho.

**Independent Test**: Pode ser testado gerando multiplos carrosseis com entradas equivalentes e verificando se os resultados mantem tom, tema e progressao narrativa com menor variacao indevida.

**Acceptance Scenarios**:

1. **Given** uma narrativa selecionada e campos preenchidos, **When** os prompts sao montados para cada slide, **Then** cada prompt inclui contexto narrativo suficiente para preservar o tema e o objetivo do post.
2. **Given** um conjunto de cinco passos narrativos, **When** o sistema prepara as instrucoes para geracao de imagem, **Then** os prompts representam progressao logica entre os passos, evitando contradicoes entre slides.

---

### User Story 3 - Baixar postagem pronta (Priority: P3)

Como criador de conteúdo, quero baixar a postagem ao clicar em "Baixar Post" para reutilizar o material imediatamente no Instagram sem etapas manuais extras.

**Why this priority**: O download fecha o fluxo de entrega de valor e transforma a geracao em material utilizavel fora do sistema.

**Independent Test**: Pode ser testado apos gerar um carrossel completo; ao clicar em "Baixar Post", o usuario recebe um arquivo de saida contendo os ativos do post.

**Acceptance Scenarios**:

1. **Given** um carrossel valido gerado com multiplos slides, **When** o usuario clica em "Baixar Post", **Then** o sistema inicia o download de um pacote com os assets necessarios da postagem.
2. **Given** que o usuario tenta baixar sem geracao concluida, **When** ele clica em "Baixar Post", **Then** o sistema bloqueia a acao e exibe orientacao para concluir a geracao primeiro.

---

### Edge Cases

- Usuario altera a narrativa apos revisar campos: o sistema deve descartar carrossel e preview, mantendo apenas a narrativa selecionada/editada; o usuario deve acionar "Carrossel/Story" novamente para regenerar.
- Um ou mais passos da sequencia ficam vazios: o sistema deve impedir a geracao e informar exatamente quais campos precisam ser preenchidos.
- Geracao de imagem falha em apenas parte dos slides: o sistema deve sinalizar os slides com falha e permitir tentativa por slide (retry apenas dos slides falhos; slides e textos ja gerados com sucesso permanecem).
- O usuario aciona download em conexao instavel: o sistema deve informar falha de download e permitir tentar novamente sem regenerar todo o conteudo.
- Texto muito longo para o slide: o sistema deve aplicar regra de adaptacao de conteudo (resumo ou quebra) sem perder a mensagem central.

## Requirements *(mandatory)*

### Out of Scope

- Agendamento de publicacao (scheduling).
- Publicacao direta no Instagram a partir da plataforma.
- Suporte a multiplas contas ou A/B testing de legendas.
- Escopo limitado ao fluxo de carrossel e download descrito nesta spec.

### Functional Requirements

- **FR-001**: O sistema MUST permitir que o usuario inicie o fluxo selecionando uma sugestao de narrativa e, em seguida, escolhendo uma narrativa especifica para edicao.
- **FR-002**: O sistema MUST permitir revisao e ajuste da tese central, argumento principal e passos da sequencia narrativa antes da geracao do carrossel.
- **FR-003**: O sistema MUST gerar um conjunto de slides em que cada slide seja associado a um trecho narrativo definido pelo usuario.
- **FR-004**: O sistema MUST gerar imagens orientadas pelo contexto textual de cada slide, evitando uso de imagens puramente genericas sem relacao com o texto.
- **FR-005**: O sistema MUST preservar consistencia narrativa entre os slides, mantendo tema, tom e progressao logica da sequencia.
- **FR-006**: O sistema MUST distinguir e preparar separadamente o conteudo destinado a legenda e o conteudo destinado ao texto dos slides.
- **FR-007**: O sistema MUST exibir preview navegavel do carrossel com ordem de slides, textos e imagens antes do download.
- **FR-008**: O sistema MUST habilitar "Baixar Post" apenas quando houver geracao concluida e conteudo valido para exportacao.
- **FR-009**: O sistema MUST iniciar o download da postagem ao clicar em "Baixar Post", entregando um ZIP com pasta `post/` contendo `slide_01.png` a `slide_05.png` e `caption.txt`.
- **FR-010**: O sistema MUST apresentar mensagens de erro acionaveis quando houver falha na geracao de imagens, na validacao de campos ou no download. Mensagem acionavel, nesta feature, significa: (a) descrever claramente o problema, (b) indicar a proxima acao imediata (ex.: tentar novamente ou preencher campo especifico), e (c) preservar o estado valido ja gerado.
- **FR-011**: O sistema MUST incluir um contexto visual global compartilhado entre todos os prompts de slides de um mesmo carrossel.
- **FR-012**: O sistema MUST permitir retentar a geracao de imagem por slide individual; em caso de falha parcial, apenas os slides com falha devem ser regerados, mantendo textos e imagens dos slides ja concluidos.

### Key Entities *(include if feature involves data)*

- **Narrative Suggestion**: Sugestao inicial curta apresentada para iniciar rapidamente o fluxo; possui titulo e contexto tematico.
- **Narrative Option**: Opcao completa derivada da sugestao; inclui tese, argumento e sequencia de passos.
- **Narrative Draft**: Estado editavel da narrativa selecionada pelo usuario antes da geracao final.
- **Carousel Slide**: Unidade de conteudo do carrossel, composta por texto do passo, imagem associada e posicao na sequencia.
- **Post Preview**: Conjunto ordenado de slides e legenda exibido para revisao antes de baixar.
- **Download Package**: Saida final baixavel em formato ZIP. Ao descompactar: pasta `post/` contendo `slide_01.png` a `slide_05.png` (uma imagem por slide, ordem da sequencia) e `caption.txt` com o texto da legenda para uso no Instagram.

### Assumptions

- O fluxo principal considera carrossel com cinco passos narrativos, conforme experiencia atual da tela; o numero de slides e fixo em 5 (nao configuravel nesta feature).
- O fluxo inicial de selecao de sugestao/opcao narrativa ja existe no produto; esta feature cobre somente os ajustes necessarios para completar o pipeline de geracao, preview e download.
- O usuario alvo e um criador de conteudo autenticado com permissao para gerar e baixar posts.
- O resultado baixado precisa ser utilizavel fora da plataforma sem edicoes obrigatorias adicionais.
- Qualidade de imagem com alto potencial de engajamento visual para redes sociais sera tratada como alinhamento tematico, clareza de mensagem e apelo visual percebido pelo usuario no preview.

### Dependencies

- Disponibilidade continua do servico de geracao de conteudo durante a sessao do usuario.
- Permissao do usuario para gerar ativos e realizar download da postagem final.
- Existencia de uma etapa de preview antes do download para validacao do resultado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pelo menos 90% dos usuarios concluem o fluxo completo (selecionar narrativa -> gerar carrossel -> baixar post) sem suporte manual.
- **SC-002**: Pelo menos 85% das geracoes produzem todos os slides com imagem e texto coerentes com a sequencia narrativa na primeira tentativa.
- **SC-003**: Em testes de aceitacao com usuarios-alvo, no minimo 80% avaliam o alinhamento entre texto e imagem como "bom" ou "excelente".
- **SC-004**: O tempo mediano para finalizar uma postagem completa, da selecao da narrativa ao download, fica abaixo de 6 minutos.
- **SC-005**: A taxa de falha no download apos geracao valida permanece abaixo de 2% em uso normal.

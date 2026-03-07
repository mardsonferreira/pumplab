# Feature Specification: Monorepo Frontend/Backend Split

**Feature Branch**: `001-monorepo-split`
**Created**: 2026-02-28
**Status**: Draft
**Input**: User description: "Refactor para monorepo com separação clara entre frontend e backend"

## Clarifications

### Session 2026-02-28

- Q: Onde o fluxo de callback de autenticação (ex.: Supabase) deve ficar após o split? → A: Callback como rota do backend; cookies/domínio e redirecionamento de volta ao frontend documentados e implementados no backend.
- Q: Comportamento do frontend quando o backend está indisponível? → A: Mostrar mensagem de erro amigável e permitir retry manual.
- Q: Pacote compartilhado (packages/shared)? → A: Incluir apenas se já existir conteúdo para extrair; senão, deixar para fase posterior (estrutura de workspace pode estar preparada).
- Q: Política de origens (CORS) do backend? → A: Backend aceita apenas a(s) origem(ns) do frontend, configurável por ambiente.
- Q: Como validar que os fluxos principais continuam funcionando após o refactor? → A: Checklist manual detalhado e testes automatizados.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Estrutura clara de apps (Priority: P1)

Como pessoa mantenedora do projeto, quero uma separação clara entre frontend e backend
para entender rapidamente onde cada responsabilidade vive e reduzir confusão.

**Why this priority**: Esta é a base do refactoring e habilita todas as demais mudanças.

**Independent Test**: Ao abrir o repositório, consigo identificar diretórios separados
para frontend e backend e executar cada um de forma independente seguindo a documentação.

**Acceptance Scenarios**:

1. **Given** o repositório recém-clonado, **When** eu navego pela árvore de pastas,
   **Then** encontro diretórios distintos para frontend e backend com responsabilidades
   explícitas.
2. **Given** apenas o backend em execução, **When** eu acesso um endpoint documentado,
   **Then** recebo uma resposta válida sem depender do frontend.

---

### User Story 2 - Frontend como cliente da API (Priority: P2)

Como pessoa desenvolvedora de frontend, quero consumir a API via uma base configurável
para que o frontend não dependa de lógica de servidor embutida.

**Why this priority**: Evita mistura de responsabilidades e permite evolução separada.

**Independent Test**: O frontend realiza chamadas de dados usando a base de API definida
em configuração e não contém lógica exclusiva de servidor.

**Acceptance Scenarios**:

1. **Given** o frontend em execução com base de API configurada, **When** eu navego por
   fluxos que exigem dados, **Then** todas as requisições usam a base da API externa.
2. **Given** o código do frontend, **When** eu busco por lógica exclusiva de servidor,
   **Then** não encontro integrações diretas que deveriam estar no backend.

---

### User Story 3 - Configuração e documentação separadas (Priority: P3)

Como pessoa responsável por operar o projeto, quero configurações e documentação
separadas para frontend e backend para reduzir erros de execução e integração.

**Why this priority**: Evita falhas em deploy e facilita o setup local.

**Independent Test**: A documentação descreve variáveis e comandos por app e o setup
funciona sem ajustes manuais adicionais.

**Acceptance Scenarios**:

1. **Given** a documentação atualizada, **When** eu sigo os passos para rodar frontend
   e backend, **Then** consigo iniciar ambos sem etapas ocultas.
2. **Given** integrações externas existentes, **When** eu atualizo as URLs para o
   backend separado, **Then** os fluxos principais continuam funcionando.

---

### Edge Cases

- O backend está indisponível: o frontend exibe mensagem amigável e permite retry manual (FR-009).
- Contratos entre frontend e backend ficam desatualizados após uma mudança.
- Webhooks ou callbacks externos apontam para URLs antigas.
- Variáveis de ambiente são colocadas no app errado.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE organizar o repositório em apps separados para frontend e backend.
- **FR-002**: O backend DEVE concentrar integrações e lógica de servidor que hoje estão
  misturadas no app atual.
- **FR-003**: O frontend DEVE conter apenas UI e consumir a API via uma base configurável.
- **FR-004**: O pacote compartilhado (packages/shared) DEVE ser criado apenas quando já
  existir conteúdo para extrair; caso contrário, fica para fase posterior (a estrutura de
  workspaces pode ser preparada para recebê-lo depois).
- **FR-005**: As variáveis de ambiente DEVEM ser separadas por app e documentadas.
- **FR-006**: Os scripts de execução DEVEM permitir rodar frontend e backend separadamente
  e em paralelo no desenvolvimento.
- **FR-007**: A documentação DEVE explicar a nova estrutura, comandos e responsabilidades.
- **FR-008**: O callback de autenticação (ex.: Supabase) DEVE ser rota do backend; o tratamento de
  cookies/domínio e o redirecionamento de volta ao frontend DEVEM ser documentados e implementados
  no backend.
- **FR-009**: Quando o backend estiver indisponível, o frontend DEVE exibir mensagem de erro
  amigável e oferecer retry manual.
- **FR-010**: O backend DEVE aceitar requisições apenas da(s) origem(ns) do frontend, com valor
  configurável por ambiente.
- **FR-011**: A validação de que os fluxos principais (autenticação, cobrança, geração de conteúdo)
  continuam funcionando DEVE ser feita por checklist manual detalhado e por testes automatizados
  (E2E ou integração); ambos DEVEM ser executados/verdes antes de dar o refactor por concluído.

### Key Entities *(include if feature involves data)*

- **Aplicação Frontend**: UI, páginas, layouts, componentes e lógica de interação.
- **Aplicação Backend**: API e integrações de servidor usadas pelo produto.
- **Contrato de API**: Conjunto de rotas, formatos e tipos compartilhados.
- **Configuração de Ambiente**: Variáveis e parâmetros separados por app.

## Assumptions & Dependencies

- O refactoring não altera funcionalidades do produto, apenas a organização do código.
- O backend permanece no mesmo repositório e é acessado pelo frontend via configuração.
- Integrações externas precisam apontar para a nova base do backend após a separação.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Uma pessoa nova identifica onde alterar frontend ou backend em até 5 minutos.
- **SC-002**: Frontend e backend iniciam separadamente seguindo a documentação em até 10 minutos.
- **SC-003**: 100% dos fluxos de dados do frontend usam a base de API configurada.
- **SC-004**: Fluxos principais (autenticação, cobrança e geração de conteúdo) continuam
  funcionando após o refactoring, validados por checklist manual detalhado e por testes
  automatizados que cubram esses fluxos.

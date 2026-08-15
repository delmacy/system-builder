# System Builder — Project Docs / WBS Master

Esta árvore é separada da documentação constitucional/arquitetural original em `docs/`. Ela existe para decompor e controlar o escopo total antes de fases, milestones, releases, sprints e tasks.

## Estrutura de planejamento

`Project Scope → WBS → Work/Planning Packages → WBS Dictionary → Dependency/Interface Graph → Scope Baseline → Milestones/Releases → Backlog → Tasks → Sprints`.

A execução de produto usa `project_docs/schedule/SPRINT_MODE.md` como contrato operacional.

## Níveis

- L1 — capítulo/módulo;
- L2 — pacote/capability;
- L3 — entregável verificável;
- L4+ — refinamento quando necessário;
- Work Package — unidade controlável de escopo;
- Task — unidade executável derivada de Work Package;
- Sprint — unidade operacional que agrupa TASKs comprometidas, uma branch e uma revisão integrada.

## Documentos mestres

- `SCOPE_BASELINE.md`
- `WBS_METHOD.md`
- `WBS_DICTIONARY.md`
- `WORK_PACKAGE_METHOD.md`
- `DEPENDENCY_MODEL.md`
- `DEPENDENCY_GRAPH.md`
- `INTERFACE_MAP.md`
- `PLANNING_PACKAGES.md`
- `PRE_SCHEDULE_GATE.md`
- `schedule/SPRINT_MODE.md`

## Regras

1. WBS define escopo, não cronograma.
2. Dependências são modeladas antes das sprints.
3. Predecessor obrigatório deve estar pronto, ou contrato explicitamente aceito quando a relação permitir, antes do sucessor.
4. Sprint não altera parentage da WBS.
5. IAs executoras não inferem arquitetura ausente.
6. `docs/`, ADRs, contracts e specs continuam autoridades superiores em caso de conflito.
7. O projeto evolui por fatias verticais integráveis, numa espiral incremental.
8. Cada Sprint usa por padrão uma única branch `sprint/<SPRINT-ID>` e um único PR final para `main`.
9. TASKs preservam contratos, validações e commits próprios mesmo quando compartilham a branch da Sprint.
10. A revisão humana normal ocorre no encerramento da Sprint; exceções de arquitetura, segurança ou escopo continuam fail-closed.

## Modelo operacional atual

`main → sprint/<SPRINT-ID> → TASKs em ordem de dependência → validação por TASK → full verify → Sprint Report → Sprint Review → PR único → main`.

OpenCode CLI é o executor local padrão. O runtime Supervisor/heartbeat/callback do AgentFactory está preservado, porém congelado e não bloqueia Sprints de produto enquanto não houver reativação explícita.

## Estado

O planejamento estrutural permanece válido. O foco operacional passa a ser execução por Sprint do roadmap de produto, iniciando pela Vertical Contract Spine M1. A infraestrutura AgentFactory deixa de ser caminho crítico do desenvolvimento do produto.

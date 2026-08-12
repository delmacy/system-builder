# System Builder — Project Docs / WBS Master

Esta árvore é separada da documentação constitucional/arquitetural original em `docs/`. Ela existe para decompor e controlar o escopo total antes de fases, milestones, releases, sprints e tasks.

## Estrutura de planejamento
`Project Scope → WBS → Work/Planning Packages → WBS Dictionary → Dependency/Interface Graph → Scope Baseline → Milestones/Releases → Backlog → Tasks → Sprints`.

## Níveis
- L1 — capítulo/módulo;
- L2 — pacote/capability;
- L3 — entregável verificável;
- L4+ — refinamento quando necessário;
- Work Package — unidade controlável de escopo;
- Task — unidade executável derivada de Work Package;
- Sprint — janela temporal que agenda tasks.

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

## Regras
1. WBS define escopo, não cronograma.
2. Dependências são modeladas antes das sprints.
3. Predecessor obrigatório deve estar pronto, ou contrato explicitamente aceito quando a relação permitir, antes do sucessor.
4. Sprint não altera parentage da WBS.
5. IAs executoras não inferem arquitetura ausente.
6. `docs/`, ADRs, contracts e specs continuam autoridades superiores em caso de conflito.
7. O projeto evolui por fatias verticais integráveis, numa espiral incremental.

## Estado
Os 59 capítulos possuem baseline WBS L1→L2→L3. A camada intermediária pré-cronograma agora está definida. Próximo refinamento: materializar Work Packages/Dictionaries dos ramos `NOW`, validar dependências e então derivar milestones/releases antes de qualquer sprint.

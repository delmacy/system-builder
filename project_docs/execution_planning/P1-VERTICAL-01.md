# P1-VERTICAL-01 — Catalog and Assembly

Status: READY TO COMMIT after package planning merges

## Sprint Goal

Create the first deterministic executable factory behavior after SystemDefinition: product test coverage, Software Catalog registration/resolution and AssemblyPlan generation.

## Branch

`sprint/P1-VERTICAL-01`

Create from synchronized `main` after this Sprint manifest and TASK specs are integrated.

## Committed TASK order

1. TASK-045 — Product test harness baseline.
2. TASK-046 — Software Catalog registry.
3. TASK-047 — provider-neutral deterministic Catalog resolution.
4. TASK-048 — minimal deterministic Assembly resolver.

Dependency chain:

`TASK-008 -> TASK-045 -> TASK-046 -> TASK-047 -> TASK-048`

## Required growing proof

A synthetic SystemDefinition requests capabilities. Catalog entries are registered without provider lock-in. Resolution returns deterministic eligible candidates. Assembly selects deterministically and emits an AssemblyPlan compatible with the existing public contract.

Required failure proofs:

- duplicate/identity conflict is rejected;
- unknown capability produces an explicit diagnostic;
- incompatible version/constraint produces an explicit diagnostic;
- repeated identical resolution produces equivalent output identity.

## Sprint exit gate

- every TASK acceptance criterion passes;
- one commit per TASK;
- product tests run in repository `npm test` / `npm run verify`;
- growing vertical test reaches SystemDefinition -> Catalog -> AssemblyPlan;
- final `npm run verify` passes in GitHub CI;
- Sprint Report is produced;
- one PR is ready for Sprint Review.

Do not begin P1-VERTICAL-02 before this Sprint is merged or explicitly reauthorized.

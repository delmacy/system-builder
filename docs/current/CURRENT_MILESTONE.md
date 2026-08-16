# Current Execution Milestone — M5 P4 Capability-Driven Runtime Sprint

## Goal

Execute `P4-CAPABILITY-RUNTIME-01` after P4-POSTGRES-STATE-01 merged and prove one durable generated Runtime action is selected/materialized from the actual SystemDefinition/Catalog/Assembly capability chain.

## Integrated baseline

P4-POSTGRES-STATE-01 is merged through PR #169 at `349231aa982048f2ce4507432032e3d32c160339`.

## Active Sprint

`P4-CAPABILITY-RUNTIME-01 — Capability-Driven Durable Runtime Slice`

Branch: `sprint/P4-CAPABILITY-RUNTIME-01`

Committed order:
1. TASK-079 — bounded AssemblyPlan capability materialization input;
2. TASK-080 — capability-driven Compiler/Runtime integration;
3. TASK-081 — full durable capability PostgreSQL E2E.

## Architecture constraints

- ADR-0002 and ADR-0007 remain controlling;
- no canonical contract expansion is authorized;
- PostgreSQL/provider details remain bounded implementation behavior;
- unsupported selected implementation fails explicitly;
- unrelated SystemDefinitions must not gain the state action surface;
- L4 discovery requires stop + ADR.

## Sprint gate

Complete TASK-079..081 with declared validations and final repository-wide CI, produce Sprint Report, open one PR and stop at Sprint Review. The package Integration & Technical Debt Review remains out of scope.

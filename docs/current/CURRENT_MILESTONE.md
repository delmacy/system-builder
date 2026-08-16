# Current Execution Milestone — M6 P5 Catalog Constraints Sprint

## Goal

Execute only `P5-CATALOG-CONSTRAINTS-01` after P5-PACKAGE-01 merged and harden Catalog dependency/version semantics without beginning transitive Assembly graph work.

## Integrated baseline

P5 package plan merged through PR #173 at `e1a1cfa00ae64180746c07a8b2e304f4d2990db9`.

P4 predecessor proof remains:

`SystemDefinition state.counter -> Catalog -> AssemblyPlan -> ValidationEvidence -> Compiler -> verified artifact -> Deploy -> PostgreSQL Runtime -> persisted state across redeploy`

## Active Sprint

`P5-CATALOG-CONSTRAINTS-01 — Structured Dependency and Version Constraints`

Branch: `sprint/P5-CATALOG-CONSTRAINTS-01`

Committed order:
1. TASK-082 — structured dependency requirement and normalization;
2. TASK-083 — bounded exact/minimum version-constraint resolution;
3. TASK-084 — deterministic evidence and predecessor Catalog->Assembly compatibility.

## Expected exit proof

`Catalog records -> structured dependency requirements -> deterministic constrained candidates / explicit unsatisfied diagnostic`

## Architecture constraints

- ADR-0002 and ADR-0007 remain controlling;
- bounded internal Catalog L3 API change is authorized;
- canonical contracts and L4 architecture are not authorized;
- transitive Assembly graph solving remains out of scope;
- durable providers remain deferred;
- P4 runtime/autonomy/secret guarantees remain predecessor regression gates.

## Sprint gate

Run TASK validations in dependency order, final `npm run verify`, produce Sprint Report, open one Sprint PR and stop at Sprint Review.

Do not materialize or execute `P5-ASSEMBLY-GRAPH-01`.

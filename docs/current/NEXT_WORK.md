# Next Work — Execute P5-MATERIALIZER-REGISTRY-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

`P5-MATERIALIZER-REGISTRY-01` is COMMITTED on `sprint/P5-MATERIALIZER-REGISTRY-01` but implementation has not started.

Dependency order:
1. TASK-088;
2. TASK-089 after TASK-088 validation;
3. TASK-090 after TASK-089 validation.

For every TASK, read its full `context_paths`, confirm allowed/forbidden paths, `max_files`, predecessor dependency and validation commands before editing.

## Sprint outcome

Prove:

`SystemDefinition capability -> Catalog constrained provider -> transitive AssemblyPlan BOM -> ValidationEvidence -> exact materializer registry lookup -> existing state.counter materialization -> deterministic migration/runtime assets -> ReleaseArtifact`

Preserve existing state.counter migration/runtime bytes and symbolic secret boundary where required by current tests/contracts, current unsupported-provider failure behavior, release reproducibility, and all P4 PostgreSQL/autonomous-runtime regressions.

Do not create a second production Runtime capability merely to demonstrate extensibility; use bounded deterministic test evidence if needed.

## Exit

After TASK-090, run final `npm run verify`, produce `P5-MATERIALIZER-REGISTRY-01.report.md`, open one PR from the Sprint branch to `main` and stop at Sprint Review.

## Successor boundary

The mandatory `P5-PACKAGE-01` Integration & Technical Debt Review remains FORECAST / MANDATORY. Do not materialize or execute it automatically after this Sprint. It requires a new explicit instruction after the Sprint merges and current `main` is reconstructed.

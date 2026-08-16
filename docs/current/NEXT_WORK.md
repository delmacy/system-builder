# Next Work — Execute P5-ASSEMBLY-GRAPH-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

`P5-ASSEMBLY-GRAPH-01` is COMMITTED on `sprint/P5-ASSEMBLY-GRAPH-01` but implementation has not started.

Dependency order:
1. TASK-085;
2. TASK-086 after TASK-085 validation;
3. TASK-087 after TASK-086 validation.

For every TASK, read its full `context_paths`, confirm allowed/forbidden paths, `max_files`, predecessor dependency and validation commands before editing.

## Sprint outcome

Prove:

`SystemDefinition root capability -> constrained Catalog candidate -> structured dependency requirements -> transitive dependency closure -> deterministic conflict/cycle validation -> deterministic AssemblyPlan BOM -> ValidationEvidence -> Compiler predecessor path`

Preserve current bounded Catalog exact/minimum semantics, existing root-only compatibility where applicable, and all P4 PostgreSQL/autonomous-runtime regressions.

## Exit

After TASK-087, run final `npm run verify`, produce `P5-ASSEMBLY-GRAPH-01.report.md`, open one PR from the Sprint branch to `main` and stop at Sprint Review.

## Successor boundary

`P5-MATERIALIZER-REGISTRY-01` remains FORECAST. Do not materialize or execute it without a new explicit instruction after this Sprint merges and current `main` is reconstructed.

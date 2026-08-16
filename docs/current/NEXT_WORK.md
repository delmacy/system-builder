# Next Work — Execute P5-CATALOG-CONSTRAINTS-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

Execute only `P5-CATALOG-CONSTRAINTS-01` on `sprint/P5-CATALOG-CONSTRAINTS-01`.

Dependency order:
1. TASK-082;
2. TASK-083 after TASK-082 validation;
3. TASK-084 after TASK-083 validation.

For every TASK, read its full `context_paths`, confirm allowed/forbidden paths, max_files, dependency and validation commands before editing.

## Sprint outcome

Prove:

`Catalog records -> structured dependency requirements -> deterministic constrained candidates / explicit unsatisfied diagnostic`

Preserve current exact Catalog resolution, current Catalog->Assembly integration and all repository-wide predecessor regressions.

## Exit

After TASK-084, run final `npm run verify`, produce `P5-CATALOG-CONSTRAINTS-01.report.md`, open one PR from the Sprint branch to `main` and stop at Sprint Review.

## Successor boundary

`P5-ASSEMBLY-GRAPH-01` remains FORECAST. Do not materialize or execute it without a new explicit instruction after this Sprint merges and current `main` is reconstructed.

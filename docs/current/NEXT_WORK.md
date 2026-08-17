# Next Work — Review P5-ASSEMBLY-GRAPH-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

Review Sprint PR #175 from `sprint/P5-ASSEMBLY-GRAPH-01` after closure-head Deterministic CI passes.

TASK evidence:
1. TASK-085 — commit `621b6c11f90ae17145ae29ebcd041b6e93453c59`, CI #260 PASS;
2. TASK-086 — commit `d38352eb4b20ae7d5a10a734a5152256247fbc4c`, CI #261 PASS;
3. TASK-087 — commit `cc1f1f99fab123a44b2a75f17967282042afb531`, CI #262 PASS.

Sprint Report:
`project_docs/execution_planning/P5-ASSEMBLY-GRAPH-01.report.md`

## Review checklist

- require final closure-head `npm run verify` PASS through Deterministic CI;
- confirm structured dependencies are resolved transitively through the actual Catalog resolver;
- confirm exact/minimum/compatibility requirements are combined deterministically across paths;
- confirm cycle, unresolved and incompatible requirements fail closed with reproducible diagnostics;
- confirm graph-derived AssemblyPlan continues through actual Validation/Compiler APIs;
- confirm P4 PostgreSQL autonomous-runtime regressions remain green;
- confirm no Catalog semantic change, materializer registry, durable provider or canonical/L4 change entered the Sprint;
- merge only after human Sprint Review accepts the PR.

## Successor boundary

Do not automatically materialize or execute `P5-MATERIALIZER-REGISTRY-01` after this Sprint. After PR #175 merges, require a new explicit instruction and reconstruct `main` from `AGENTS.md` before deciding whether that forecast Sprint should be promoted.

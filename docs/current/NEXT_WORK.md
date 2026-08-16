# Next Work — Review P5-CATALOG-CONSTRAINTS-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

Review Sprint PR #174 from `sprint/P5-CATALOG-CONSTRAINTS-01` after closure-head Deterministic CI passes.

TASK evidence:
1. TASK-082 — commit `210af0a4d8241d264a4291a0111d66b68ca0d438`, CI #253 PASS;
2. TASK-083 — commit `1ea98f091f28110080b971f00ea3a1b6de136402`, CI #254 PASS;
3. TASK-084 — commit `3e73f5e1a8306553e1074ef2f33eb1925b6d40b9`, CI #255 PASS.

Sprint Report:
`project_docs/execution_planning/P5-CATALOG-CONSTRAINTS-01.report.md`

## Review checklist

- require final closure-head `npm run verify` PASS through Deterministic CI;
- confirm structured dependency requirements and exact/minimum constraints remain Catalog-side bounded L3 behavior;
- confirm legacy exact resolution and real Catalog->Assembly predecessor compatibility remain green;
- confirm P4 PostgreSQL autonomous-runtime regressions remain green;
- confirm no Assembly graph solving, Compiler materializer registry, durable provider or canonical/L4 change entered the Sprint;
- merge only after human Sprint Review accepts the PR.

## Successor boundary

Do not automatically materialize or execute `P5-ASSEMBLY-GRAPH-01` after this Sprint. After PR #174 merges, require a new explicit instruction and reconstruct `main` from `AGENTS.md` before deciding whether that forecast Sprint should be promoted.

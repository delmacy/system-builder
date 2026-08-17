# Next Work — Review P5-MATERIALIZER-REGISTRY-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

Review Sprint PR #176 from `sprint/P5-MATERIALIZER-REGISTRY-01` after closure-head Deterministic CI passes.

TASK evidence:
1. TASK-088 — commit `22384590bcc0858a0fc63531dc2f00188d86d8e4`, CI #264 PASS;
2. TASK-089 — commit `1f818bfc10d57ff23f7d6fc03fcb49e650998b81`, CI #266 PASS;
3. TASK-090 — commit `0222ca0d1c89c865eb591b574ad7764bf878e09d`, CI #268 PASS.

Sprint Report:
`project_docs/execution_planning/P5-MATERIALIZER-REGISTRY-01.report.md`

## Review checklist

- require final closure-head `npm run verify` PASS through Deterministic CI;
- confirm exact capability/provider/version materializer registration and lookup are deterministic;
- confirm duplicate/no-match behavior is explicit and registration-order-independent;
- confirm `state.counter / system-builder.postgres-counter / 1.0.0` now resolves through the registry without generated-output drift;
- confirm actual constrained/transitive Catalog->Assembly->Validation path reaches the materializer registry before Compiler ReleaseArtifact output;
- confirm unsupported selected materializer identity fails explicitly;
- confirm P4 PostgreSQL autonomous-runtime/redeploy regressions remain green;
- confirm no Catalog/Assembly semantic, canonical contract, second production Runtime capability or L4 change entered the Sprint;
- merge only after human Sprint Review accepts the PR.

## Successor boundary

After PR #176 merges, reconstruct `main` from `AGENTS.md` before any package-level action.

The mandatory `P5-PACKAGE-01` Integration & Technical Debt Review remains FORECAST / MANDATORY. Do not materialize or execute it until a new explicit instruction is issued after this Sprint merges.

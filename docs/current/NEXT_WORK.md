# Next Work — Review P5-PACKAGE-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

Review the proposed rolling-wave `P5-PACKAGE-01 — Deterministic Factory Composition and Materializer Scaling` on `plan/P5-PACKAGE-01`.

## Direction selected

Factory composition hardening is selected ahead of durable provider infrastructure.

Forecast sequence:
1. `P5-CATALOG-CONSTRAINTS-01`;
2. `P5-ASSEMBLY-GRAPH-01`;
3. `P5-MATERIALIZER-REGISTRY-01`;
4. Integration & Technical Debt Review.

Candidate TASKs TASK-082..090 are forecast only; no TASK specifications are materialized.

## Review checklist

1. require Deterministic CI `npm run verify` PASS on the package-plan head;
2. confirm the plan maps to WBS 5.2.2/5.2.3, 6.1.2, 6.2.1-6.2.3, 6.3 and 8.1.2;
3. confirm ADR-0002/ADR-0007 and canonical public contracts are not changed;
4. confirm durable Catalog/Release/Artifact providers remain explicitly deferred, not forgotten;
5. confirm P4 PostgreSQL/autonomous-runtime proof remains a required predecessor regression;
6. merge the package plan only if the forecast is accepted.

## After package-plan merge

Do not automatically start P5 construction. Await a new explicit instruction, re-read `AGENTS.md` and current repository authority, then revalidate/materialize only `P5-CATALOG-CONSTRAINTS-01` if it remains the correct first committed Sprint.

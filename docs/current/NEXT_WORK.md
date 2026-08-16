# Next Work — Review P4-PACKAGE-01

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

Review the proposed rolling-wave `P4-PACKAGE-01 — Durable Stateful Runtime and Capability Materialization` on `plan/P4-PACKAGE-01`.

## Derivation

The package is derived from the merged P3 Integration & Technical Debt Review and current WBS/ADRs. It prioritizes durable Runtime state/database + migrations and a capability-driven generated action before production supervision/provider work.

Forecast construction sequence:

1. `P4-MIGRATION-STATE-01` — TASK-073..075 candidates;
2. `P4-POSTGRES-STATE-01` — TASK-076..078 candidates;
3. `P4-CAPABILITY-RUNTIME-01` — TASK-079..081 candidates;
4. Integration & Technical Debt Review.

## Review checklist

1. require Deterministic CI `npm run verify` PASS on the package-plan head;
2. verify the package remains rolling-wave forecast only and materializes no TASK specs;
3. verify WBS 8.1, 10.2 and 13.1 support the proposed sequence;
4. verify ADR-0002 and ADR-0007 remain unchanged;
5. verify durable Catalog/Release/Artifact providers, general dependency solving and production supervision remain explicitly deferred;
6. merge the package plan only if the forecast is accepted.

## After package-plan merge

Do not automatically execute P4. Await a new explicit instruction, then re-read `AGENTS.md` and merged repository authority before revalidating/materializing `P4-MIGRATION-STATE-01` and TASK-073..075.

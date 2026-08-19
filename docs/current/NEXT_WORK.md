# Next Work — P11 Sprint 2 (Operational Metadata) Materialized as COMMITTED

The repository is authoritative. Do not use chat history as technical authority.

## Just integrated

P11 Sprint 1 **merged**:
- `P11-OBSERVE-DEPLOYMENT-OBSERVATION-01` **MERGED** through PR #219 at `fd05da2` (Deterministic CI run `32273409636` PASS). `TD-P7-03` closed; `TD-P4-08` partially closed.
- `P11-PACKAGE-01` re-materialized with Construction Sprint 2 `P11-OBSERVE-OPERATIONAL-METADATA-01` as **COMMITTED** (TASK-137..148, status `ready`).

## Committed successor Sprint

`P11-OBSERVE-OPERATIONAL-METADATA-01` — Construction Sprint 2 of `P11-PACKAGE-01` (Observe/operations publication), **COMMITTED** (manifest + TASK-137..148 specs, status `ready`). Not yet constructed.

- Goal: complete the remainder of `TD-P4-08` — enrich the Observe publication with executor/source operational metadata correlated to release/environment/runtime context (WBS 10.3.1/11.1.2), provider-neutral, fail-open, deterministic, value-leak-free, without altering the canonical `DeploymentRecord` identity.
- TASK dependency order: TASK-137 (contract) -> TASK-138 (derivation) -> TASK-139 (validation) -> TASK-140 (serialization) -> TASK-141 (correlation) -> TASK-142 (enrichment) -> TASK-143 (fail-open) -> TASK-144 (no-leak) -> TASK-145 (positive tests) -> TASK-146 (negative tests) -> TASK-147 (integrated E2E) -> TASK-148 (growing proof/closure).
- Branch: `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` (declared declaratively; created only when the Sprint executes).

## Required action

Execute the committed Sprint `P11-OBSERVE-OPERATIONAL-METADATA-01` on its own branch (`sprint/P11-OBSERVE-OPERATIONAL-METADATA-01`), one authoritative commit per TASK in dependency order, running each TASK's declared validations and repository-wide `npm run verify` before closure. Operational metadata proof stays inside `packages/observe/**` and `tests/product/**` so the ADR-0002/0007/0009 scope boundary holds.

## Boundary

- Do not construct Observe product code inside this planning transition; Sprint execution happens later on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01`.
- Do not change the canonical `DeploymentRecord` schema/identity.
- Do not start Sprint 3 or the package review; they stay FORECAST until Sprint 2 merges.
- Do not modify `.github/**` / `tooling/**`.
- Do not merge anything.
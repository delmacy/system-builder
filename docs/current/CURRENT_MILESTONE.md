# Current Execution Milestone — M11 P11 Direction Selection & First Construction Sprint Materialized

## Goal

Start the Observe (SB-11) slice: publish the durable `DeploymentRecord` to Observe/operations (WBS 10.3.3) through a provider-neutral, fail-open `DeploymentObservation` contract, preserving Runtime autonomy (ADR-0002) and the no-value-leakage invariant (ADR-0007), closing `TD-P7-03` and partially `TD-P4-08`. Construction Sprint 1 `P11-OBSERVE-DEPLOYMENT-OBSERVATION-01` (TASK-134/135/136) is **materialized as COMMITTED**.

## Integrated predecessor

P10 package **complete and closed**: Sprint 1 `P10-PRODUCTION-SECRETRESOLVER-01` (PR #201, `4301936`), Sprint 2 `P10-TLS-SERVER-IDENTITY-01` (PR #214, `3fdfb95`), Integration & Technical Debt Review (PR #216, `72e6b09`). `TD-P4-05` and `TD-P8-02` are closed.

## Direction selection (from integrated evidence)

Selected: **B — Observe/operations publication** (WBS 10.3.3, `TD-P7-03` + partial `TD-P4-08`).

- The P9 and P10 reviews ranked this the strongest remaining candidate after the P10 closure of `TD-P4-05`/`TD-P8-02`.
- Observe (SB-11) is an accepted bounded context (ADR-0003) receiving optional telemetry (ADR-0002); the pipeline contract map already declares `Deploy -> ArtifactEnvelope<DeploymentRecord> -> Observe/operations`.
- C (milestone pivot, `TD-P9-01`/`TD-P9-02`) not assumed; requires explicit milestone re-scope.

## Materialized construction Sprint 1

`P11-OBSERVE-DEPLOYMENT-OBSERVATION-01` — COMMITTED (manifest + TASK-134/135/136 specs, status `ready`), not yet constructed.
- Goal: provider-neutral `DeploymentObservation` derived from the durable `DeploymentRecord`, fail-open publication to Observe/operations when configured, no value leakage, Runtime autonomy preserved.
- Committed TASKs: TASK-134 (observation contract), TASK-135 (fail-open publication), TASK-136 (publication E2E).
- Branch: `sprint/P11-OBSERVE-DEPLOYMENT-OBSERVATION-01` (declared; created only when the Sprint executes).

## Current gate

**Eligible successor Sprint materialized.** `P11-PACKAGE-01` direction B is selected; Construction Sprint 1 `P11-OBSERVE-DEPLOYMENT-OBSERVATION-01` is **COMMITTED** and eligible. It executes on `sprint/P11-OBSERVE-DEPLOYMENT-OBSERVATION-01` with TASK-134/135/136 in dependency order after the materialization PR merges and `main` is freshly reconstructed. Sprints 2/3 and the package review remain FORECAST until Sprint 1 merges.
# P11-OBSERVE-OPERATIONAL-METADATA-01 — Operational Metadata for Observe Publication

Status: COMMITTED / MATERIALIZED (manifest + TASK specs) / NOT_YET_CONSTRUCTED
Base: `fd05da2` (main após P11 Sprint 1 PR #219 merged)
Branch: `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01`
Package: `P11-PACKAGE-01`
Milestone: M11

## Sprint Goal

Complete the remainder of `TD-P4-08` by enriching the Observe publication with **executor/source operational metadata** correlated to release/environment/runtime context (WBS 10.3.1/10.3.3, 11.1.2): who/what initiated the deployment, through which source/mode, and how the observation links to the runtime that executed it. The enrichment stays provider-neutral, fail-open, deterministic and value-leak-free (ADR-0002/0007/0009), never alters the canonical `DeploymentRecord` identity, and extends the Sprint 1 `DeploymentObservation` contract additively.

## Predecessor gate

SATISFIED.

- `P11-OBSERVE-DEPLOYMENT-OBSERVATION-01` **merged** through PR #219 at `fd05da2` (Deterministic CI run `32273409636` PASS). `TD-P7-03` closed; `TD-P4-08` partially closed.
- No remaining blocker, unaccepted ADR, L3/L4, destructive-migration or security-weakening gate blocks this Sprint boundary. The Sprint 1 observation contract and fail-open publish exist in `packages/observe` and are the predecessor inputs.

## Committed TASK set (dependency order)

1. TASK-137 — `P11-OBSERVE-OPERATIONAL-METADATA-CONTRACT` (`ready`) — define the provider-neutral `DeploymentOperationMetadata` contract: executor identity, source/trigger, operation mode, correlation refs; deterministic, value-leak-free.
2. TASK-138 — `P11-OBSERVE-OPERATIONAL-DERIVATION` (`ready`) — derive operational metadata deterministically from the execution context and the durable `DeploymentRecord`; content-addressed deterministic identity.
3. TASK-139 — `P11-OBSERVE-OPERATIONAL-VALIDATION` (`ready`) — reject malformed, unknown or conflicting operational metadata deterministically (fail-closed), with positive and negative coverage.
4. TASK-140 — `P11-OBSERVE-OPERATIONAL-SERIALIZATION` (`ready`) — lossless JSON round-trip for operational metadata preserving identity and every field.
5. TASK-141 — `P11-OBSERVE-OPERATIONAL-CORRELATION` (`ready`) — correlate operational metadata with release/environment/runtime context (runtime/process/session refs) provider-neutrally, deterministically.
6. TASK-142 — `P11-OBSERVE-OPERATIONAL-ENRICHMENT` (`ready`) — enrich `DeploymentObservation` additively with the operational metadata block without changing the Sprint 1 observation identity when metadata is absent.
7. TASK-143 — `P11-OBSERVE-OPERATIONAL-FAILOPEN` (`ready`) — publication remains fail-open when operational metadata is unavailable or malformed: Deploy and Runtime are unchanged (ADR-0002).
8. TASK-144 — `P11-OBSERVE-OPERATIONAL-NOLEAK` (`ready`) — proof that executor/source/operation metadata never carries a resolved secret, credential or CA value (ADR-0007).
9. TASK-145 — `P11-OBSERVE-OPERATIONAL-POSITIVE-TEST` (`ready`) — product tests: positive derivation, correlation and enrichment of operational metadata.
10. TASK-146 — `P11-OBSERVE-OPERATIONAL-NEGATIVE-TEST` (`ready`) — product tests: negative validation, fail-open and no-value-leakage cases.
11. TASK-147 — `P11-OBSERVE-OPERATIONAL-INTEGRATED-E2E` (`ready`) — integrated E2E: durable DeploymentRecord -> enriched observation with operational metadata -> Observe receiver, with Runtime autonomy.
12. TASK-148 — `P11-OBSERVE-OPERATIONAL-GROWING-PROOF` (`ready`) — extend the growing package integration proof and the Sprint report with operational-metadata coverage; spec statuses to `verification`.

## Growing integration proof expected at exit

`durable DeploymentRecord -> provider-neutral DeploymentObservation -> operational metadata (executor/source/mode) correlated to release/environment/runtime context -> enriched observation -> Observe/operations receives it when configured -> Runtime continuity with Observe unavailable -> no resolved secret/CA value in any emitted observation`

## Final validation

Repository-wide `npm run verify` through GitHub Deterministic CI on the Sprint closure head. Operational metadata proof stays inside `packages/observe/**` and `tests/product/**`, so no `.github/**` / `tooling/**` change is required and the ADR-0002/0007/0009 boundary holds.

## Stop / escalation

- Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, canonical contracts, the Runtime behavior, or any L3/L4 boundary without escalation.
- Stop before adding an external npm dependency or changing `.github/**` / `tooling/**`.
- Do not start Sprint 3 or the package Integration & Technical Debt Review; they remain FORECAST until this Sprint merges and the package revalidation gate passes.

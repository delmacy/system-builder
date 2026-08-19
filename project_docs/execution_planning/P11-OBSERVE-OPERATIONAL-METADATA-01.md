# P11-OBSERVE-OPERATIONAL-METADATA-01 — Operational Metadata for Observe Publication

Status: COMMITTED / MATERIALIZED (manifest + TASK specs) / CONSTRUCTED / MERGED
Base: `fd05da2` (main após P11 Sprint 1 PR #219 merged)
Merged: PR #221 at `1830705` (Deterministic CI run `32280667636` PASS)
Branch: `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` (merged and deleted)
Package: `P11-PACKAGE-01`
Milestone: M11

## Sprint Goal

Complete the remainder of `TD-P4-08` by enriching the Observe publication with **executor/source operational metadata** correlated to release/environment/runtime context (WBS 10.3.1/10.3.3, 11.1.2): who/what initiated the deployment, through which source/mode, and how the observation links to the runtime that executed it. The enrichment stays provider-neutral, fail-open, deterministic and value-leak-free (ADR-0002/0007/0009), never alters the canonical `DeploymentRecord` identity, and extends the Sprint 1 `DeploymentObservation` contract additively.

## Predecessor gate

SATISFIED (Sprint 1 merged at `fd05da2`, PR #219). This Sprint merged through PR #221 at `1830705` (Deterministic CI run `32280667636` PASS). `TD-P7-03` closed (Sprint 1) and `TD-P4-08` closed (Sprint 2). Closure recorded in `P11-OBSERVE-OPERATIONAL-METADATA-01.report.md`.

## Committed TASK set (dependency order)

1. TASK-137 — `P11-OBSERVE-OPERATIONAL-METADATA-CONTRACT` (`verification`) — define the provider-neutral `DeploymentOperationMetadata` contract: executor identity, source/trigger, operation mode, correlation refs; deterministic, value-leak-free.
2. TASK-138 — `P11-OBSERVE-OPERATIONAL-DERIVATION` (`verification`) — derive operational metadata deterministically from the execution context and the durable `DeploymentRecord`; content-addressed deterministic identity.
3. TASK-139 — `P11-OBSERVE-OPERATIONAL-VALIDATION` (`verification`) — reject malformed, unknown or conflicting operational metadata deterministically (fail-closed), with positive and negative coverage.
4. TASK-140 — `P11-OBSERVE-OPERATIONAL-SERIALIZATION` (`verification`) — lossless JSON round-trip for operational metadata preserving identity and every field.
5. TASK-141 — `P11-OBSERVE-OPERATIONAL-CORRELATION` (`verification`) — correlate operational metadata with release/environment/runtime context (runtime/process/session refs) provider-neutrally, deterministically.
6. TASK-142 — `P11-OBSERVE-OPERATIONAL-ENRICHMENT` (`verification`) — enrich `DeploymentObservation` additively with the operational metadata block without changing the Sprint 1 observation identity when metadata is absent.
7. TASK-143 — `P11-OBSERVE-OPERATIONAL-FAILOPEN` (`verification`) — publication remains fail-open when operational metadata is unavailable or malformed: Deploy and Runtime are unchanged (ADR-0002).
8. TASK-144 — `P11-OBSERVE-OPERATIONAL-NOLEAK` (`verification`) — proof that executor/source/operation metadata never carries a resolved secret, credential or CA value (ADR-0007).
9. TASK-145 — `P11-OBSERVE-OPERATIONAL-POSITIVE-TEST` (`verification`) — product tests: positive derivation, correlation and enrichment of operational metadata.
10. TASK-146 — `P11-OBSERVE-OPERATIONAL-NEGATIVE-TEST` (`verification`) — product tests: negative validation, fail-open and no-value-leakage cases.
11. TASK-147 — `P11-OBSERVE-OPERATIONAL-INTEGRATED-E2E` (`verification`) — integrated E2E: durable DeploymentRecord -> enriched observation with operational metadata -> Observe receiver, with Runtime autonomy.
12. TASK-148 — `P11-OBSERVE-OPERATIONAL-GROWING-PROOF` (`verification`) — extend the growing package integration proof and the Sprint report with operational-metadata coverage; spec statuses to `verification`.

## Growing integration proof expected at exit

`durable DeploymentRecord -> provider-neutral DeploymentObservation -> operational metadata (executor/source/mode) correlated to release/environment/runtime context -> enriched observation -> Observe/operations receives it when configured -> Runtime continuity with Observe unavailable -> no resolved secret/CA value in any emitted observation`

## Final validation

Repository-wide `npm run verify` through GitHub Deterministic CI on the Sprint closure head. Operational metadata proof stays inside `packages/observe/**` and `tests/product/**`, so no `.github/**` / `tooling/**` change is required and the ADR-0002/0007/0009 boundary holds.

## Stop / escalation

- Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, canonical contracts, the Runtime behavior, or any L3/L4 boundary without escalation.
- Stop before adding an external npm dependency or changing `.github/**` / `tooling/**`.
- Do not start Sprint 3 or the package Integration & Technical Debt Review; they remain FORECAST until this Sprint merges and the package revalidation gate passes.

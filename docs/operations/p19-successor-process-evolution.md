# P19 successor process evolution — operator proof

Construction 8 supports one bounded same-host evolution path:

`retained A process revision -> approved B process revision -> factory/Compiler regeneration -> immutable B Release -> Deploy activation -> healthy Builder-off Runtime -> exact retained A restore`.

The process revision, SystemDefinition, Release/artifact and Deployment identities remain reconstructible from their canonical refs/hashes. B must originate from canonical `human-decision` approval and the existing process-version/process-to-system lineage; Git, PR, model output or deterministic classification evidence is never promotion authority.

## Operational invariants

EnvironmentProfile and secret values remain external deployment inputs and are not copied into lineage/history evidence. Ordinary generated Runtime startup and health must remain viable with Builder unavailable. Optional Observe publication is non-authoritative and fail-open: inability to reach Observe cannot become an activation or runtime-health dependency.

Release artifacts are immutable. Upgrading to B publishes `0.0.2` once and restoring A reuses retained `0.0.1`; restore must not compile A again or synthesize `0.0.3`. Stale active-predecessor, artifact/payload mismatch, incompatible runtime/environment, failed startup/health, or stale/substituted rollback targets fail before replacing last-known-good.

Repeated publication uses artifact-store idempotency but duplicate Release identity is rejected. Repeated update/restore requests are evaluated against exact active predecessor state and cannot silently drift canonical history.

## Evidence

`tests/product/p19-successor-evolution-growing.test.ts` is the cumulative WBS 19.3.2 proof. Focused TASK-457..461 tests remain boundary-level regression evidence and are not replaced by this growing proof.

This document does not authorize WBS 19.3.3, fleet/remote orchestration, a control plane, a secret backend, a new approval/lifecycle owner, a public contract, a new identity scheme or a Decision Boundary change.

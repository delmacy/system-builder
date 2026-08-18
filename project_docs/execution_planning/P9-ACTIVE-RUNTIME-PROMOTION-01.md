# P9-ACTIVE-RUNTIME-PROMOTION-01 — Active Runtime Promotion

Status: COMMITTED / PRE_CODE
Base SHA: `cea8f09ccb99b2bf5bed27e9f01782db1520bb67`
Branch: `sprint/P9-ACTIVE-RUNTIME-PROMOTION-01`
Package: `P9-PACKAGE-01`
Milestone: M10

## Sprint Goal

Bind the Deploy-owned single-host managed Runtime lifecycle to the existing P8 atomic deployment authority so an accepted candidate becomes the managed active process only after authoritative activation succeeds, while the prior active Runtime is retained until that decision is known.

## Predecessor gate

`P9-MANAGED-RUNTIME-PROCESS-01` is merged in `main` through PR #194 at `cea8f09ccb99b2bf5bed27e9f01782db1520bb67`; final CI #356 PASS.

## Committed TASKs

1. `TASK-122 — ATOMIC-ACTIVE-RUNTIME-PROMOTION`
2. `TASK-123 — ACTIVE-RUNTIME-RETENTION-SAFETY`
3. `TASK-124 — DURABLE-ACTIVE-RUNTIME-PROMOTION-EVIDENCE`

Dependency order: `TASK-122 -> TASK-123 -> TASK-124`.

## Growing proof target

`managed A -> atomic authority activates A -> start/accept B while A remains UP -> atomic authority promotes B from expected A -> B becomes managed active -> A retires -> stale successful C cannot replace/terminate B -> failed contender cannot replace/terminate B -> durable authority remains B`

## Architecture boundary

- Deploy-owned single-host reference orchestration only.
- Existing P8 `DeploymentRegistry.activateCandidateAtomically` is deployment truth.
- Existing P9 `startManagedLocalRuntime` is the process provider.
- No external load balancer, DNS/reverse proxy, Kubernetes/container scheduler, fleet/cloud topology or canonical infrastructure contract.
- No Builder/Runtime topology change and no ADR/L4.

## Final validation

`npm run verify` via GitHub Deterministic CI.

## Stop / escalation

Stop if implementation requires canonical contracts, edits outside committed TASK scopes, external traffic/fleet topology, destructive migration, or Builder/Runtime L4 changes.

Do not materialize or execute `P9-RUNTIME-RECONCILIATION-E2E-01` or the P9 Integration & Technical Debt Review in this Sprint.

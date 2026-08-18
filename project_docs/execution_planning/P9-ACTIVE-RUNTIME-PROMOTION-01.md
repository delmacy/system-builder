# P9-ACTIVE-RUNTIME-PROMOTION-01 — Active Runtime Promotion

Status: IMPLEMENTED / TASK_CI_PASS / FINAL_CI_PENDING
Base SHA: `cea8f09ccb99b2bf5bed27e9f01782db1520bb67`
Branch: `sprint/P9-ACTIVE-RUNTIME-PROMOTION-01`
Package: `P9-PACKAGE-01`
Milestone: M10

## Sprint Goal

Bind the Deploy-owned single-host managed Runtime lifecycle to the existing P8 atomic deployment authority so an accepted candidate becomes the managed active process only after authoritative activation succeeds, while the prior active Runtime is retained until that decision is known.

Result: PASS pending final closure-head Deterministic CI.

## Predecessor gate

`P9-MANAGED-RUNTIME-PROCESS-01` merged through PR #194 at `cea8f09ccb99b2bf5bed27e9f01782db1520bb67`; final CI #356 PASS.

## Committed TASKs

1. TASK-122 `ATOMIC-ACTIVE-RUNTIME-PROMOTION` — `14e4464e7defd82999b1fd225a99b22b2ff42dff`, CI #359 PASS.
2. TASK-123 `ACTIVE-RUNTIME-RETENTION-SAFETY` — `afe59225ae58ee07160d8f73b4ee928d1bdf99fd`, CI #360 PASS.
3. TASK-124 `DURABLE-ACTIVE-RUNTIME-PROMOTION-EVIDENCE` — `a2c2b4210320ea4ea945e21c8592fcfe4fca97ee`, CI #361 PASS.

Dependency order: `TASK-122 -> TASK-123 -> TASK-124`.

## Achieved growing proof

`managed A -> atomic authority activates A -> start/accept B while A remains UP -> atomic authority promotes B from expected A -> B becomes managed active -> A retires -> stale successful C cannot replace/terminate B -> failed contender cannot alter authority/terminate B -> fresh authenticated authority reconstruction reports B while B remains UP`

## Architecture boundary

- Deploy-owned single-host reference orchestration only.
- Existing P8 `DeploymentRegistry.activateCandidateAtomically` remains deployment truth.
- Existing P9 `startManagedLocalRuntime` remains process provider.
- Additive `packages/deploy/active-runtime.ts`; no predecessor API edits.
- No external load balancer, DNS/reverse proxy, Kubernetes/container scheduler, fleet/cloud topology or canonical infrastructure contract.
- No Builder/Runtime topology change, canonical contract change or ADR/L4.

## Validation

- pre-code CI #357 PASS;
- first TASK-122 attempt CI #358 failed only ESLint `prefer-const` in its allowed test file and was rewritten out before successor work;
- authoritative TASK-122 CI #359 PASS;
- TASK-123 CI #360 PASS;
- TASK-124 CI #361 PASS;
- final validation: `npm run verify` via GitHub Deterministic CI on closure head.

## Stop / escalation

Stop at human Sprint Review after final CI and PR integrity checks.

Do not materialize or execute `P9-RUNTIME-RECONCILIATION-E2E-01` or the P9 Integration & Technical Debt Review in this Sprint.

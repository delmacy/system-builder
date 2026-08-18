# P9-ACTIVE-RUNTIME-PROMOTION-01 — Sprint Report

Date: 2026-08-17
Status: PASS / HUMAN SPRINT REVIEW PENDING

## Result

Sprint Goal: PASS.

The Deploy-owned single-host orchestrator now binds the managed Runtime process lifecycle to existing P8 atomic Deployment authority. A candidate is started and health-accepted before authority promotion, the prior active Runtime remains alive until the atomic decision is known, successful B promotion retires A only after activation, and stale/failed contenders preserve B.

## Authoritative TASK commits

- TASK-122 `14e4464e7defd82999b1fd225a99b22b2ff42dff` — CI #359 PASS.
- TASK-123 `afe59225ae58ee07160d8f73b4ee928d1bdf99fd` — CI #360 PASS.
- TASK-124 `a2c2b4210320ea4ea945e21c8592fcfe4fca97ee` — CI #361 PASS.

Each TASK has one authoritative commit in dependency order.

## Materialization / correction note

Pre-code materialization commit `2a26b27153505eae631846840b477820e31e5bd6` passed CI #357 before product edits.

The first TASK-122 attempt failed CI #358 only on ESLint `prefer-const` inside its allowed test file. It was replaced before TASK-123 began; the branch history retains only the corrected authoritative TASK-122 commit above.

## Integrated proof

`managed A -> authority activates A -> start/accept B while A remains health-queryable -> atomic authority promotes B -> B becomes managed active -> A cleans/stops -> stale successful C is stopped/cleaned and cannot replace B -> failed contender never reaches activation -> fresh authenticated PostgreSQL authority reconstructs B -> B live health remains UP`

Failure/safety evidence also proves:
- local managed-process/durable-authority divergence fails closed before candidate start;
- stale caller expectation reaches the existing CAS and returns `stale-active` rather than being mistaken for a local process mismatch;
- candidate startup/compatibility failure does not create a DeploymentRecord or invoke atomic promotion;
- rejected candidates are deterministically stopped/cleaned;
- serialized evidence excludes PostgreSQL credentials/secrets;
- Runtime remains operational with Builder/Observe unavailable.

## Architecture / scope

PASS.

- Additive L2 Deploy-local behavior in `packages/deploy/active-runtime.ts` only.
- Existing `packages/deploy/index.ts`, `managed-process.ts`, `local-process.ts` and `postgres-state.ts` unchanged.
- No canonical contracts.
- No Runtime implementation/topology changes.
- No ADR/L4 decision.
- No external load balancer, DNS/reverse proxy, Kubernetes/scheduler, fleet or cloud topology.
- No package/dependency/workflow/tooling changes.

## Residual debt / successor inputs

- active process ownership is still in-memory inside one orchestrator instance;
- a fresh orchestrator cannot yet discover/reconstruct the live authoritative process from durable state;
- process-manager restart reconciliation remains the explicit Sprint 3 target;
- external traffic/fleet/infrastructure rollback remains outside P9's bounded reference topology;
- P8 TLS/SecretResolver/provider debts remain open;
- no production-readiness claim is made.

These are successor inputs only. `P9-RUNTIME-RECONCILIATION-E2E-01` remains forecast until this Sprint is accepted, merged and `main` is freshly reconstructed.

## Verification

- pre-code CI #357: PASS;
- corrected TASK-122 CI #359: PASS;
- TASK-123 CI #360: PASS;
- TASK-124 CI #361: PASS;
- final closure-head Deterministic CI: required PASS before human Sprint Review readiness.

No local execution is claimed. GitHub Actions is the objective validation evidence.

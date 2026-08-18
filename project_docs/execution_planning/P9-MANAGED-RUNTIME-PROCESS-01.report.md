# P9-MANAGED-RUNTIME-PROCESS-01 — Sprint Report

Date: 2026-08-17
Status: PASS / HUMAN SPRINT REVIEW PENDING

## Result

Sprint Goal: PASS.

A new additive Deploy-owned managed local Runtime lifecycle now retains an accepted generated Runtime after health success, exposes a secret-free lifecycle handle, supports explicit/idempotent stop and deterministic materialization cleanup, and preserves the predecessor one-shot Deploy behavior.

## Authoritative TASK commits

- TASK-119 `521002b28fab412cd03fa385def1075d17d35438` — CI #353 PASS.
- TASK-120 `718714f9b63efa2a6ac33f0b1c022f1d38c2fa8c` — CI #354 PASS.
- TASK-121 `42bd42e16417baa7554c8c82aed35ff17f92ef90` — CI #355 PASS.

Each TASK has one authoritative commit in dependency order.

## Materialization note

Initial pre-code CI #350 failed only because the three newly materialized TASK specs lacked repository-mandatory standardized sections. No product edit had started. Governance-only commit `febdf9f4136a8704a972a8895e5a0f2e0c0404ea` corrected the specs and CI #351 passed before TASK-119 began.

A first TASK-119 implementation commit was replaced before successor work after a bounded lifecycle-handle bug was identified. The branch history retains only the corrected authoritative TASK-119 commit above.

## Integrated proof

`verified real artifact + Environment -> managed Runtime start -> health UP -> retained/queryable process -> one-shot predecessor independently executes and cleans -> managed Runtime remains UP -> explicit/idempotent managed stop -> directory removed + endpoint unreachable`

Failure/safety evidence also proves:
- incompatible runtime compatibility fails before process creation;
- invalid startup does not yield a managed handle;
- resolved secret material is redacted from startup diagnostics/evidence;
- unexpected process exit is surfaced as `failed`, not false `running`;
- Runtime proof remains independent of Builder/Observe availability.

## Architecture / scope

PASS.

- Additive L2 Deploy-local behavior only.
- `packages/deploy/local-process.ts` unchanged.
- no canonical contracts;
- no Runtime implementation changes;
- no new ADR/L4 decision;
- no external traffic/fleet/cloud topology;
- no package/dependency/workflow/tooling changes.

## Residual debt / successor inputs

- lifecycle ownership is process-local and is not reconstructed after orchestrator restart;
- managed process is not yet coordinated with durable active Deployment authority;
- no active-process promotion/last-known-good process retention policy yet;
- no production traffic switching, fleet supervision or infrastructure rollback claim;
- P8 production TLS/SecretResolver/provider debts remain open.

These are successor inputs only; Sprint 2/3 remain forecast until this Sprint merges and `main` is freshly reconstructed.

## Verification

- corrected materialization CI #351: PASS;
- TASK-119 CI #353: PASS;
- TASK-120 CI #354: PASS;
- TASK-121 CI #355: PASS;
- final closure-head Deterministic CI #356: required PASS before human Sprint Review readiness.

No local execution is claimed. GitHub Actions is the objective CI evidence.

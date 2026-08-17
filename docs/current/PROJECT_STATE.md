# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- P1–P7 construction/review history is integrated.
- P8 package planning merged through PR #188.
- `P8-DEPLOY-POSTGRES-TRANSPORT-01` merged through PR #189 at `209e192ec56599a05f6972e347f5b70989165c54`, final CI #333 PASS.
- `P8-ATOMIC-DEPLOYMENT-AUTHORITY-01` merged through PR #190 at `98a8e674d72e1ad00d5eb5850ae4e71ac3f6a56c`, pre-merge final CI #340 PASS.
- `P8-HARDENED-ACTIVATION-E2E-01` is implemented on Sprint branch through TASK-118; TASK CIs pass and closure-head final CI is pending.
- GitHub Actions with PostgreSQL 17.6 remains the objective deterministic integration gate.

## Integrated main baseline

`authenticated Deploy transport + atomic expected-active authority + durable reconstruction + predecessor autonomous Runtime proof`

The joined hardened package E2E below remains branch-only until human Sprint Review acceptance and merge.

## Active Sprint

`P8-HARDENED-ACTIVATION-E2E-01 — Hardened Activation End-to-End Proof`

Base: `98a8e674d72e1ad00d5eb5850ae4e71ac3f6a56c`
Branch: `sprint/P8-HARDENED-ACTIVATION-E2E-01`
PR: #191
Status: `IMPLEMENTED_ON_SPRINT_BRANCH / TASK_CI_PASS / FINAL_CI_PENDING`.

TASK evidence:
- TASK-116 `d7b4f90a27444901b109a6c6a1f63f817940cae5` — CI #342 PASS;
- TASK-117 `78cce0a39c9f8a3a9bda9174cdfdc24d3e223217` — CI #344 PASS;
- TASK-118 `eb4575a9c61d5105626ff9354f630d7b5defe7ae` — CI #345 PASS.

Materialization `7f602976fdfccdcbdc22806c54e2cce8826ff760` passed CI #341 before implementation.

## Sprint proof on branch

`durable Factory output -> reconstructed Release/Artifact -> authenticated atomic Deploy A -> autonomous Runtime -> B promotion -> stale C cannot replace B -> failed D retains B -> fresh authenticated reconstruction -> B authoritative + A/B/C/D history durable -> Runtime continuity`

## Architecture boundary

- evidence-only Sprint;
- no `packages/**`, canonical contract, ADR, workflow, app, tooling or dependency changes;
- ADR-0002 Builder/Runtime autonomy preserved;
- ADR-0007 Release/Environment/Deployment separation preserved;
- PostgreSQL remains Deploy-owned and replaceable;
- no production traffic/process rollback or full production-readiness claim.

## Residual debt

Coarse table-level serialization, positive TLS verification, pooling/retry/cancellation/observability, duplicated raw PostgreSQL transports, production deployment orchestration, production SecretResolver and Observe publication remain open/non-goals.

## Current gate

Run final Deterministic CI on the Sprint closure head. If green, verify PR #191 scope/review gates, mark it Ready for human Sprint Review and stop.

Do not merge PR #191 automatically. Do not materialize or execute the P8 Integration & Technical Debt Review until this Sprint passes human review, merges, and `main` is freshly reconstructed.

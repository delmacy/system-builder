# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- P1–P7 construction/review history is integrated.
- P8 package planning merged through PR #188 at `91f5cb23145c901c508e9673ef8cd38b52bbb413`.
- `P8-DEPLOY-POSTGRES-TRANSPORT-01` merged through PR #189 at `209e192ec56599a05f6972e347f5b70989165c54` after final CI #333 PASS.
- `P8-ATOMIC-DEPLOYMENT-AUTHORITY-01` passed Sprint Review and merged through PR #190 at `98a8e674d72e1ad00d5eb5850ae4e71ac3f6a56c`; pre-merge final CI #340 PASS.
- `P8-HARDENED-ACTIVATION-E2E-01` is now the active materialized third construction Sprint.
- GitHub Actions with PostgreSQL 17.6 remains the objective deterministic integration gate.
- AgentFactory Supervisor/runtime remains frozen non-blocking infrastructure.

## Integrated main baseline

`durable Factory substrate -> authenticated PostgreSQL Deploy transport -> atomic expected-active authority -> stale writer cannot overwrite winner -> provider reconstruction -> autonomous Runtime predecessor proofs`

## Active Sprint

`P8-HARDENED-ACTIVATION-E2E-01 — Hardened Activation End-to-End Proof`

Base: `98a8e674d72e1ad00d5eb5850ae4e71ac3f6a56c`
Branch: `sprint/P8-HARDENED-ACTIVATION-E2E-01`
Status: `MATERIALIZED / PRE-CODE CI PENDING`.

Committed TASKs:
1. TASK-116 — durable Factory -> authenticated atomic A -> autonomous Runtime;
2. TASK-117 — successful B promotion -> stale contender rejection -> Runtime continuity;
3. TASK-118 — failed contender retention -> fresh reconstruction -> final Runtime continuity.

## Target Sprint proof

`durable Factory output -> reconstructed Release/Artifact -> authenticated atomic Deploy A -> autonomous Runtime -> promote B -> stale contender cannot replace B -> failed contender retains B -> fresh Deploy reconstruction -> B remains authoritative + attempted history durable + Runtime continuity`

## Architecture boundary

- Sprint is evidence-only;
- `packages/**`, canonical contracts, ADRs and workflows are forbidden TASK output;
- ADR-0002 and ADR-0007 remain preserved;
- no L4 change or new ADR is authorized;
- PostgreSQL remains a Deploy-owned replaceable reference provider;
- Builder/Observe must remain unnecessary for ordinary Runtime execution.

## Residual debt / non-goals

Coarse table-level PostgreSQL serialization, positive TLS certificate policy, pooling/retry/richer cancellation/provider observability, cross-context PostgreSQL duplication, production deployment orchestration, production SecretResolver and Observe publication remain outside this Sprint. No full production-readiness claim is authorized.

## Current gate

Run Deterministic CI on the pre-code Sprint materialization. Product/test implementation may begin only after that gate passes.

Do not materialize or execute the P8 Integration & Technical Debt Review before this third construction Sprint passes human Sprint Review and merges.

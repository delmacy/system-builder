# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- P1–P7 construction/review history is integrated.
- P7 Integration & Technical Debt Review merged through PR #187 at `aa79f1fbeefb1f49faddf24db35a9ea35f74df29` after final Deterministic CI #327 PASS.
- P7 result: package PASS; architecture/boundaries PASS WITH DEBT; no critical rollback blocker.
- Successor planning is now active on `plan/P8-PACKAGE-01`.
- No P8 construction Sprint or successor TASK is materialized.
- GitHub Actions with PostgreSQL 17.6 remains the objective deterministic integration gate.
- AgentFactory Supervisor/runtime remains frozen non-blocking infrastructure.

## Integrated proof baseline

`durable Factory output -> durable Deploy activation A -> autonomous Runtime -> successful B activation -> failed candidate C -> reconstruct deployment authority -> B remains active + Runtime continuity`

## Successor selection

Fresh post-P7 reconstruction selects **durable deployment authority hardening** as the next highest-leverage Sprint Package direction.

Reason: the P7 review ranks production durability/activation hardening first and carries directly connected high-priority debt in PostgreSQL transport/auth (`TD-P4-03`), durable-provider transport/concurrency (`TD-P6-01`) and non-transactional active-pointer semantics (`TD-P7-01`). Broader production orchestration, Observe publication and generated Runtime breadth remain valid later directions but should not outrun the durable authority foundation.

## Active planning

`P8-PACKAGE-01 — Durable Deployment Authority Hardening`

Base: `aa79f1fbeefb1f49faddf24db35a9ea35f74df29`
Branch: `plan/P8-PACKAGE-01`
Status: `PLANNING / CI_PENDING`.

Forecast:
1. `P8-DEPLOY-POSTGRES-TRANSPORT-01` — commitment candidate after planning merge;
2. `P8-ATOMIC-DEPLOYMENT-AUTHORITY-01` — forecast only;
3. `P8-HARDENED-ACTIVATION-E2E-01` — forecast only;
4. mandatory P8 Integration & Technical Debt Review — forecast only.

## Architecture boundary

ADR-0002 and ADR-0007 remain controlling. PostgreSQL remains a replaceable reference-provider detail. This planning PR does not authorize a shared cross-context PostgreSQL infrastructure boundary; any such ownership decision must be separately justified and escalated if architectural.

## Current gate

Run repository-wide Deterministic CI on the planning head. If green, verify the PR remains planning/documentation-only and stop at human planning review.

Do not materialize Sprint 1, create TASK specs or modify product code before the package plan is accepted and merged and `main` is freshly reconstructed.

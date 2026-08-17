# Current Execution Milestone — M9 P8 Package Planning

## Goal

Select and validate the next rolling-wave Sprint Package from the actual integrated post-P7 repository state without starting construction work.

## Integrated baseline

P7 Integration & Technical Debt Review merged through PR #187 at `aa79f1fbeefb1f49faddf24db35a9ea35f74df29` after final Deterministic CI #327 PASS.

P7 disposition:
- package construction: PASS;
- architecture/boundaries: PASS WITH DEBT;
- critical rollback blocker: NONE FOUND;
- production readiness: NOT CLAIMED.

## Selected successor package

`P8-PACKAGE-01 — Durable Deployment Authority Hardening`

Branch: `plan/P8-PACKAGE-01`
Status: `PLANNING / CI_PENDING`.

Selection is based on the P7 review's highest-leverage readiness recommendation and current WBS gaps: harden Deploy PostgreSQL transport/auth and transactional multi-writer active authority before broader production orchestration, Observe publication or Runtime breadth.

## Rolling-wave forecast

1. `P8-DEPLOY-POSTGRES-TRANSPORT-01` — commitment candidate only after this planning PR merges and `main` is reconstructed;
2. `P8-ATOMIC-DEPLOYMENT-AUTHORITY-01` — FORECAST / NOT_MATERIALIZED;
3. `P8-HARDENED-ACTIVATION-E2E-01` — FORECAST / NOT_MATERIALIZED;
4. P8 Integration & Technical Debt Review — FORECAST / MANDATORY / NOT_MATERIALIZED.

## Architecture constraints

- ADR-0002 Runtime autonomy preserved;
- ADR-0007 Release/Environment/Deployment separation preserved;
- PostgreSQL remains replaceable provider detail;
- no shared cross-context PostgreSQL ownership decision is made by this plan;
- no canonical contract or L4 change is authorized;
- no production readiness claim is made by planning.

## Current gate

Run GitHub Deterministic CI on the planning head. If PASS, verify planning-only scope, mark/open the package PR for human planning review and stop.

Do not materialize or execute Sprint 1 in this planning stage.

# Sprint Report — P8-HARDENED-ACTIVATION-E2E-01

Date: 2026-08-17
Status: IMPLEMENTED ON SPRINT BRANCH / TASK CIS PASS / FINAL CI PENDING
Package: P8-PACKAGE-01 — Durable Deployment Authority Hardening
Base main: `98a8e674d72e1ad00d5eb5850ae4e71ac3f6a56c`
Branch: `sprint/P8-HARDENED-ACTIVATION-E2E-01`
PR: #191

## Result

PASS at TASK level. The Sprint proves the package-level hardened activation path using only existing executable product/provider APIs. No `packages/**`, canonical contract, ADR, workflow, app, tooling or dependency file was modified.

## Achieved growing proof

`durable Factory output -> reconstructed Release/Artifact -> authenticated PostgreSQL Deploy -> atomic activate A -> autonomous Runtime with Builder/Observe unavailable -> atomic promote B from expected A -> successful stale contender C from expected A is rejected without replacing B -> failed contender D retains B -> fresh authenticated Deploy reconstruction -> B remains authoritative + A/B/C/D attempted history durable -> B Runtime executes again with Builder/Observe unavailable`

## TASK execution

1. TASK-116 — `d7b4f90a27444901b109a6c6a1f63f817940cae5` — Deterministic CI #342 PASS.
   - actual Catalog/Assembly/Validation/Compiler path creates Factory output;
   - Release and Artifact persist/reconstruct through existing PostgreSQL providers;
   - authenticated Deploy atomically activates A from `expectedActive = null`;
   - fresh Deploy provider reconstructs A;
   - Runtime health is UP while Builder/Observe URLs are deliberately unavailable;
   - serialized evidence excludes database URLs and authenticated Deploy credentials.

2. TASK-117 — authoritative `78cce0a39c9f8a3a9bda9174cdfdc24d3e223217` — Deterministic CI #344 PASS.
   - B atomically promotes from expected A;
   - successful C submitted with stale expected A returns `stale-active`;
   - C remains durable attempted history but cannot replace B;
   - fresh reconstruction observes B and Runtime continuity remains UP.
   - An earlier orphaned attempt `527d9b5e36e0a5786c7fbd254a0c2ec962032bff` produced CI #343 typecheck-only failure; it was replaced from the TASK-116 parent, so exactly one authoritative TASK-117 commit remains in branch history.

3. TASK-118 — `eb4575a9c61d5105626ff9354f630d7b5defe7ae` — Deterministic CI #345 PASS.
   - failed D is materialized by existing acceptance semantics;
   - atomic decision is `retained-active` with B as previous/resulting authority;
   - a fresh authenticated Deploy provider reconstructs B plus complete A/B/C/D history;
   - B executes again after reconstruction with Builder/Observe unavailable;
   - serialized proof contains no PostgreSQL URL/user/password/resolved secret.

Materialization: `7f602976fdfccdcbdc22806c54e2cce8826ff760` — Deterministic CI #341 PASS before implementation.

## Scope and architecture

- evidence-only Sprint;
- TASK dependency order `TASK-116 -> TASK-117 -> TASK-118` preserved;
- each TASK stayed within its two declared allowed paths and `max_files: 2`;
- no `packages/**` output;
- no canonical contract change;
- no ADR/L4 change;
- ADR-0002 autonomy boundary preserved;
- ADR-0007 Release/Environment/Deployment separation preserved;
- PostgreSQL remains a replaceable Deploy-owned reference provider;
- no Builder dependency was introduced into ordinary Runtime execution.

## WBS disposition from this Sprint

- WBS 10.2.3: hardened bounded acceptance/retention behavior integration-proven; production traffic/process rollback remains outside scope.
- WBS 10.3.1: deployment identity/timestamps/release/environment evidence remains exercised; executor/source operational metadata remains package debt.
- WBS 10.3.2: hardened authenticated atomic active-version authority and reconstruction integration-proven.
- WBS 13.3.3: bounded safe upgrade, stale rejection and failed-candidate last-known-good retention integration-proven with autonomous Runtime continuity.
- WBS 10.3.3: unchanged/open; Observe/operations publication not implemented.

## Residual bounded debt / non-goals

- coarse table-level PostgreSQL serialization; finer per-environment locking/CAS throughput remains future provider work;
- positive TLS certificate verification policy remains open;
- pooling, retry, richer cancellation and provider observability remain open;
- duplicated raw PostgreSQL transport across bounded contexts remains open debt;
- production traffic/process rollback, fleet coordination and production supervisor remain open;
- production SecretResolver remains open;
- Observe/operations DeploymentRecord publication remains open;
- no full production-readiness claim.

## Final gate

Create Sprint closure state, run repository-wide Deterministic CI on the closure head, verify the complete diff/review gates, promote PR #191 to human Sprint Review and stop. The P8 Integration & Technical Debt Review is mandatory only after this Sprint is accepted, merged and `main` is freshly reconstructed; it is not authorized for execution in this Sprint.

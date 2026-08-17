# Sprint Manifest — P8-HARDENED-ACTIVATION-E2E-01

Date: 2026-08-17
Status: IMPLEMENTED ON SPRINT BRANCH / TASK CIS PASS / FINAL CI PENDING
Package: P8-PACKAGE-01 — Durable Deployment Authority Hardening
Base main: `98a8e674d72e1ad00d5eb5850ae4e71ac3f6a56c`
Branch: `sprint/P8-HARDENED-ACTIVATION-E2E-01`
PR: #191

## Goal

Join actual durable Factory output, hardened authenticated Deploy persistence, concurrency-safe activation authority and autonomous Runtime in one package-level proof covering successful upgrade plus stale/failed contender behavior.

## Authority

- `AGENTS.md`
- `project_docs/schedule/SPRINT_MODE.md`
- `project_docs/execution_planning/P8-PACKAGE-01.md`
- WBS 10.2.3, 10.3.1, 10.3.2
- WBS 13.3.3
- ADR-0002
- ADR-0007
- Master Blueprint ReleaseArtifact -> Deployment -> Autonomous Runtime sequence

## Revalidated predecessor

`P8-ATOMIC-DEPLOYMENT-AUTHORITY-01` merged through PR #190 at `98a8e674d72e1ad00d5eb5850ae4e71ac3f6a56c`; final pre-merge Deterministic CI #340 PASS.

## Construction boundary

Evidence-only. Existing executable Factory, Release, Artifact, Deploy and Runtime APIs were sufficient. No product/provider/contract/ADR/workflow change was required or made.

## Completed TASKs

1. TASK-116 — `d7b4f90a27444901b109a6c6a1f63f817940cae5` — CI #342 PASS.
2. TASK-117 — `78cce0a39c9f8a3a9bda9174cdfdc24d3e223217` — CI #344 PASS.
3. TASK-118 — `eb4575a9c61d5105626ff9354f630d7b5defe7ae` — CI #345 PASS.

Dependency order: `TASK-116 -> TASK-117 -> TASK-118`.

Materialization `7f602976fdfccdcbdc22806c54e2cce8826ff760` passed CI #341 before TASK implementation.

## Achieved E2E proof

`durable Factory output -> reconstructed Release/Artifact -> authenticated PostgreSQL Deploy -> atomic activate A -> autonomous Runtime with Builder/Observe unavailable -> atomic promote B from expected A -> stale successful C from expected A cannot replace B -> failed D retains B -> fresh authenticated Deploy reconstruction -> B remains authoritative + attempted A/B/C/D history durable -> B Runtime continuity`

## Test dimensions satisfied

- positive Factory/Release/Artifact/Deploy/Runtime path;
- negative stale-success rejection;
- negative failed-candidate retention;
- predecessor integration across P8 transport + atomic authority + P7 Factory/Runtime substrate;
- fresh provider reconstruction;
- no secret/credential leakage in serialized evidence;
- repository-wide TASK validations passed.

## Non-goals preserved

- no production traffic/load-balancer or zero-downtime claim;
- no process/fleet scheduler or production supervisor;
- no production SecretResolver;
- no migration locking/down/fleet work;
- no Observe/operations publication;
- no cross-context PostgreSQL consolidation;
- no canonical contract/ADR expansion;
- no full production-readiness claim;
- no P8 Integration & Technical Debt Review execution.

## Current gate

Run final repository-wide Deterministic CI on the Sprint closure head. If green, verify complete diff/review gates, promote the single PR #191 to human Sprint Review and stop. Do not merge automatically and do not materialize the P8 Integration & Technical Debt Review at this gate.

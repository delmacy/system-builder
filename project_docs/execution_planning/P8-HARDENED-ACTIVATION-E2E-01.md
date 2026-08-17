# Sprint Manifest — P8-HARDENED-ACTIVATION-E2E-01

Date: 2026-08-17
Status: MATERIALIZED / PRE-CODE CI PENDING
Package: P8-PACKAGE-01 — Durable Deployment Authority Hardening
Base main: `98a8e674d72e1ad00d5eb5850ae4e71ac3f6a56c`
Branch: `sprint/P8-HARDENED-ACTIVATION-E2E-01`

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

`P8-ATOMIC-DEPLOYMENT-AUTHORITY-01` merged through PR #190 at `98a8e674d72e1ad00d5eb5850ae4e71ac3f6a56c`; final Deterministic CI #340 PASS before merge. Its authenticated PostgreSQL provider, atomic activation API and stale-writer semantics are therefore integrated prerequisites rather than branch-only forecast.

## Construction boundary

This Sprint is evidence-only. Existing executable Factory, Release, Artifact, Deploy and Runtime APIs are sufficient. Product/provider/contract/ADR/workflow changes are forbidden; any need for them requires escalation rather than scope expansion.

## Committed TASKs

1. TASK-116 — prove durable Factory output reaches authenticated atomic activation A and autonomous Runtime.
2. TASK-117 — prove successful B promotion followed by deterministic stale contender rejection while Runtime continuity is preserved.
3. TASK-118 — prove failed contender retention, fresh deployment-authority reconstruction and final Runtime continuity.

Dependency order: `TASK-116 -> TASK-117 -> TASK-118`.

## Growing E2E proof

`durable Factory output -> reconstructed Release/Artifact -> authenticated PostgreSQL Deploy -> atomic activate A -> autonomous Runtime with Builder/Observe unavailable -> atomic promote B from expected A -> stale contender from expected A cannot replace B -> failed contender retains B -> fresh Deploy reconstruction -> B remains authoritative + attempted history durable + Runtime continuity`

## Required test dimensions

Each TASK must include or extend:
- positive path evidence;
- negative/fail-closed evidence relevant to that stage;
- predecessor integration evidence;
- no secret/credential leakage in serialized evidence;
- repository-wide validation.

## Non-goals

- production traffic/load-balancer switching or zero-downtime claims;
- process/fleet scheduler or production supervisor;
- production SecretResolver;
- migration locking/down/fleet semantics;
- Observe/operations publication (WBS 10.3.3);
- cross-context PostgreSQL consolidation;
- canonical contract or ADR expansion;
- full production-readiness claims;
- P8 Integration & Technical Debt Review.

## Validation gates

1. Materialization gate: Deterministic CI on this pre-code manifest/TASK set must PASS before TASK-116 implementation.
2. TASK gate: each TASK commit must pass its declared validations/Deterministic CI before the successor starts.
3. Final gate: Sprint Report + repository-wide Deterministic CI on closure head.
4. Human Sprint Review: one PR, promoted only after final scope/review validation.

## Stop conditions

Stop/escalate if the proof requires any `packages/**`, canonical contract, ADR, CI workflow or architecture L4 change, or if an actual integrated predecessor/API cannot support the declared proof.

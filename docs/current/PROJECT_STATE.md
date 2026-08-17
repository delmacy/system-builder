# Project State

Date: 2026-08-17

## Repository

`delmacy/system-builder` is the canonical source of truth. Agents reconstruct technical context from repository files rather than chat history.

## Current maturity

- Public contract spine integrated through TASK-008.
- P1/P2/P3 construction packages and mandatory package reviews merged through PR #166.
- P4 construction/review merged through PR #172.
- P5 construction/review merged through PR #177.
- P6 construction and mandatory Integration & Technical Debt Review merged through PR #182 at `3dfe567f4af539819a7ae96b524f0060f85b9825`.
- P6 result: PASS WITH DEBT; no rollback blocker or L4/public-contract drift.
- GitHub Actions remains the objective deterministic integration gate with PostgreSQL 17.6 service evidence.
- AgentFactory Supervisor/runtime remains frozen non-blocking infrastructure track.

## Integrated proof

`durable Catalog -> deterministic Assembly/Validation/Compiler -> durable PublishedRelease + ArtifactPayload -> provider/process reconstruction -> verified retrieval -> existing Deploy -> autonomous Runtime -> persisted state across clean redeploy`

## Successor planning

`P7-PACKAGE-01 — Durable Deployment Lifecycle` is the rolling-wave successor package plan.

Package direction is derived from current WBS 10.3.1/10.3.2 deployment records/active-version visibility, WBS 10.2.3 health/acceptance/rollback and WBS 13.3.3 safe upgrade/rollback.

The first construction Sprint candidate is `P7-DURABLE-DEPLOYMENT-STATE-01`. Later rollback/E2E Sprints and the mandatory P7 package review remain FORECAST / NOT_MATERIALIZED.

## Architecture boundary

ADR-0002 and ADR-0007 remain controlling. PostgreSQL may be used only as a replaceable reference implementation behind Deploy-owned boundaries. Release material remains secret-free; Environment/secret resolution stays external; Runtime ordinary operation remains independent of Builder/Factory availability.

## Current gate

Merge the P7 package plan only after deterministic CI. Then reconstruct `main` before committing/materializing `P7-DURABLE-DEPLOYMENT-STATE-01`.
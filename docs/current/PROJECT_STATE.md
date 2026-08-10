# Project State

Date: 2026-08-10

## Repository

`delmacy/system-builder` is the canonical factory repository. TASK-001 bootstrap is implemented on `codex/task-001-bootstrap`; its committed/remote integration remains a maintainer review boundary.

## Current maturity

- Product/architecture blueprint: established conceptual baseline.
- Legacy inventory: evidence-backed against `delmacy/gestaotecnica@2fb3691cbfd0ba19c4a64ce054fc99e90d5e4200`.
- Product code: not started.
- Agent harness: local TypeScript implementation with task selection, bounded context, scope verification, validation receipts and deterministic closure ledger.
- Architecture gates: runnable import-boundary scanner plus self-tests; rules become active as `apps/` and `packages/` appear.
- Roadmap: M1 contract spine decomposed into ordered TASK-002 through TASK-008.

## Verified operating model

The expected local flow is `npm install`, `task:next`, `task:prepare`, OpenCode execution from the Task Pack, `task:verify`, review and `task:close`. The harness is provider-agnostic and requires no database or cloud service.

## Accepted foundational decisions

The accepted decisions in ADR-0001 through ADR-0007 remain unchanged. No new architecture policy was silently introduced by TASK-001.

## Active milestone

M1 — Vertical Contract Spine, after TASK-001 closure.

## Immediate next task

`TASK-002` — synthetic harness handoff proof (`free`, low risk, OpenCode preferred).

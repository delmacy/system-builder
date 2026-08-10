# Project State

Date: 2026-08-10

## Repository

`delmacy/system-builder` is the canonical factory repository. TASK-001 plus the Git workflow bootstrap are implemented on `codex/task-git-workflow-bootstrap`; integration into `main` remains a maintainer review boundary.

## Current maturity

- Product/architecture blueprint: established conceptual baseline.
- Legacy inventory: evidence-backed against `delmacy/gestaotecnica@2fb3691cbfd0ba19c4a64ce054fc99e90d5e4200`.
- Product code: not started.
- Agent harness: local TypeScript implementation with task selection, bounded context, scope verification, Git branch/status/commit/push/PR controls, validation receipts and deterministic closure ledger.
- Architecture gates: runnable import-boundary scanner plus self-tests; rules become active as `apps/` and `packages/` appear.
- Roadmap: M1 contract spine decomposed into ordered TASK-002 through TASK-008.

## Verified operating model

The expected local flow is `task:next`, `task:branch`, `task:prepare`, executor work from the Task Pack, `task:verify`, `task:commit`, `task:push`, `task:pr`, deterministic CI/review/merge and `task:close`. The harness is executor/provider-agnostic and requires no database or cloud service.

GitHub Actions runs confirmation CI only (`npm ci` and `npm run verify`); it does not execute agents or AI.

## Accepted foundational decisions

The accepted decisions in ADR-0001 through ADR-0007 remain unchanged. No new architecture policy was silently introduced by TASK-001.

## Active milestone

M1 — Vertical Contract Spine, after TASK-001 closure.

## Immediate next task

`TASK-002` — synthetic harness handoff proof (`free`, low risk, OpenCode preferred).

# Project State

Date: 2026-08-10

## Repository

`delmacy/system-builder` is the canonical factory repository. TASK-001 and the deterministic Git/GitHub workflow bootstrap are integrated into `main` at merge commit `c5f75bcba1848ba39ca023af2e98a083a416e718`.

The Pull Request CI for the Git workflow completed successfully. Repository branch protection/ruleset for `main` is still a maintainer configuration boundary and must be enabled before routine executor work begins.

## Current maturity

- Product/architecture blueprint: established conceptual baseline.
- Legacy inventory: evidence-backed against `delmacy/gestaotecnica@2fb3691cbfd0ba19c4a64ce054fc99e90d5e4200`.
- Product code: not started.
- Agent harness: local TypeScript implementation with task selection, bounded context, scope verification, Git branch/status/commit/push/PR controls, validation receipts and deterministic closure ledger.
- Architecture gates: runnable import-boundary scanner plus self-tests; rules become active as `apps/` and `packages/` appear.
- Roadmap: M1 contract spine decomposed into ordered TASK-002 through TASK-008.

## Verified operating model

The manual local flow (`task:next` through reviewed implementation/state PRs) was proven end to end by TASK-002 using bounded OpenCode execution, deterministic verification, PR #6 and state PR #7.

TASK-009 now specifies the Local Task Orchestrator v1 as the next priority before TASK-003. Its implementation must preserve the manual commands as authorities, remain resumable and stop at architecture, CI, review and merge gates.

GitHub Actions runs confirmation CI only (`npm ci` and `npm run verify`); it does not execute agents or AI.

## Accepted foundational decisions

The accepted decisions in ADR-0001 through ADR-0007 remain unchanged. No new architecture policy was silently introduced by TASK-001 or the Git workflow bootstrap.

## Active milestone

M1 — Vertical Contract Spine.

## Immediate next task

Review and integrate `TASK-009` — Local Task Orchestrator v1 (`architecture`, high risk, Codex preferred). After its implementation and state PRs are human-merged, resume the M1 contract spine at TASK-003.

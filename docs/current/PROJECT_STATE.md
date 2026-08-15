# Project State

Date: 2026-08-15

## Repository

`delmacy/system-builder` is the canonical source of truth for the System Builder product and its bounded development infrastructure.

The planning baseline, WBS/Work Packages, dependency-driven roadmap, execution governance, AgentFactory implementation history and product contracts are integrated in `main`.

## Current maturity

- Product/architecture blueprint: established and decomposed into controlled scope/WBS/DAG artifacts.
- Product implementation: M1 Vertical Contract Spine is active. TASK-004 is completed; TASK-005 and TASK-006 are the remaining committed work in the current Sprint.
- OpenCode CLI: retained as the default local product executor.
- GitHub Actions: deterministic validation/CI remains the integration gate.
- AgentFactory: substantial specs, harness, Supervisor, model routing, lifecycle, evidence and recovery work are preserved, but the Supervisor/runtime path is frozen and removed from the product critical path.

## Active execution focus

**M1-SPRINT-01 — Vertical Contract Spine in Sprint Mode.**

Product development now uses one Sprint branch, sequential TASK commits, final full verification and one Sprint PR/review to `main`.

The active execution order is:

`TASK-004 (DONE) -> TASK-005 -> TASK-006`

TASK-005 defines the technology-independent BusinessRecipe public contract. TASK-006 defines the SystemAnalysis public contract and depends on TASK-005.

## Sprint execution policy

See `project_docs/schedule/SPRINT_MODE.md`.

Default flow:

`main -> sprint/<SPRINT-ID> -> TASK commits -> npm run verify -> Sprint Report -> Sprint Review -> one PR -> main`

OpenCode CLI may execute the committed TASKs directly. AgentFactory heartbeat/callback/Supervisor state is not a product-Sprint completion gate.

## AgentFactory status

AgentFactory work is not discarded. Its architecture, task contracts, tests, policies and implementation history remain repository memory and may be resumed later as a dedicated infrastructure track.

Known runtime/supervision defects do not block M1 product execution. Do not restart or repair the AgentFactory execution track from product Sprint capacity unless explicitly authorized.

## Immediate next work

1. Start/resume `sprint/M1-SPRINT-01` from synchronized `main`.
2. Execute TASK-005, validate and commit it on the Sprint branch.
3. Execute TASK-006, validate and commit it on the same Sprint branch.
4. Run final `npm run verify`.
5. Produce the Sprint Report and open one Sprint PR to `main`.
6. Perform Sprint Review before merge and before authorizing the next Sprint.

## Selection warning

Do not select work outside the committed Sprint merely because it is globally READY. Discoveries become backlog/follow-up items unless they are required to satisfy the existing Sprint Goal and remain within authorized scope.

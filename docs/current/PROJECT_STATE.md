# Project State

Date: 2026-08-14

## Repository

`delmacy/system-builder` is the canonical source of truth for the System Builder product and its bounded AgentFactory delivery infrastructure.

The planning baseline, WBS/Work Packages, dependency-driven roadmap, execution governance, AgentFactory ignitive project and I1 executable horizon are integrated in `main`. TASK-011's OpenCode `run` argument-order fix is also integrated and its CI passed.

## Current maturity

- Product/architecture blueprint: established and decomposed into controlled scope/WBS/DAG artifacts.
- Product implementation: M1 Vertical Contract Spine remains ready to resume at TASK-010/TASK-004, but is intentionally not the current execution focus while AgentFactory ignition is completed.
- Agent harness: local TypeScript implementation with bounded task context, task validation, Git/PR controls, deterministic verification and closure mechanisms.
- OpenCode adapter: TASK-011 argument ordering and TASK-013 structured request/result, timeout and failure hardening are integrated.
- AgentFactory planning: complete through I1 Work Packages, DAG, governance, task-generation policy and exit gate.
- AgentFactory I1 implementation, post-I1 hardening and I2 pre-run control plane: TASK-012 through TASK-033 are completed. The durable event-driven Supervisor kernel and its real local Windows runtime bridge are integrated and state-closed.
- GitHub Actions: confirmation CI remains deterministic; AI execution is local unless a later approved task changes that architecture.

## Active execution focus

**I2 dynamic-model corrective gate — NO-GO; candidate execution prohibited.**

Goal: remove the manual exact `OPENCODE_MODEL` prerequisite through WP-I2-04/TASK-034, then reassess Supervisor readiness before any TASK-010 candidate execution.

## Product track held ready

M1 — Vertical Contract Spine remains valid and its READY work is not cancelled. Product tasks are paused by execution policy, not by false DAG dependencies, while the AgentFactory ignition path is built.

## Immediate next work

1. Execute and state-close TASK-034 for dynamic OpenCode Zen model discovery and deterministic free-only selection.
2. Reassess Supervisor readiness from the integrated correction; do not create or execute a TASK-010 plan before that decision.
3. Convert any missing durable-authority finding into a separately governed corrective task rather than weakening reconciliation.
4. Preserve one-task-at-a-time I2 semantics; do not advance to I3, task parallelism, database, public webhook or UI work.

## Selection warning

The recorded supplemental GO is superseded by the dynamic-model corrective gate. No product candidate, unrelated globally READY work, I3 or parallel scheduling is authorized until the correction integrates and readiness is reassessed.

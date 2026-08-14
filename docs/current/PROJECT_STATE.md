# Project State

Date: 2026-08-13

## Repository

`delmacy/system-builder` is the canonical source of truth for the System Builder product and its bounded AgentFactory delivery infrastructure.

The planning baseline, WBS/Work Packages, dependency-driven roadmap, execution governance, AgentFactory ignitive project and I1 executable horizon are integrated in `main`. TASK-011's OpenCode `run` argument-order fix is also integrated and its CI passed.

## Current maturity

- Product/architecture blueprint: established and decomposed into controlled scope/WBS/DAG artifacts.
- Product implementation: M1 Vertical Contract Spine remains ready to resume at TASK-010/TASK-004, but is intentionally not the current execution focus while AgentFactory ignition is completed.
- Agent harness: local TypeScript implementation with bounded task context, task validation, Git/PR controls, deterministic verification and closure mechanisms.
- OpenCode adapter: TASK-011 argument ordering and TASK-013 structured request/result, timeout and failure hardening are integrated.
- AgentFactory planning: complete through I1 Work Packages, DAG, governance, task-generation policy and exit gate.
- AgentFactory I1 implementation, post-I1 hardening and I2 pre-run control plane: TASK-012 through TASK-031 are completed. TASK-028's coordinator and every implementation/state PR from TASK-028 through TASK-031 reconcile as `DONE` through signed durable human approval, green required checks and integrated state evidence.
- GitHub Actions: confirmation CI remains deterministic; AI execution is local unless a later approved task changes that architecture.

## Active execution focus

**I2 pre-run gate — GO; candidate execution not started.**

Goal: prove one bounded READY task can move through task pack, model/executor selection, OpenCode execution, independent validation, evidence/state update and successor readiness without manually reconstructing context.

## Product track held ready

M1 — Vertical Contract Spine remains valid and its READY work is not cancelled. Product tasks are paused by execution policy, not by false DAG dependencies, while the AgentFactory ignition path is built.

## Immediate next work

1. Start the bounded I2 proof with TASK-010 from a fresh branch and Task Pack based on current `main`; the stale pre-I2 local preparation was removed without product changes.
2. Require TASK-010 to reach integrated `DONE` before the coordinator may release the documented TASK-004 -> TASK-005 -> TASK-006 sequence.
3. Execute one task at a time with independent validation, signed approval where required, state closure and successor recomputation between tasks.
4. Reassess the I2 Exit Gate from the real integrated chain; do not advance to I3 or parallel execution before it passes.

## Selection warning

The global catalog still exposes independent READY product work. The I2 GO authorizes only the controlled candidate beginning with TASK-010 and then the evidence-released TASK-004 -> TASK-005 -> TASK-006 chain. It is not permission for a broad M1 restart or parallel product execution.

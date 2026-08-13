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
- AgentFactory I1 implementation and post-I1 hardening: TASK-012 through TASK-027 are completed. TASK-028's I2 coordinator and bootstrap closure are integrated, but hardened lifecycle reconciliation is blocked by missing GitHub approvals.
- GitHub Actions: confirmation CI remains deterministic; AI execution is local unless a later approved task changes that architecture.

## Active execution focus

**I2 pre-run gate — NO-GO; execution not started.**

Goal: prove one bounded READY task can move through task pack, model/executor selection, OpenCode execution, independent validation, evidence/state update and successor readiness without manually reconstructing context.

## Product track held ready

M1 — Vertical Contract Spine remains valid and its READY work is not cancelled. Product tasks are paused by execution policy, not by false DAG dependencies, while the AgentFactory ignition path is built.

## Immediate next work

1. Preserve TASK-028 implementation and bootstrap closure as integrated evidence.
2. Execute TASK-029 to implement ADR-0010's signed durable human approval without weakening GitHub review, CI or validation.
3. Do not execute TASK-010 or the documented TASK-004 -> TASK-005 -> TASK-006 chain until a reassessed pre-run gate is GO.
4. Do not advance to I3 or parallel execution before the I2 Exit Gate.

## Selection warning

The global task catalog also contains READY product tasks. During AgentFactory ignition, do not treat global `task:next` ordering as permission to switch back to product M1. Select the approved AgentFactory milestone/task explicitly until the handoff focus changes or milestone-aware scheduling is implemented.

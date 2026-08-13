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
- AgentFactory implementation queue: TASK-012 through TASK-020 are completed. TASK-019's integrated append-only evidence envelope makes WP-I1-10 executable as TASK-021; TASK-020 remains integrated for the I1 proof.
- GitHub Actions: confirmation CI remains deterministic; AI execution is local unless a later approved task changes that architecture.

## Active execution focus

**I1 — AgentFactory Single Task Autonomous.**

Goal: prove one bounded READY task can move through task pack, model/executor selection, OpenCode execution, independent validation, evidence/state update and successor readiness without manually reconstructing context.

## Product track held ready

M1 — Vertical Contract Spine remains valid and its READY work is not cancelled. Product tasks are paused by execution policy, not by false DAG dependencies, while the AgentFactory ignition path is built.

## Immediate next work

1. Execute TASK-021 — AgentFactory Ledger State Transition Engine — from the integrated TASK-012 contracts and TASK-019 evidence interface.
2. Materialize WP-I1-11 only after TASK-021 implementation and state closure are integrated.
3. Materialize WP-I1-12 only after the actual readiness output is integrated; preserve TASK-020 as a proof predecessor.
4. Pass the I1 exit gate before any I2 work or return to product M1.

## Selection warning

The global task catalog also contains READY product tasks. During AgentFactory ignition, do not treat global `task:next` ordering as permission to switch back to product M1. Select the approved AgentFactory milestone/task explicitly until the handoff focus changes or milestone-aware scheduling is implemented.

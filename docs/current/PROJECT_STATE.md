# Project State

Date: 2026-08-12

## Repository

`delmacy/system-builder` is the canonical source of truth for the System Builder product and its bounded AgentFactory delivery infrastructure.

The planning baseline, WBS/Work Packages, dependency-driven roadmap, execution governance, AgentFactory ignitive project and I1 executable horizon are integrated in `main`. TASK-011's OpenCode `run` argument-order fix is also integrated and its CI passed.

## Current maturity

- Product/architecture blueprint: established and decomposed into controlled scope/WBS/DAG artifacts.
- Product implementation: M1 Vertical Contract Spine remains ready to resume at TASK-010/TASK-004, but is intentionally not the current execution focus while AgentFactory ignition is completed.
- Agent harness: local TypeScript implementation with bounded task context, task validation, Git/PR controls, deterministic verification and closure mechanisms.
- OpenCode adapter: TASK-011 argument ordering and TASK-013 structured request/result, timeout and failure hardening are integrated.
- AgentFactory planning: complete through I1 Work Packages, DAG, governance, task-generation policy and exit gate.
- AgentFactory implementation queue: TASK-012 execution contracts, TASK-013 OpenCode hardening and TASK-014 DAG/READY evaluation are completed. TASK-015 Task Pack builder and TASK-016 Model Router are the next rolling-wave tasks.
- GitHub Actions: confirmation CI remains deterministic; AI execution is local unless a later approved task changes that architecture.

## Active execution focus

**I1 — AgentFactory Single Task Autonomous.**

Goal: prove one bounded READY task can move through task pack, model/executor selection, OpenCode execution, independent validation, evidence/state update and successor readiness without manually reconstructing context.

## Product track held ready

M1 — Vertical Contract Spine remains valid and its READY work is not cancelled. Product tasks are paused by execution policy, not by false DAG dependencies, while the AgentFactory ignition path is built.

## Immediate next work

1. Execute TASK-015 — AgentFactory Task Pack builder — from the integrated TASK-012/TASK-014 contracts.
2. Execute TASK-016 — AgentFactory Model Router — from the integrated TASK-012 route vocabulary.
3. After accepted outputs, generate the next eligible bounded task(s) for WP-I1-06 according to `project_docs/agentfactory_i1/IMPLEMENTATION_GENERATION_RULE.md`.
4. Continue through the I1 exit gate, then I2/I3 as defined by AgentFactory ignition milestones before resuming product-first throughput.

## Selection warning

The global task catalog also contains READY product tasks. During AgentFactory ignition, do not treat global `task:next` ordering as permission to switch back to product M1. Select the approved AgentFactory milestone/task explicitly until the handoff focus changes or milestone-aware scheduling is implemented.

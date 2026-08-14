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
- AgentFactory I1 implementation, post-I1 hardening and I2 pre-run control plane: TASK-012 through TASK-032 are completed. TASK-032's durable event-driven Supervisor kernel is integrated and state-closed; its real local runtime bridge is materialized as TASK-033.
- GitHub Actions: confirmation CI remains deterministic; AI execution is local unless a later approved task changes that architecture.

## Active execution focus

**I2 supplemental supervisor gate — runtime bridge pending; candidate execution prohibited.**

Goal: add the ADR-0011 event-driven local Supervisor so the accepted sequential pipeline can release resources at external waits and resume from durable callback/heartbeat evidence without process memory or continuous polling.

## Product track held ready

M1 — Vertical Contract Spine remains valid and its READY work is not cancelled. Product tasks are paused by execution policy, not by false DAG dependencies, while the AgentFactory ignition path is built.

## Immediate next work

1. Execute and close TASK-033 for WP-I2-03 from the integrated TASK-032 interfaces.
2. Reassess Supervisor readiness after TASK-033 integrates; do not create or execute the TASK-010 branch before that decision.
3. Convert any missing durable-authority finding into a separately governed corrective task rather than weakening reconciliation.
4. Preserve one-task-at-a-time I2 semantics; do not advance to I3, task parallelism, database, public webhook or UI work.

## Selection warning

The previous I2 pre-run GO remains historical evidence, but CHG-AF-2026-08-13-01 adds a new explicit precondition. Global READY product work is not authorized until the Supervisor slices are integrated, state-closed and reassessed.

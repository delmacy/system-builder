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

**I2 supplemental supervisor gate — implementation pending; candidate execution prohibited.**

Goal: add the ADR-0011 event-driven local Supervisor so the accepted sequential pipeline can release resources at external waits and resume from durable callback/heartbeat evidence without process memory or continuous polling.

## Product track held ready

M1 — Vertical Contract Spine remains valid and its READY work is not cancelled. Product tasks are paused by execution policy, not by false DAG dependencies, while the AgentFactory ignition path is built.

## Immediate next work

1. Execute and close TASK-032 for WP-I2-02, the durable event/outbox/lease/retry Supervisor kernel.
2. Materialize WP-I2-03 only from the actual integrated TASK-032 interfaces, then implement its real coordinator/orchestrator bridge and finite Windows commands.
3. Reassess Supervisor readiness after both slices integrate; do not create or execute the TASK-010 branch before that decision.
4. Preserve one-task-at-a-time I2 semantics; do not advance to I3, task parallelism, database, public webhook or UI work.

## Selection warning

The previous I2 pre-run GO remains historical evidence, but CHG-AF-2026-08-13-01 adds a new explicit precondition. Global READY product work is not authorized until the Supervisor slices are integrated, state-closed and reassessed.

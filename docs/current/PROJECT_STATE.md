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
- AgentFactory I1 implementation, post-I1 hardening and I2 pre-run control plane: TASK-012 through TASK-034 are completed. The durable event-driven Supervisor, its real local Windows runtime bridge and dynamic free-model resolution are integrated and state-closed.
- GitHub Actions: confirmation CI remains deterministic; AI execution is local unless a later approved task changes that architecture.

## Active execution focus

**I2 sequential candidate entry — GO for the explicit TASK-010-only Supervisor plan; not yet started.**

Goal: run the single bounded TASK-010 candidate through the finite Supervisor, then reassess the I2 Exit Gate from its real integrated evidence. I3 and parallel scheduling remain prohibited.

## Product track held ready

M1 — Vertical Contract Spine remains valid and its READY work is not cancelled. Product tasks are paused by execution policy, not by false DAG dependencies, while the AgentFactory ignition path is built.

## Immediate next work

1. Create the strict external TASK-010-only runtime plan with a free-only selector and no fixed model ID or required `OPENCODE_MODEL`.
2. Start only that plan through the finite Supervisor when explicitly invoked by the operator.
3. Convert any missing durable-authority finding into a separately governed corrective task rather than weakening reconciliation.
4. Preserve one-task-at-a-time I2 semantics and reassess the I2 Exit Gate from real TASK-010 evidence; do not advance to I3, task parallelism, database, public webhook or UI work.

## Selection warning

The post-correction readiness decision authorizes only the explicit TASK-010 candidate plan through the finite Supervisor. It does not authorize unrelated globally READY work, broad M1 execution, I3 or parallel scheduling.

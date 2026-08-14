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
- AgentFactory I1 implementation, post-I1 hardening and I2 pre-run control plane: TASK-012 through TASK-035 are completed. The durable event-driven Supervisor, its real local Windows runtime bridge and dynamic free-model/CLI qualification are integrated and state-closed.
- GitHub Actions: confirmation CI remains deterministic; AI execution is local unless a later approved task changes that architecture.

## Active execution focus

**I2 package-authorization governance gate — TASK-037 next.**

TASK-010 completed implementation PR #99 and bootstrap state PR #100 with exact durable approvals, but its preserved Supervisor run terminated `EVIDENCE_MISSING`: no real AFEV, causal AgentFactory ledger or readiness receipt was integrated. TASK-036 accepted the missing L4 integration decision; its corrective runtime implementation remains unmaterialized. I3, TASK-004 and parallel scheduling remain prohibited.

TASK-036 and ADR-0012 are now integrated and state-closed. Before the bounded
WP-I2-06 implementation is materialized, the owner-directed package work
authorization model must be decided by TASK-037/ADR-0013. ADR-0010 remains in
force until that separate architecture and its downstream implementation pass.

## Product track held ready

M1 — Vertical Contract Spine remains valid and its READY work is not cancelled. Product tasks are paused by execution policy, not by false DAG dependencies, while the AgentFactory ignition path is built.

## Immediate next work

1. Execute and state-close TASK-037 to accept ADR-0013 for bounded package work authorization.
2. Materialize and prove the smallest WP-I2-07 policy implementation task from the accepted decision.
3. Materialize the bounded WP-I2-06 authority implementation task from ADR-0012 and the integrated package-governance boundary.
4. Run a fresh bounded authority proof before authorizing TASK-004 -> TASK-005; do not advance to I3, task parallelism, database, public webhook or UI work.

## Selection warning

Bootstrap `DONE` is not AgentFactory reconciliation. Package intent is not yet
an approval receipt. Do not backfill fabricated TASK-010 AFEV, rewrite the
terminal pipeline, select globally READY TASK-004, or weaken
`EVIDENCE_MISSING`. The governed implementations and a fresh proof must precede
product-chain authorization.

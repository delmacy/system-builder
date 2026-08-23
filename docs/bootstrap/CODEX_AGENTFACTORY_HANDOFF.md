# Codex AgentFactory Continuation Handoff

> **HISTORICAL / NOT CURRENT EXECUTION AUTHORITY.** This handoff records the bootstrap-era AgentFactory continuation model and is retained for traceability only. Do not execute its I1-I7 progression, old TASK selection, branch protocol or scheduler guidance as current procedure. Current work must start from `AGENTS.md`, `docs/README.md`, current repository memory, current Sprint policy/mode, the active Work Package/Sprint and committed TASK specifications.

## Mission

Continue the bounded AgentFactory delivery-infrastructure project from the repository state until its approved ignition milestones are implemented and evidenced, while preserving System Builder architecture, governance and product scope.

The repository is the only durable authority. Do not rely on chat history.

## Bootstrap on maintainer PC

```bash
git switch main
git fetch origin
git pull --ff-only origin main
npm ci
npm run verify
```

The working tree must be clean before starting a task.

## Required reading order

1. `AGENTS.md`
2. `docs/current/PROJECT_STATE.md`
3. `docs/current/CURRENT_MILESTONE.md`
4. `docs/current/NEXT_WORK.md`
5. `project_docs/agentfactory_ignition/MASTER_SCOPE.md`
6. `project_docs/agentfactory_ignition/WBS_MASTER.md`
7. `project_docs/agentfactory_ignition/WORK_PACKAGES.md`
8. `project_docs/agentfactory_ignition/DAG.md`
9. `project_docs/agentfactory_ignition/IGNITION_MILESTONES.md`
10. `project_docs/agentfactory_ignition/EXIT_CRITERIA.md`
11. `project_docs/agentfactory_i1/`
12. `project_docs/execution_governance/`
13. the exact `specs/tasks/TASK-*.md` being executed

Read deeper architecture/ADR files only when the task context or `AGENTS.md` requires them.

## Current starting point at the time of this historical handoff

- TASK-012 through TASK-027, including post-I1 hardening and re-proof, were integrated.
- `project_docs/agentfactory_i1/POST_I1_REVIEW.md` was GO for bounded I2 implementation planning.
- `project_docs/agentfactory_i2/SEQUENTIAL_PIPELINE.md` defined I2 and candidate TASK-004 -> TASK-005 -> TASK-006, with TASK-010 accepted as a precondition.
- The candidate chain had not been executed. The handoff instructed materializing the I2 coordinator task first and not advancing to I3 before the I2 Exit Gate.

The remainder of this file is preserved as historical procedure and must be read in that context.

## Per-task protocol

For each implementation task, the historical protocol required predecessor confirmation, a dedicated task branch, bounded task contract/context, allowed/forbidden path enforcement, declared validation, diff review, PR/CI/review, closure metadata and DAG/readiness recomputation. It prohibited inventing missing architecture and required follow-up items rather than reopening completed work.

## Rolling-wave task generation

The historical model prohibited speculative generation of the entire future task catalog. It required reading eligible Work Packages, inspecting merged outputs/contracts, materializing bounded independently verifiable TASK specs, validating the catalog and preserving milestone/WP/dependency traceability before execution.

## Historical milestone progression

- I1 — Single Task Autonomous
- I2 — Sequential Pipeline
- I3 — Sprint Autonomous
- I4 — DAG Autonomous
- I5 — Review/Replanning
- I6 — Parallel Execution
- I7 — Self-Operating Factory

These labels describe the bootstrap-era AgentFactory roadmap; they are not current successor-work authority.

## Historical model/executor policy

The design favored deterministic code for scheduler/validation work, cheap bounded OpenCode execution where contracts/tests were strong, and escalation for L3/L4 ambiguity.

## Mandatory stop gates retained as useful historical principles

The handoff stopped for undeclared public-contract/architecture changes, scope expansion, destructive migration, security/trust-boundary changes beyond authority, evaluator/governance weakening, missing dependency evidence, forbidden paths, dependency cycles or contradictory authority.

These principles remain compatible with current governance only where current authoritative documents also require them; this historical file does not create the requirement.

## Historical completion definition

AgentFactory completion was evidence-based against its then-applicable ignition exit criteria and deterministic validation. Current project completion and execution authority are defined by current repository policy, not by this handoff.
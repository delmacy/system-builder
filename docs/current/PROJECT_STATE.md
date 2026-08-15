# Project State

Date: 2026-08-15

## Repository

`delmacy/system-builder` is the canonical source of truth for the System Builder product and its bounded development infrastructure.

The planning baseline, WBS/Work Packages, dependency-driven roadmap, execution governance, AgentFactory implementation history and product contracts remain repository memory.

## Current maturity

- Product/architecture blueprint: established and decomposed into controlled scope/WBS/DAG artifacts.
- ProcessMirror first contract slice: completed by TASK-004.
- Product execution: switched to Sprint Mode with one focused product task per Sprint by default.
- OpenCode CLI: default local executor when local execution is used.
- GitHub Actions: deterministic validation/CI remains an objective integration gate.
- AgentFactory: specs, harness, Supervisor, model routing, lifecycle, evidence and recovery work are preserved, but the Supervisor/runtime path is frozen and removed from the product critical path.

## Active execution focus

**First ten-Sprint product horizon.**

See `project_docs/execution_planning/PRODUCT_10_SPRINT_PLAN.md`.

The sequence is designed to produce an increasingly testable vertical slice:

`Recipe -> Analysis -> Design -> downstream contract spine -> Catalog -> Assembly -> Validation -> Compiler -> Release -> Deploy`

ProcessMirror is already represented by completed TASK-004. Observe and Support follow after the first deployable synthetic proof.

## Sprint execution policy

See `project_docs/schedule/SPRINT_MODE.md`.

Default flow:

`main -> sprint/<SPRINT-ID> -> primary TASK -> declared tests -> npm run verify -> Sprint Report -> one PR -> Sprint Review -> main`

A connected repository agent may orchestrate GitHub work and CI evidence, but local OpenCode/test execution must not be claimed unless actually observed.

## Immediate next work

1. Integrate the Sprint Mode documentation baseline.
2. Start `P1-SPRINT-01` from synchronized `main`.
3. Execute TASK-005 / BusinessRecipe only.
4. Run declared validation and final repository verification.
5. Produce the compact Sprint Report and one PR.
6. Stop for Sprint Review.
7. After integration, continue to `P1-SPRINT-02` / TASK-006.

## Ten-Sprint outcome

The first horizon is complete when the repository can test the synthetic chain:

`ProcessMirror -> BusinessRecipe -> SystemAnalysis -> SystemDefinition -> Catalog resolution -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> PublishedRelease -> DeploymentRecord`.

## AgentFactory status

AgentFactory work is not discarded. Its architecture, task contracts, tests, policies and implementation history remain repository memory and may be resumed later as a dedicated infrastructure track.

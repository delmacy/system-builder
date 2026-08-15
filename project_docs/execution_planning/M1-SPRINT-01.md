# M1-SPRINT-01 — Vertical Contract Spine (historical transition)

## Status

This document records the Sprint that originally grouped the first contract-spine work. Sprint Mode now executes the remaining product work in smaller, independently testable Sprints.

Canonical forward plan:

- `project_docs/schedule/SPRINT_MODE.md`
- `project_docs/execution_planning/PRODUCT_10_SPRINT_PLAN.md`

## Baseline established

- TASK-004 / WP-FH-02 — ProcessMirror public contract — **DONE in main**
- TASK-005 / WP-FH-03 — BusinessRecipe public contract — **READY**
- TASK-006 / WP-FH-04 — SystemAnalysis public contract — **READY after TASK-005**

The historical AgentFactory/Supervisor plan `M1-SPRINT-01.plan.json` remains preserved as repository memory but is not required for product execution in Sprint Mode.

## Forward Sprint decomposition

The previous intention to execute TASK-005 and TASK-006 on one Sprint branch is superseded by the first ten-Sprint product plan so that each major module boundary gets a focused implementation/test cycle.

- `P1-SPRINT-01` → TASK-005 / SB-02 Recipe
- `P1-SPRINT-02` → TASK-006 / SB-03 Analysis
- `P1-SPRINT-03` → TASK-007 / SB-04 Design
- `P1-SPRINT-04` → TASK-008 / downstream contract spine
- `P1-SPRINT-05` → SB-05 Catalog minimal registry
- `P1-SPRINT-06` → SB-06 Assembly minimal resolver
- `P1-SPRINT-07` → SB-07 Validation traceability gate
- `P1-SPRINT-08` → SB-08 Compiler synthetic artifact
- `P1-SPRINT-09` → SB-09 Release lifecycle
- `P1-SPRINT-10` → SB-10 Deploy dry-run vertical proof

ProcessMirror is not repeated because TASK-004 already completed its first contract slice. Observe and Support follow after the first deployable synthetic vertical proof.

## Execution rule

Each forward Sprint uses one branch and one primary task:

`main -> sprint/<SPRINT-ID> -> TASK -> declared tests -> npm run verify -> Sprint Report -> one PR -> Sprint Review -> main`

The next Sprint does not start until the prior Sprint is integrated or an explicit review decision changes the sequence.

## Completion target

The ten-Sprint program ends when the repository can prove the synthetic chain:

`ProcessMirror -> BusinessRecipe -> SystemAnalysis -> SystemDefinition -> Catalog resolution -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> PublishedRelease -> DeploymentRecord`

with deterministic tests at each added boundary.

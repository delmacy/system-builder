# Current Execution Milestone — Product Sprint Mode

## Goal

Return development capacity to the System Builder product and build the first synthetic, deterministic vertical slice through Deploy using small independently testable Sprints.

## Execution model

The active model is `project_docs/schedule/SPRINT_MODE.md`.

The first committed horizon is `project_docs/execution_planning/PRODUCT_10_SPRINT_PLAN.md`.

Default execution shape:

`main -> sprint/<SPRINT-ID> -> one primary TASK -> tests -> npm run verify -> Sprint Report -> one PR -> Sprint Review -> main`

## Baseline

- Product/architecture blueprint: established.
- ProcessMirror first contract slice: TASK-004 completed.
- BusinessRecipe: TASK-005 ready.
- SystemAnalysis: TASK-006 ready after TASK-005.
- SystemDefinition: TASK-007 ready after TASK-006.
- Downstream contract spine: TASK-008 ready after TASK-007.
- AgentFactory runtime history remains preserved but its Supervisor/heartbeat/callback path is frozen and non-blocking.

## First ten Sprint horizon

1. `P1-SPRINT-01` — SB-02 Recipe — TASK-005.
2. `P1-SPRINT-02` — SB-03 Analysis — TASK-006.
3. `P1-SPRINT-03` — SB-04 Design — TASK-007.
4. `P1-SPRINT-04` — downstream Assembly→Deploy contract spine — TASK-008.
5. `P1-SPRINT-05` — SB-05 Catalog — minimal registry/lookup task to materialize.
6. `P1-SPRINT-06` — SB-06 Assembly — minimal deterministic resolver task to materialize.
7. `P1-SPRINT-07` — SB-07 Validation — traceability/quality gate task to materialize.
8. `P1-SPRINT-08` — SB-08 Compiler — synthetic deterministic artifact task to materialize.
9. `P1-SPRINT-09` — SB-09 Release — immutable release lifecycle task to materialize.
10. `P1-SPRINT-10` — SB-10 Deploy — local/dry-run deployment proof task to materialize.

## Exit target

Demonstrate and test:

`ProcessMirror -> BusinessRecipe -> SystemAnalysis -> SystemDefinition -> Catalog resolution -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> PublishedRelease -> DeploymentRecord`

## Review cadence

Normal human review occurs once at the end of each Sprint. A Sprint stops early only for an escalation condition defined by Sprint Mode or its TASK contract.

Observe and Support follow after this first deployable synthetic proof instead of delaying it.

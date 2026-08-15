# Current Execution Milestone — M1 Vertical Contract Spine

## Goal

Deliver the smallest integrated public contract spine for ProcessMirror -> BusinessRecipe -> SystemAnalysis and return product development to a predictable Sprint cadence.

## Execution mode

This milestone executes under `project_docs/schedule/SPRINT_MODE.md`.

Default delivery path:

`main -> sprint/M1-SPRINT-01 -> committed TASKs -> full verify -> Sprint Report -> Sprint Review -> one PR -> main`

The Sprint branch is the shared integration branch for the committed TASKs. TASK boundaries are preserved through separate commits and declared validation gates.

## M1-SPRINT-01 committed work

- [x] TASK-004 / WP-FH-02 — ProcessMirror public contract.
- [ ] TASK-005 / WP-FH-03 — BusinessRecipe public contract.
- [ ] TASK-006 / WP-FH-04 — SystemAnalysis public contract.

Execution order is dependency-driven:

`TASK-004 -> TASK-005 -> TASK-006`

TASK-004 is already integrated in `main`, so the resumed Sprint executes TASK-005 then TASK-006 from the current synchronized base.

## Sprint Definition of Done

- TASK-005 acceptance criteria pass.
- TASK-006 acceptance criteria pass.
- Each TASK has a distinct commit on the Sprint branch.
- Declared per-TASK validations pass before advancing.
- Final `npm run verify` passes on the integrated Sprint branch.
- Required docs/contracts/spec status are updated.
- Sprint Report records commits, validation, deviations, discoveries and residual work.
- One PR from `sprint/M1-SPRINT-01` to `main` is ready for Sprint Review.

## Review boundary

Routine implementation does not require per-TASK human approval. Stop immediately for undeclared L3/L4 scope, architectural ambiguity, forbidden paths, destructive changes, security/governance weakening or conflicting repository authority.

The Sprint does not authorize the next Sprint automatically.

## AgentFactory infrastructure track

The AgentFactory I1/I2 work remains preserved as infrastructure history and may be resumed later. The Supervisor/runtime/heartbeat/callback path is frozen and is not a prerequisite for this product milestone.

No M1 capacity should be spent repairing AgentFactory runtime unless an explicit future infrastructure Sprint authorizes it.

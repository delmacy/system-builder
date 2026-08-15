# Sprint Template

Sprint identifiers are assigned when a Sprint is instantiated.

## Sprint Goal
One integrated, demonstrable and independently testable outcome.

## Primary task
Default: one primary product TASK per Sprint.

The TASK must reference Requirement, WBS/Work Package, predecessor gate, allowed/forbidden paths, expected evidence and validation.

A bounded cross-module contract-enabler Sprint is allowed when an already-accepted TASK intentionally establishes several linked boundaries.

## Entry gate
- parent WP/requirement ready enough for the declared slice;
- blockers satisfied;
- relevant contract versions pinned;
- acceptance/test strategy known;
- Sprint branch can be created from a known synchronized `main` base;
- execution evidence can be objectively observed locally or through CI.

## Commitment
Freeze the primary TASK and Sprint Goal at start except corrections required to achieve that Goal or explicitly approved emergency/change-control work.

## Execution branch

`sprint/<SPRINT-ID>`

Default flow:

`main -> Sprint branch -> primary TASK -> task validation -> npm run verify -> Sprint Report -> PR -> Sprint Review -> main`

## Exit gate
- Sprint Goal demonstrated;
- primary TASK acceptance criteria pass;
- declared TASK validation passes or is objectively observed;
- final repository validation passes;
- evidence/report stored;
- required documentation/contracts updated;
- one Sprint PR is ready for review;
- residual work returned explicitly to backlog rather than hidden.

## Report
Use `project_docs/schedule/SPRINT_REPORT_TEMPLATE.md`.

## Post-sprint
Recalculate readiness of successors and update forecast. Do not automatically start a successor merely because it was predicted; it must pass its current readiness gate and the previous Sprint must cross the review/integration boundary.

See `SPRINT_MODE.md` for the full execution contract.

# Sprint Template

Sprint identifiers/numbers are assigned only when instantiated.

## Sprint Goal

One integrated, demonstrable outcome.

## Sprint branch

Default branch: `sprint/<SPRINT-ID>` created from a known synchronized `main` commit.

All committed TASKs execute on this branch unless an explicitly approved exception requires isolation.

## Candidate tasks

Each TASK must reference Requirement, WBS, Work Package, predecessor gate and expected evidence.

## Entry gate

- parent WP READY;
- blockers satisfied;
- contract versions pinned;
- acceptance/test strategy known;
- environment and executor capacity available;
- Sprint base commit known;
- Sprint branch available/clean;
- committed TASK order consistent with the DAG.

## Commitment

Freeze the committed set at Sprint start except corrections required to achieve the Sprint Goal or explicitly approved emergency/change-control work.

## Per-TASK execution

For each committed TASK in dependency order:

- read TASK contract/context;
- implement bounded scope;
- run declared validation;
- autonomously correct bounded failures;
- create a distinct TASK commit;
- advance only when predecessor/acceptance gates are satisfied.

No per-TASK PR is required by default.

## Exit gate

- Sprint Goal demonstrated;
- committed acceptance criteria pass;
- final repository-wide verification passes;
- TASK commits are distinct and traceable;
- evidence/documentation/contracts updated;
- Sprint Report produced;
- residual work returned explicitly to backlog rather than hidden in an open Sprint;
- one Sprint PR from `sprint/<SPRINT-ID>` to `main` is ready for human review.

## Review and merge

Human review normally occurs once, at the Sprint PR boundary. Merge to `main` only after the Sprint exit gate and review are satisfied.

## Post-sprint

Recalculate readiness of successors and update forecast. Do not automatically start a successor merely because it was previously predicted; it must pass its current readiness gate and receive explicit Sprint authorization.

See `SPRINT_MODE.md` for the full execution contract.

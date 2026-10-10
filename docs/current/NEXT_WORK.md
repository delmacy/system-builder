# Next Work — Station S4 WP3 Codec Readiness

Date: 2026-10-10
Fresh predecessor: main@e9750fe4ebfc75a31ce84edd4984042edcd48ce4
Status: WP2 CLOSED; WP3 planning/readiness and Addendum 004 admission INTEGRATED; product Construction A not yet materialized

## Authority

- Document policy: `docs/DOCUMENT_AUTHORITY.md`.
- Admitted scope: `docs/contracts/004-station-portable-composition-artifacts/ADDENDUM.md`, registered in `docs/contracts/CONTRACT_INDEX.md`.
- WP3 planning baseline: `project_docs/execution_planning/STATION-S4-WP3-LOCAL-ARTIFACT-PLANNING-01.md`.
- Readiness TASK: `specs/tasks/TASK-652-STATION-S4-WP3-ARTIFACT-CODEC-READINESS.md`.
- Sprint discipline: `project_docs/schedule/SPRINT_MODE.md`.

## Integrated predecessor evidence

WP2 closure PR #1039 merged at 9768c06e0eeabdf89ee0c3eeeada63908a3fb000 after A #1036, B #1037 and review #1038. Closure-era pending labels in its plan/report/TASK are historical pre-merge checkpoints, not live gates. Browser B/review evidence covers twelve journeys; Save remains session-only.

WP3 planning #1040, readiness #1041 and contract proposal #1042 are integrated. Admission PR #1043 merged at e9750fe4ebfc75a31ce84edd4984042edcd48ce4 with head f5c9c8af7b5cd77acb813314d3d6ef77df19f9d0. Observed exact-head workflows all completed successfully: Deterministic CI 38070666674, Merge Candidate CI 38070666595, Heavy Product Tests 38070666640, Station Editor Browser Journey 38070666561 and Automation Handoff 38070666583. The Addendum's conditional admission is therefore effective. This proves documentation admission and predecessor regression, not an implemented codec.

## Next eligible work

Finish the bounded TASK-652 readiness inventory against fresh main: existing file/resource formats, graph/registry validation, external-input limits and identity/revision policy. TASK-652 permits only its own specification (max_files 1); apps/packages/tests/workflows/provider/runtime/deploy remain forbidden for this TASK. Validation: `npm run verify`, with observed Actions evidence when executing through GitHub.

Before any product write, materialize a separate Construction A Sprint manifest and implementation TASK with exact allowed paths, dependencies, maximum files, validation commands and report obligations. Reuse installed source-owned catalog/graph contracts; strict unknown-field, unsafe-key, cycle, size/node-count, version and revision rejection; deterministic round trips and atomic failure recovery are mandatory. Do not infer an implementation TASK from the readiness title.

Construction B persistence/UI stays forecast until codec proof and its own readiness gates pass. No durable Save/Open, full File Manager, .process format, Core business persistence, publish/deploy or complete Component Editor is implemented by this handoff.

## Coordination

Owner authorized serial direct GitHub work and bounded commits/merges with Actions. Preserve other open PRs and worker history. The shared Windows worktree was not inspected or changed in this GitHub-only reconciliation; old clean/lock observations are historical and must be revalidated before local execution. No force/reset or direct main writes. Recheck fresh main and competing PRs before each mutation. Report IMPLEMENTED, PROVEN, INTEGRATED and CLOSED separately.

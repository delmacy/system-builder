# Documentation & Closure Sprint Template

Goal: reconcile repository memory to the Work Package's integrated truth and close the package without adding product behavior.

## Preconditions
- Package Integration & Review disposition is `GO`;
- required construction/corrections are merged;
- integrated `main` and package evidence are known.

## Reconcile
- `docs/current/PROJECT_STATE.md`;
- `docs/current/CURRENT_MILESTONE.md`;
- `docs/current/NEXT_WORK.md`;
- Work Package status/report and Sprint reports;
- WBS/DAG/readiness and successor forecast;
- risks/issues/lessons;
- affected module/public/operations docs;
- ADR/contract references;
- traceability from package goal to delivered evidence.

## Closure checks
- no obsolete active gate is still described as current;
- no branch-only result is described as merged;
- no forecast successor is described as committed;
- residual functional gaps have explicit corrective/successor ownership;
- next planning gate is explicit;
- package status is closed only after repository memory matches integrated truth.

## Boundary
No new product behavior. If closure discovers a product gap, stop closure or record/block the correct construction/corrective successor according to package review disposition.

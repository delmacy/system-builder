# Next Work — STATION S4 Visual Factory Foundation

Date: 2026-10-10
Reconciled base: `main@d41085c6747dfceffc5b7b83d8f06cfda61dd651`
Status: WP1-A–G API increments INTEGRATED; corrective visual construction TASK-643 MATERIALIZED; WP1-H closure BLOCKED

## Authority

- Scope: `docs/contracts/002-station-visual-factory/ADDENDUM.md`.
- WP1 baseline: `project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md`.
- Gap review: `project_docs/execution_planning/STATION-S4-WP1G-INTEGRATION-AND-GAP-REVIEW-01.report.md`.
- Construction manifest: `project_docs/execution_planning/STATION-S4-WP1-VISUAL-WORKBENCH-CONSTRUCTION-01.md`.
- Sole next construction TASK: `specs/tasks/TASK-643-STATION-S4-WP1-VISUAL-WORKBENCH.md`.

## Verified integrated state

TASK-642 / WP1-G integrated through PR #1029, squash `d41085c6747dfceffc5b7b83d8f06cfda61dd651`. Reviewed head `53d6df8972f007390916168072df85ba4d7cf797` passed full exact-head and merge-candidate verification (Actions 38049443498 and 38049443470), heavy 38049443490 and handoff 38049443502. Local focused journey 6/6 and Station predecessor suite 38/38 passed. IMPLEMENTED / PROVEN / INTEGRATED applies to that API tranche only.

Existing `/component-editor` uses the earlier composition laboratory state; it is not the integrated WP1-A–G session journey. No complete WP1 visual workbench, keyboard/focus journey or accessibility proof is claimed. The package remains OPEN. C10 DEFERRED.

## Next executable action

1. Integrate this bounded planning PR only after fresh-head exact-head, merge-candidate, heavy and handoff checks plus semantic review.
2. From fresh main, execute only TASK-643 in `sprint/station-s4-wp1-visual-workbench` after the planning predecessor integrates.
3. Build a shared visual composition editor over existing public Station editor APIs; run browser journey, keyboard/focus and accessibility evidence plus declared repository and Station build gates.
4. Revalidate the package outcome after TASK-643 integrates; only then materialize WP1-H review/hardening. Closure cannot conceal missing visual construction.

## Execution coordination

Owner authorization on 2026-10-10 supersedes exclusive-local execution: serial commits directly on GitHub branches, one PR per bounded Sprint, Actions as objective validation, merge after all gates. Preserve `s4/serial-wp1` and the shared local checkpoint; do not force/reset/rebase shared history or overwrite worker changes. Any worker must re-read this pointer and fresh remote refs before writing. Honor the shared `execution.lock` while a serial writer holds it; never steal an active lease.

## Invariants and handoff

One Station-owned draft; Layers/Inspector/Preview are projections. Selection, focus, active context and expansion remain orthogonal. Discrete grid/span only. No Core/business/command authority, durable storage, provider/runtime/deploy/secrets, component-contract authoring, arbitrary HTML/CSS/pixels or C10 promotion.

Historical handoffs are preserved in the gap-review report as execution evidence, not a scheduler. Validation evidence belongs to its exact head/base; new commits invalidate earlier head evidence. Report IMPLEMENTED, PROVEN and INTEGRATED separately.

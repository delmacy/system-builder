# Review and Replanning Loop

## Every construction sprint
Validate Sprint Goal, acceptance criteria, tests, integration, evidence, documentation and dependency gates unlocked by completed work.

## Periodic system review
Initial cadence: after three construction sprints, run one Integration & Technical Debt Review cycle. Inspect cross-module integration, contract drift, architecture fitness, regressions, security, CI health, documentation, technical debt and unresolved risks.

## Replanning rule
Review may change forecast and future sprint candidates. It must not silently mutate the Scope Baseline. New scope requires change control; better decomposition or scheduling within approved scope updates the planning artifacts and DAG.

## Dependent successor handling
Do not keep a completed sprint permanently open because later work depends on it. Close it when its Goal/DoD is met. Any residual/new work becomes an explicit backlog item under the correct WP. If the successor discovers a predecessor defect, create a corrective item linked back to that predecessor and block only the affected path.

This preserves history, makes rework measurable and prevents endless sprint scope.

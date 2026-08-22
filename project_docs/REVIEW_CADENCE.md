# Review Cadence — Incremental Spiral

## Continuous gates
Every TASK/Sprint: scope, tests, contracts, architecture constraints, evidence and incremental documentation.

## Construction Sprint Review
At the end of every Construction Sprint: demonstrate the integrated increment, verify exact-head CI, update risks/issues/lessons and record carry-over explicitly.

## Package Integration & Review
For newly planned Work Packages, run one Package Integration & Review Sprint after two required Construction Sprints and an optional third only when fresh evidence proves it necessary.

Checklist: end-to-end integration; dependency drift; contract compatibility; architecture fitness; technical debt; tests/regression; security; performance when relevant; documentation consistency; traceability; obsolete code; CI health; agent/rework metrics; actual-vs-forecast effort.

The review may contain bounded corrections necessary to prove the already-built Package Goal, but it must not become a hidden feature Sprint.

## Documentation & Closure
After Package Integration & Review passes, run Documentation & Closure. Reconcile current-state documents, package/Sprint reports, WBS/DAG/readiness, risks/lessons and affected public/module/operations documentation. No new product behavior belongs here.

The package is not closed while current repository-memory documents still describe obsolete gates as active truth.

## Milestone review
Validate outcome, acceptance, scope-baseline impact, risks, quality, costs and readiness of the next horizon.

## Legacy packages
Packages materially executed before adoption of this cadence may finish under their explicitly recorded grandfathered review structure. Do not rewrite historical package reports.

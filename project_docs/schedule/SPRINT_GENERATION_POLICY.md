# Sprint Generation Policy — rolling-wave + dependency safe

## Decision

Do not close the whole project into detailed Sprints in advance. Keep the full baseline in WBS/Work Packages/DAG/milestones, maintain a short forecast horizon, and commit only the active Sprint.

The default Work Package cadence is now:

`1 Planning Sprint -> 2 Construction Sprints -> optional 3rd Construction Sprint -> 1 Package Integration & Review Sprint -> 1 Documentation & Closure Sprint`

A normal Work Package therefore contains five Sprints; it contains six only when the third Construction Sprint is justified by fresh integrated evidence.

This cadence replaces the former default of 4–8 construction Sprints plus one Integration & Technical Debt Review for newly planned Work Packages. Packages already materially executed under the previous cadence may be completed as legacy/grandfathered packages when repository memory explicitly records that choice; their history must not be rewritten retroactively.

## Where planning happens

Work Packages, WBS and TASK specs are generated locally by the maintainer's planning session and persisted in the repository. GitHub-hosted OpenCode generation/materialization workflows are disabled by repository decision; GitHub remains source/history and deterministic CI.

## Three horizons

1. **Baseline horizon** — WBS, Work Packages, DAG and milestones for the approved project scope.
2. **Forecast horizon** — candidate successor Sprints/Work Packages, goals, dependencies and exit proofs without execution authority.
3. **Commitment horizon** — only the active Sprint and its committed TASKs.

Forecast is never execution authority.

## Standard Work Package structure

### Sprint 0 — Planning & Materialization
Purpose: reconcile fresh `main`, revalidate scope/WBS/contracts/dependencies/risks, define the package growing proof and materialize only the first eligible Construction Sprint.

Planning may update repository memory, Work Package definitions, forecasts, DAG/readiness and task specifications. It must not hide product implementation inside planning work.

Required outputs:
- package goal and WBS coverage;
- predecessor/readiness gates;
- 2 required Construction Sprint forecasts and optional third candidate;
- goal and exit proof for each forecast Construction Sprint;
- growing integration/E2E proof across the package;
- Package Integration & Review gate;
- Documentation & Closure gate;
- only the first eligible Construction Sprint promoted/materialized to `COMMITTED`.

### Sprint 1–2 — Construction
Two Construction Sprints are the default minimum. Each Sprint must deliver a bounded integrated increment, execute committed TASKs in dependency order, extend the growing proof, run declared validations, receive exact-head CI and pass its Sprint Review before integration.

### Sprint 3 — optional Construction
A third Construction Sprint is not automatic. After Construction Sprint 2 is integrated, reconstruct fresh `main` and promote Sprint 3 only when evidence shows that additional bounded construction is necessary to achieve the Package Goal. If it is unnecessary, proceed directly to Package Integration & Review.

### Package Integration & Review Sprint
Purpose: evaluate the complete package outcome rather than add unrelated feature scope.

Inspect at minimum:
- end-to-end integration and regression;
- contract/schema drift and compatibility;
- architecture fitness and dependency accuracy;
- technical debt and duplicated abstractions;
- security/trust and CI health;
- performance where relevant;
- actual-vs-forecast effort;
- risks, residual gaps and readiness for closure/next package.

Small bounded corrections may be made only when necessary to prove the already constructed Package Goal. Missing product capability required by the Package Goal must return to explicit construction/change control rather than being hidden in the review.

### Documentation & Closure Sprint
Purpose: make repository memory match integrated truth before the Work Package is declared closed.

Documentation is still updated incrementally during every Sprint. This final Sprint is reconciliation and consolidation, not delayed documentation.

Required checks include, when applicable:
- `PROJECT_STATE`, `CURRENT_MILESTONE` and `NEXT_WORK`;
- Work Package status/report and Sprint reports;
- WBS/DAG/readiness/risks/lessons;
- public/module/operations documentation affected by the package;
- accepted ADR/contract references;
- traceability from delivered outcome to evidence;
- explicit package closure and next planning gate.

No new product behavior is introduced in Documentation & Closure. If documentation exposes a functional gap, record/block it under the correct construction or successor Work Package.

## Construction Sprint sizing

Construction Sprints should normally carry a bounded dependency-safe task set sized for reliable completion rather than an arbitrary quota. A common target remains roughly 10–15 TASKs when the decomposition naturally supports it, but the Sprint Goal and dependency graph are authoritative over task count.

## Closing rule

A started Sprint has a fixed goal, manifest and committed task set. Do not keep it indefinitely open for discoveries.

Discovery during a Sprint:
- defect necessary for the Sprint Goal: may enter bounded operational change control;
- new work not necessary to the Goal: record for backlog/successor;
- discovery invalidating contract/architecture: block successor and trigger baseline/ADR review as required.

Planning, Review and Documentation Sprints are not overflow buffers for delayed construction.

## Dependent successor handling

A successor may be forecast before its predecessor completes, but remains `FORECAST` until the predecessor is integrated and fresh repository truth is revalidated.

Before any successor becomes `COMMITTED`, re-read and verify:
- actual predecessor outputs;
- affected contracts and interfaces;
- dependencies/readiness;
- risks and scope;
- growing proof expected at exit;
- whether the optional third Construction Sprint is still necessary.

## Testing as part of planning

Every implementation TASK should declare when applicable:
- positive behavior;
- negative/failure behavior;
- integration with the real predecessor.

Every Construction Sprint extends an integrated proof. Package Integration & Review regresses the complete package chain reached to that point.

## Product test separation

- **`test:product` (core)** — deterministic in-memory contracts/catalog/assembly/compiler/deploy-dry-run/secret/observe/support tests; normal construction and Deterministic CI gate.
- **`test:product:heavy`** — real process/HTTP/TLS/Postgres/openssl work; automatic PR exact-head gate, plus nightly and manual/on-demand execution. The heavy workflow checks out the PR head SHA explicitly, uses concurrency scoped per PR/ref and cancels only obsolete runs of the same PR so unrelated PRs do not serialize behind one global heavy queue.
- **`test:product:full`** — composition of core + heavy for complete manual/local verification when infrastructure is available.

The classifier remains `scripts/run-product-tests.mjs`. New tests requiring process/server/socket/Postgres/openssl belong to heavy; pure in-memory tests belong to core.

## Review and closure cadence

Default for new Work Packages:

`Planning -> Construction A -> Construction B -> [Construction C only if justified] -> Package Integration & Review -> Documentation & Closure`

Each Construction Sprint still has its own Sprint Review/PR boundary. The package-level review does not replace Sprint CI/review.

## Work Package output

A closed package must leave:
- integrated outcome and regression evidence;
- technical debt classified;
- contracts/DAG/risks revalidated;
- repository memory reconciled to integrated truth;
- successor packages promoted/re-ranked only from real evidence;
- no historical Sprint/package status left masquerading as current authority.

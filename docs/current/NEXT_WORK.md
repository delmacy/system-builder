# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-02
Repository truth base: `main@f91f6107e3670898a5acdf15a6d7d77ac5442216`
Status: S3 / WP1 — TASK-615 CLOSED / NEXT LOT MATERIALIZATION ELIGIBLE

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`. Station-local `S3` deliberately avoids collision with the repository's historical/global milestone named `M3`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-SCOPE-WBS-WP1-PLAN-01.md`
- `specs/tasks/TASK-615-STATION-S3-C01-ADMISSION-SCHEMA-CONTRACTS.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Predecessor truth

PR #973 (`station-s3-wp1-construction-a`) merged C01 into main as `5ed671270e1e2dcd02b528673e7487e1e6b8f933`; merged PR head was `9a058fa170e09b01012e330645e62d4645acba98`.

The prior post-merge blocker compared the entire PR head against the old PR base `d2cd9b404501781de90564b2029277efdfcb023f` and observed 16 files. That comparison mixed pre-TASK research/planning lineage with TASK-615 execution. TASK-615's own exact-head authority was `269d9a2da0ece1f5a6d4305e931871bd4183abe0`. Comparing `269d9a2...` to `9a058fa...` yields **5 changed files**, satisfying `max_files: 12`. The bound was not weakened or reinterpreted retroactively.

Exact PR-head workflows were green before merge: Deterministic CI, Merge Candidate CI, Heavy Product Tests, Station Frontend Quality and Automation Handoff State Machine. TASK-615 is therefore **CLOSED / PROVEN** and its C01 evidence is inherited by the next lot.

## Coverage / boundaries carried forward

C01 admission/schema behavior and its exact-head evidence are predecessor proofs; do not retest primitive/admission behavior unless a next-lot precondition changes. Coverage vocabulary remains `proven | failed | unproven-gap | not-applicable`; absence of evidence is never PASS. Human acceptance remains distinct from machine conformance.

Preserve `ComponentRegistry != AppManifest`; identity != placement != presentation != action; semantic patterns above generic primitives; span/discrete composition distinct from WindowGeometry; Station without Core/business authority; C10 Studio DEFER/UNPROVEN.

## Handoff to Construction :10

Rolling-wave only. The next dependency-safe family is **C02 — canonical revision / projection convergence**, but no product mutation is authorized until the smallest C02 lot is materialized from fresh main with exact-head authority.

First action: census the post-C01 composition/editor/projection surfaces on fresh main, then materialize only the smallest C02 TASK/lote needed to establish one canonical revision owner and projection convergence/currentness semantics.

Required C02 delta proof obligations to materialize before implementation:
- one admitted mutation advances/identifies one canonical revision;
- Inspector/Layers/Graph/source-YAML/Preview are projections, not independent authorities;
- projections converge to the same canonical revision or explicitly report stale/currentness;
- stale projection/write cannot silently overwrite a newer canonical revision;
- C01 admission proofs are inherited where preconditions remain unchanged.

Allowed paths and `max_files` for C02 must come from the fresh-main census and the materialized TASK; do not infer them from C01. Until that materialization exists, product writes are forbidden.

Still forbidden: C03+ command/effect/retry semantics, AppManifest/runtime/deploy/provider expansion, Core/business authority, C10/Studio, AI/MCP, arbitrary product scope, or reopening C01 without evidence of regression.

## Next action

Revalidate fresh main after this pointer commit. If unchanged except this documentation, perform the C02 census and materialize the smallest dependency-safe Construction B lot with explicit allowed/forbidden paths, `max_files`, acceptance criteria, inherited proofs and delta proofs. Do not materialize the remainder of WP1/program in advance.

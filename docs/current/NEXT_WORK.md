# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-02
Repository truth base: `main@5ed671270e1e2dcd02b528673e7487e1e6b8f933`
Status: S3 / WP1 — CONSTRUCTION B MATERIALIZED — TASK-616 READY

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`. Station-local `S3` deliberately avoids collision with the repository's historical/global milestone named `M3`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-SCOPE-WBS-WP1-PLAN-01.md`
- `specs/tasks/TASK-616-STATION-S3-C01-INSPECTOR-SCHEMA-INTEGRATION.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Predecessor closure

WP1 Construction A / TASK-615 merged through PR #973 at fresh `main@5ed671270e1e2dcd02b528673e7487e1e6b8f933`. Its C01 admission/schema delta and exact-head evidence are predecessor truth. Construction B must inherit only proofs whose preconditions remain unchanged.

## Current phase / handoff

The smallest dependency-safe successor is **WP1 Construction B / TASK-616 — C01 Inspector Schema Integration**. TASK-616 is materialized on branch `planning/station-s3-wp1-construction-b` and is bounded to the schema-driven Inspector adapter/proof required by the existing WP1 plan. No C02+, Application/Studio, AppManifest, Core/runtime/deploy/provider or AI/MCP work is admitted.

## Preserved conformance constraints
- C0→C10 ordering remains intact; C10 Studio remains DEFER/UNPROVEN;
- `ComponentRegistry != AppManifest`;
- identity != placement != presentation != action semantics;
- semantic patterns remain above generic primitives;
- span/discrete composition remains distinct from WindowGeometry;
- Station remains presentation/composition-oriented and does not acquire Core/business authority;
- schema/Inspector projection is presentation-only and cannot strengthen owner truth;
- missing evidence is never PASS.

## TASK-616 bound

Objective: connect the merged TASK-615 schema resolver to the existing generic Property Inspector definition surface through the thinnest deterministic adapter. Schema-declared field identity/label/read-only metadata drives rows; caller values are explicit presentation inputs only. Unknown/undeclared fields fail closed or are excluded as specified by the task. `max_files: 8`; allowed/forbidden paths and validation commands are authoritative in TASK-616.

### Test Review / Hardening plan

During Construction, add the smallest positive, negative and predecessor-integration proof alongside behavior. Before closure, challenge unknown field IDs, undeclared caller values, ordering/determinism, read-only preservation and accidental semantic leakage into placement/action/AppManifest/Core. Record any residual obligation as FAILED or UNPROVEN-GAP rather than widening the task silently.

### QA Coverage / Evidence Review plan

Closure must classify each TASK-616 acceptance obligation as PROVEN / FAILED / UNPROVEN-GAP / NOT-APPLICABLE using executable evidence. Required validation includes lint, typecheck, product tests, architecture check and verify plus exact-head Deterministic CI, Merge Candidate CI, Heavy Product Tests and applicable Station/doc gates. Human acceptance remains separate from machine conformance.

## Handoff to next Construction slot

Branch: `planning/station-s3-wp1-construction-b`. Materialization commits begin at `80777ec82c1782000db628254e057bfea9a26369`; revalidate the branch exact head after this pointer commit before mutation. Eligible TASK: **TASK-616 only**. Blocker-first: if fresh main, dependency, allowed/forbidden paths, max-files or architecture boundaries changed, reconcile before code. Otherwise execute TASK-616 as one bounded implementation TASK with behavior + focused proof, then run declared validations and exact-head gates. Do not promote Construction C, WP2/C02+ or any DEFER item until TASK-616 evidence and WP1 closure obligations are reconciled.

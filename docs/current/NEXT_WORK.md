# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-02
Repository truth base: `main@d2cd9b404501781de90564b2029277efdfcb023f`
Status: S3 / WP1 — CONSTRUCTION A / TASK-615 IN PROGRESS — TASK CONTRACT REPAIR APPLIED; EXACT-HEAD GATES PENDING

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`. Station-local `S3` deliberately avoids collision with the repository's historical/global milestone named `M3`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-SCOPE-WBS-WP1-PLAN-01.md`
- `specs/tasks/TASK-615-STATION-S3-C01-ADMISSION-SCHEMA-CONTRACTS.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Current phase / handoff

**WP1 Construction A / TASK-615 remains BLOCKER-FIRST on draft PR #973, branch `station-s3-wp1-construction-a`.** Fresh main remains `d2cd9b404501781de90564b2029277efdfcb023f`.

The previously opaque deterministic failure on exact head `10c3a8cf27eb323e01556efbeb5f891967f56671` is now diagnosed from the full GitHub Actions job log. `npm run lint` and `npm run typecheck` passed; `npm run test` reached `test:unit` and failed four task-catalog tests because `TASK-615-STATION-S3-C01-ADMISSION-SCHEMA-CONTRACTS.md` did not contain the exact task-parser section headings: `Context`, `Current behavior`, `Required change`, `Inputs / contracts`, `Outputs / contracts`, `Acceptance criteria`, and `Evidence expected`.

This is a bounded TASK-615 task-contract defect, not a product/C01 behavior failure. The smallest repair was applied inside the declared allowed path `specs/tasks/TASK-615-STATION-S3-C01-ADMISSION-SCHEMA-CONTRACTS.md` in commit `4a5ec1ffe7a4af516f4c806f53cafa79448dd2cf`, preserving the existing C01 semantics and adding the parser-required canonical sections. This handoff update creates a successor documentation-only head; revalidate that exact head before any further mutation or closure claim.

## Preserved conformance constraints
- `ComponentRegistry != AppManifest`;
- identity != placement != presentation != action semantics;
- semantic patterns remain above generic primitives;
- span/discrete composition remains distinct from window geometry;
- Station remains presentation/composition-oriented and does not acquire Core/business authority;
- C10 Studio remains DEFER/UNPROVEN in WP1.

## TASK-615 bounded delta

Product/test delta remains three files: `packages/station-composition/admission.ts`, `packages/station-composition/index.ts`, and `tests/product/station-composition.test.ts`. The bounded task-contract repair adds only the TASK spec itself; this handoff updates `docs/current/NEXT_WORK.md`. All remain inside TASK-615 allowed paths and below `max_files: 12`. No AppManifest, Core/runtime/deploy/provider/Studio path is admitted.

## Evidence classification

For pre-repair exact head `10c3a8cf27eb323e01556efbeb5f891967f56671`:
- Station Frontend Quality: **PASS / PROVEN**;
- Heavy Product Tests: **PASS / PROVEN**;
- Automation Handoff State Machine: **PASS / PROVEN**;
- `npm run lint`: **PASS / PROVEN** within Deterministic CI log;
- `npm run typecheck`: **PASS / PROVEN** within Deterministic CI log;
- `npm run test:unit`: **FAILED**, specifically four task-catalog tests due to TASK-615 missing canonical parser headings;
- later `verify` subgates: **NOT REACHED / UNPROVEN**;
- Deterministic CI: **FAILED**;
- Merge Candidate CI: **FAILED**;
- TASK-615 closure: **BLOCKED pending successor exact-head evidence**;
- merge: **NOT AUTHORIZED**;
- Construction B/successor: **NOT ELIGIBLE**.

### Test Review / Hardening

The blocker is documentation/task-schema conformance. No evidence points to a C01 product behavior defect. Do not mutate `admission.ts` or broaden tests to compensate for the task parser. Existing C01 focused proofs remain the intended proof surface; their final classification must be made only on the successor exact head after deterministic verification completes.

### QA Coverage / Evidence Review

The previous `UNPROVEN` failure cause is now **PROVEN** by full job log. The repair itself is not yet proven until the successor exact-head CI executes. Absence of a new failure is not PASS. Required final evidence remains Deterministic CI, Merge Candidate CI, Heavy Product Tests and applicable Station quality/doc gates on the same current lineage.

## Next eligible work

Continue **TASK-615 only**. Revalidate the successor exact branch head produced by this handoff and collect its workflows. If deterministic verification passes, perform final Test Review/Hardening + QA Coverage/Evidence classification and close/merge TASK-615 only when every required exact-head/merge-candidate gate is proven. If a new failure appears, correct only the smallest bounded defect inside TASK-615 allowed paths. Do not start Construction B while TASK-615 closure remains failed, pending or unproven.

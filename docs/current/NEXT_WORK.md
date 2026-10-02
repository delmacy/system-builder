# Next Work — STATION S3 Component Grammar & Catalog

Date: 2026-10-02
Repository truth base: `main@d2cd9b404501781de90564b2029277efdfcb023f`
Status: S3 / WP1 — CONSTRUCTION A / TASK-615 IN PROGRESS — VERIFY BLOCKED

> Live execution pointer. Interpret with `docs/DOCUMENT_AUTHORITY.md`. Station-local `S3` deliberately avoids collision with the repository's historical/global milestone named `M3`.

## Authority
- `docs/DOCUMENT_AUTHORITY.md`
- `docs/contracts/001-station-component-grammar/ADDENDUM.md`
- `project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md`
- `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`
- `project_docs/execution_planning/STATION-S3-SCOPE-WBS-WP1-PLAN-01.md`
- `specs/tasks/TASK-615-STATION-S3-C01-ADMISSION-SCHEMA-CONTRACTS.md`
- ADR-0017 / `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Current phase / :40 handoff

**WP1 Construction A / TASK-615 — C01 Admission & Schema Contracts remains BLOCKER-FIRST on draft PR #973, branch `station-s3-wp1-construction-a`.**

Fresh main is `d2cd9b404501781de90564b2029277efdfcb023f`. Exact PR head evaluated in this handoff is `10c3a8cf27eb323e01556efbeb5f891967f56671`; GitHub reports the PR mergeable and exposes merge-candidate SHA `5f9e6097cd330cebdca7360a8b8ab4eeb23c45fe`. Evidence is SHA-scoped: exact-head and merge-candidate results are distinct and must not be reused after either lineage changes.

## Preserved conformance constraints
- `ComponentRegistry != AppManifest`;
- identity != placement != presentation != action semantics;
- semantic patterns remain above generic primitives;
- span/discrete composition authoring remains distinct from window geometry;
- focus != selection != active != expansion;
- accepted/acknowledged != effective/current;
- Station remains presentation/composition-oriented and does not acquire Core/business authority;
- C10 Studio remains DEFER/UNPROVEN in WP1;
- lower-level evidence is inherited only while its preconditions and tested SHA remain unchanged.

## TASK-615 bounded delta

Construction A product/test delta remains three files: `packages/station-composition/admission.ts`, `packages/station-composition/index.ts`, and `tests/product/station-composition.test.ts`. The contract is Station-owned/domain-neutral and fail-closed for component/parent/slot/span/variant/schema-field admission. No AppManifest, Core/runtime/deploy/provider/Studio path is admitted by this TASK.

## :40 evidence classification

For exact PR head `10c3a8cf27eb323e01556efbeb5f891967f56671`:
- Station Frontend Quality: **PASS / PROVEN**;
- Heavy Product Tests: **PASS / PROVEN**;
- Automation Handoff State Machine: **PASS / PROVEN**;
- Deterministic CI exact-head: **FAILED** at `Run deterministic repository verification` after exact-head identity assertion, Node 24 setup and locked dependency install;
- Merge Candidate CI: **FAILED** at `Run deterministic repository verification against merge candidate` after merge-candidate identity assertion, Node 24 setup and locked dependency install;
- concrete failing `npm run verify` subgate/stdout: **UNPROVEN** with currently exposed connected evidence;
- TASK-615 closure: **FAILED/BLOCKED**;
- merge: **NOT AUTHORIZED**;
- Construction B/successor: **NOT ELIGIBLE**.

The previous `5ff42d4e708a930a5119d56cf7817be83de81f0c` evidence is stale for exact-head closure because the PR advanced. The new `10c3a8cf…` run independently confirms that deterministic verification now fails on the exact head as well as on its merge candidate; this is therefore not classifiable as merge-candidate-only drift.

## Findings

Corrected/closed in this handoff:
- stale-head ambiguity: fresh main and exact PR head were re-read;
- exact-head versus merge-candidate evidence is explicitly separated;
- earlier characterization of deterministic failure as merge-candidate-only is superseded by the new exact-head failure.

Remaining blocker:
- deterministic repository verification fails on both tested lineages, but the available GitHub connector exposes only the failing workflow step and not its stdout/subcommand. Do not guess whether lint, typecheck, product tests, task validation, architecture/docs validation or build is the failing subgate. No speculative product mutation is authorized.

## Next eligible work

Continue **TASK-615 only**, blocker-first. First obtain the concrete deterministic verification failure from the exact tested lineage by full workflow log or faithful local reproduction. Classify the subgate, then apply only the smallest correction inside TASK-615 `allowed_paths`. If correction requires a forbidden path, C02+ semantic, new owner/Core contract or >12-file TASK delta, stop and rematerialize.

After any correction, re-read fresh main and exact PR head, then rerun/revalidate exact-head Deterministic CI, Merge Candidate CI, Heavy Product Tests and applicable Station quality/doc gates. Final Test Review/Hardening and QA Coverage/Evidence classification must be made only on the tested exact head. Do not merge and do not release Construction B while deterministic or merge-candidate verification is FAILED/UNPROVEN.

This documentation-only handoff commit creates a successor branch head. Revalidate that successor exact head before any further product mutation.
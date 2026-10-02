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

## Predecessor closure

Station M2 Component Composition/Editor is CLOSED. S3-R1 through R7 and R7B are research-complete for the admitted C0→C9 question. S3 synthesis/Decision Graph, QA Gates, Construction Materialization and Scope/WBS/WP1 planning are materialized on the predecessor branch. C10 Studio remains DEFER/UNPROVEN. Research evidence does not independently create product or Core authority.

## Current phase

**WP1 Construction A / TASK-615 — C01 Admission & Schema Contracts is in progress on `station-s3-wp1-construction-a`.**

Construction materialization was revalidated from `station-s3-synthesis-decision-graph@1f63a4031cb386321e7464ed6f428e620efb74bf` over fresh `main@d2cd9b404501781de90564b2029277efdfcb023f`. No intervening authority, dependency, path-bound, file-bound or proof-scope change was found before the first product mutation.

Draft PR: #973. Last fully evaluated exact-head evidence: `5ff42d4e708a930a5119d56cf7817be83de81f0c`. This handoff update creates a successor documentation-only head; revalidate that resulting exact head before any further product mutation.

## Preserved constraints
- `ComponentRegistry != AppManifest`;
- `WindowGeometry != composition grid`;
- Station remains presentation/composition-oriented;
- identity != placement != presentation != action semantics;
- constrained variants/patterns over arbitrary HTML/CSS;
- span/discrete composition authoring with responsive execution;
- semantic patterns remain above generic primitives;
- lower-level proofs are inherited only when their preconditions remain unchanged; missing evidence is never PASS;
- human acceptance remains distinct from machine conformance;
- research/QA cannot silently create Core/business/product authority;
- no specialized Studios, no C10 promotion, and no AI/MCP foundation in WP1.

## TASK-615 delta and evidence state

Changed by Construction A:
- `packages/station-composition/admission.ts` — Station-owned, domain-neutral C01 admission/schema contract; validates component/parent/slot/span/variant/schema-field compatibility before returning an admitted contract; no mutation or Core/business authority;
- `packages/station-composition/index.ts` — exports the C01 contract;
- `tests/product/station-composition.test.ts` — focused valid, negative/adversarial, determinism, zero-caller-mutation, family/span compatibility, schema-driven Inspector-field availability, action-vs-presentation and stable-identity proofs.

The TASK product/test delta is 3 files, inside `max_files: 12` and allowed paths. No forbidden path, C02+ semantic, AppManifest, runtime, deploy, provider, Core/business or Studio change has been introduced.

### Test Review / Hardening

Static review of the focused evidence finds explicit coverage for unknown component/slot/variant/schema field, incompatible family/span, repeated valid admission determinism, caller state preservation on rejection, schema-driven field selection, action tokens absent from the admitted presentation variants, and identity independence from placement/presentation. The contract is pure/fail-closed: callers receive an admitted immutable value only after all checks pass.

Exact-head CI evidence for `5ff42d4e708a930a5119d56cf7817be83de81f0c` now exists. Heavy Product Tests passed and Station Frontend Quality passed. Deterministic CI and Merge Candidate CI failed. Both failing workflows reached the deterministic repository verification step after exact-head checkout, identity assertion, Node 24 setup and locked dependency installation; the available connected evidence does not expose the failing `npm run verify` subcommand/stdout. Do not guess the cause or broaden the TASK.

### QA Coverage / Evidence

Evidence classification for exact head `5ff42d4e708a930a5119d56cf7817be83de81f0c`:
- Heavy Product Tests: **PROVEN / PASS**;
- Station Frontend Quality: **PROVEN / PASS**;
- Automation Handoff State Machine: **PROVEN / PASS**;
- Deterministic CI / `npm run verify`: **FAILED**;
- Merge Candidate CI: **FAILED**;
- TASK-615 closure: **BLOCKED**;
- merge: **NOT AUTHORIZED**.

The failure is bounded to repository verification as currently observed, but its concrete subgate remains `unproven-gap` until stdout/log evidence or a faithful local reproduction identifies whether `lint`, `typecheck`, core product tests, task validation, architecture, docs, or build failed. Absence of that diagnostic is not permission to modify product code speculatively.

## Next eligible work

Continue **TASK-615 only**, blocker-first, on PR #973. Revalidate fresh main and the successor exact branch head created by this handoff. Obtain the concrete `npm run verify` failure from the exact tested lineage, preferably by faithful local reproduction or full workflow log. Classify the failing subgate, then apply only the smallest correction inside TASK-615 `allowed_paths`; if the correction requires a forbidden path, C02+ semantic, new owner/Core contract or >12-file TASK delta, stop and rematerialize instead.

After any correction, rerun exact-head Deterministic CI, Merge Candidate CI, Heavy Product Tests and applicable Station quality/doc gates. Perform final Test Review/Hardening and QA Coverage/Evidence classification only on the tested exact head. Do not merge while required gates fail or remain unproven. Do not start Construction B merely because Construction A code exists; evidence after TASK-615 decides whether WP1 needs Construction B/C...N.